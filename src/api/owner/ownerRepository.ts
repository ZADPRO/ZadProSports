import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import { storeFile, viewFile, deleteFile } from "../../helper/storage";
import path from "path";
import { encrypt } from "../../helper/encrypt";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { buildUpdateQuery, getChanges } from "../../helper/buildquery";

import {
  generateTokenWithExpire,
  generateTokenWithoutExpire,
} from "../../helper/token";

import { CurrentTime, generatePassword } from "../../helper/common";
import {
  approveOwnerQuery,
  checkQuery,
  deleteOwnerQuery,
  getImageRecordQuery,
  getLastPartnerIdQuery,
  getOwnersQuery,
  getUserDetailsQuery,
  insertUserDomainQuery,
  insertUserQuery,
  listOwnersQuery,
  listSportCategoryQuery,
  OwnersHistoryQuery,
  updateduserTypeQuery,
  updateHistoryQuery,
  updateOwnerStatusQuery,
  updateUserDomainQuery,
  updateUserQuery,
} from "./query";
import {
  generateFormSubmittedContent,
  generateSignupEmailContent,
  getOwnerStatusEmailContent,
  OWNER_STATUS,
  OwnerStatusLabels,
} from "../../helper/mailcontent";
import { sendEmail } from "../../helper/mail";

export class ownerRepository {
  public async addOwnersV1(userData: any, token_data?: any): Promise<any> {
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN");
      const {
        refOwnerFname,
        refOwnerLname,
        refEmailId,
        refMobileId,
        refCustPassword,
        refAadharId,
        refPANId,
        refGSTnumber,
        isOwnGround,
        refGroundImage,
        refGroundDescription,
        refBankName,
        refBankBranch,
        refAcHolderName,
        refAccountNumber,
        refIFSCcode,
        refDocument1Path,
        refDocument2Path,
        isDefaultAddress,
      } = userData;
      console.log("userData", userData);

      const genHashedPassword = await bcrypt.hash(refCustPassword, 10);

      // Check if the email already exists
      const check = [refEmailId];
      const userCheck = await client.query(checkQuery, check);
      const count = Number(userCheck.rows[0]?.count || 0);

      if (count > 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "Email Already exists",
          },
          true
        );
      }

      const customerPrefix = "CGA-OWN-";
      const baseNumber = 0;

      const lastCustomerResult = await client.query(getLastPartnerIdQuery);
      let newCustomerId: string;

      if (lastCustomerResult.rows.length > 0) {
        const lastNumber = parseInt(lastCustomerResult.rows[0].count, 10);
        newCustomerId = `${customerPrefix}${(baseNumber + lastNumber + 1)
          .toString()
          .padStart(4, "0")}`;
      } else {
        newCustomerId = `${customerPrefix}${(baseNumber + 1)
          .toString()
          .padStart(4, "0")}`;
      }

      // Insert into users table
      const params = [
        newCustomerId,
        refOwnerFname,
        refOwnerLname,
        refEmailId,
        refMobileId,
        refCustPassword,
        genHashedPassword,
        refAadharId,
        refPANId,
        refGSTnumber,
        isOwnGround,
        refGroundImage,
        refGroundDescription,
        refBankName,
        refBankBranch,
        refAcHolderName,
        refAccountNumber,
        refIFSCcode,
        refDocument1Path,
        refDocument2Path,
        isDefaultAddress,
        3,
        `Draft`,
        CurrentTime(),
        3,
      ];

      const userResult = await client.query(insertUserQuery, params);
      const newUser = userResult.rows[0];

      const allSportDetails = [];
      const commonAddress = userData.groundAddress || null;

      if (Array.isArray(userData.refGroundSports)) {
        for (const sport of userData.refGroundSports) {
          const sportAddress = userData.isDefaultAddress
            ? commonAddress
            : sport.groundAddress;

          if (!sportAddress) {
            throw new Error(`Missing ground address for sport ID: ${sport.id}`);
          }

          const insertSportQuery = `
          INSERT INTO "userSportsMapping"
            ("refOwnerId", "refSportsCategoryId", "groundAddress",  "createdAt", "createdBy")
          VALUES ($1, $2, $3, $4, $5)
        `;

          const sportParams = [
            newUser.refOwnerId,
            sport.id,
            sportAddress,
            CurrentTime(),
            newUser.refOwnerId,
          ];

          const sportInsertResult = await client.query(
            insertSportQuery,
            sportParams
          );
          allSportDetails.push(sportInsertResult.rows[0]);
        }
      }

      if ((userResult.rowCount ?? 0) > 0) {
        const history = [
          36,
          newUser.refOwnerId,
          `${refOwnerFname} Owner form submitted succcesfully`,
          CurrentTime(),
          newUser.refOwnerId,
        ];
        const updateHistory = await client.query(updateHistoryQuery, history);

        if ((updateHistory.rowCount ?? 0) > 0) {
          // Send confirmation email async
          const main = async () => {
            const mailOptions = {
              to: refEmailId,
              subject:
                "Your form has been submitted successfully on our platform",
              html: generateFormSubmittedContent(refOwnerFname),
            };

            try {
              sendEmail(mailOptions);
            } catch (error) {
              console.error("Failed to send email:", error);
            }
          };
          main().catch(console.error);

          await client.query("COMMIT");
          return encrypt(
            {
              success: true,
              message: "Owner added successfully",
              user: newUser,
              sportDetails: allSportDetails,
              roleId: 3,
            },
            true
          );
        }
      }

      await client.query("ROLLBACK");
      return encrypt(
        {
          success: false,
          message: "Failed to add owner",
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      console.error("Error during Owner added:", error);
      return encrypt(
        {
          success: false,
          message: "An unexpected error occurred during Owner added",
          error: error instanceof Error ? error.message : String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }

  public async uploadGroundImageV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    // const token = { id: tokendata.id };
    // const token = { id: tokendata.id, roleId: tokendata.roleId };
    // const tokens = generateTokenWithExpire(token, true);
    try {
      // Extract the image from userData
      const image = userData.Image;
      console.log("userData.Image", userData.Image);

      // Ensure that only one image is provided
      if (!image) {
        throw new Error("Please provide an image.");
      }

      let filePath: string = "";
      let storedFiles: any[] = [];

      // Store the image
      filePath = await storeFile(image, 2);

      // Read the file buffer and convert it to Base64
      const imageBuffer = await viewFile(filePath);
      const imageBase64 = imageBuffer.toString("base64");

      storedFiles.push({
        filename: path.basename(filePath),
        content: imageBase64,
        contentType: "image/jpeg", // Assuming the image is in JPEG format
      });

      // Return success response
      return encrypt(
        {
          success: true,
          message: "Image Stored Successfully",
          // token: tokens,
          filePath: filePath,
          files: storedFiles,
        },
        true
      );
    } catch (error) {
      console.error("Error occurred:", error);
      return encrypt(
        {
          success: false,
          message: "Error in Storing the Image",
          // token: tokens,
        },
        true
      );
    }
  }
  public async uploadownerDocuments1V1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    // const token = { id: tokendata.id };
    // const token = { id: tokendata.id, roleId: tokendata.roleId };

    // const tokens = generateTokenWithExpire(token, true);
    try {
      // Extract the PDF file from userData
      const pdfFile = userData["PdfFile "] || userData.PdfFile;

      // Ensure that a PDF file is provided
      if (!pdfFile) {
        throw new Error("Please provide a PDF file.");
      }

      let filePath: string = "";
      let storedFiles: any[] = [];

      // Store the PDF file
      filePath = await storeFile(pdfFile, 4); // Assuming storeFile handles PDF storage

      // Read the file buffer and convert it to Base64
      const pdfBuffer = await viewFile(filePath);
      const pdfBase64 = pdfBuffer.toString("base64");

      storedFiles.push({
        filename: path.basename(filePath),
        content: pdfBase64,
        contentType: "application/pdf",
      });

      // Return success response
      return encrypt(
        {
          success: true,
          message: "PDF Stored Successfully",
          // token: tokens,
          filePath: filePath,
          files: storedFiles,
        },
        true
      );
    } catch (error) {
      console.error("Error occurred:", error);
      return encrypt(
        {
          success: false,
          message: "Error in Storing the PDF",
          // token: tokens,
        },
        true
      );
    }
  }
  public async uploadownerDocuments2V1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    // const token = { id: tokendata.id };
    // const token = { id: tokendata.id, roleId: tokendata.roleId };

    // const tokens = generateTokenWithExpire(token, true);
    try {
      // Extract the PDF file from userData
      const pdfFile = userData["PdfFile "] || userData.PdfFile;

      // Ensure that a PDF file is provided
      if (!pdfFile) {
        throw new Error("Please provide a PDF file.");
      }

      let filePath: string = "";
      let storedFiles: any[] = [];

      // Store the PDF file
      filePath = await storeFile(pdfFile, 4); // Assuming storeFile handles PDF storage

      // Read the file buffer and convert it to Base64
      const pdfBuffer = await viewFile(filePath);
      const pdfBase64 = pdfBuffer.toString("base64");

      storedFiles.push({
        filename: path.basename(filePath),
        content: pdfBase64,
        contentType: "application/pdf",
      });

      // Return success response
      return encrypt(
        {
          success: true,
          message: "PDF Stored Successfully",
          // token: tokens,
          filePath: filePath,
          files: storedFiles,
        },
        true
      );
    } catch (error) {
      console.error("Error occurred:", error);
      return encrypt(
        {
          success: false,
          message: "Error in Storing the PDF",
          // token: tokens,
        },
        true
      );
    }
  }
  public async deleteimagesV1(userData: any, tokendata: any): Promise<any> {
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);
    try {
      let filePath: string | any;
      let filePaths: string[] = [];

      if (userData.refOwnerId) {
        // Retrieve the image record from the database
        const imageRecord = await executeQuery(getImageRecordQuery, [
          userData.refOwnerId,
        ]);

        if (imageRecord.length === 0) {
          return encrypt(
            {
              success: false,
              message: "Image record not found",
              token: tokens,
            },
            true
          );
        }

        const record = imageRecord[0];

        filePaths = [
          record.refGroundImage,
          record.refDocument1Path,
          record.refDocument2Path,
        ].filter(Boolean); // removes null/undefined

        // const DeleteImage = await executeQuery(deleteGroundImageRecordQuery, [
        //   userData.refGroundId,
        // ]);
      } else if (userData.filePath) {
        // Fallback path deletion
        filePath = userData.filePath;
      } else {
        return encrypt(
          {
            success: false,
            message: "No user ID or file path provided for deletion",
            token: tokens,
          },
          true
        );
      }
      if (filePath) {
        await deleteFile(filePath); // Delete file from local storage
      }

      return encrypt(
        {
          success: true,
          message: "Employee profile image deleted successfully",
          token: tokens,
        },
        true
      );
    } catch (error) {
      console.error("Error in deleting file:", (error as Error).message); // Log the error for debugging
      return encrypt(
        {
          success: false,
          message: `Error In Deleting Image: ${(error as Error).message}`,
          token: tokens,
        },
        true
      );
    }
  }
  public async listOwnersV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log("token", token);
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listOwnersQuery);

      // for (const product of result) {
      //   if (product.refGroundImage) {
      //     try {
      //       const fileBuffer = await viewFile(product.refGroundImage);
      //       product.refGroundImage = {
      //         filename: path.basename(product.refGroundImage),
      //         content: fileBuffer.toString("base64"),
      //         contentType: "image/jpeg", // Change based on actual file type if necessary
      //       };
      //     } catch (err) {
      //       console.error(
      //         "Error reading image file for product ${product.productId}:",
      //         err
      //       );
      //       product.refGroundImage = null; // Handle missing or unreadable files gracefully
      //     }
      //   }
      // }

      return encrypt(
        {
          success: true,
          message: "owner listed successfully",
          token: tokens,
          result: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list owner", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list owner",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async getOwnersV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log("token", token);
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(getOwnersQuery, [userData.refOwnerId]);
      console.log("result", result);

      for (const product of result) {
        if (product.refGroundImage) {
          try {
            const fileBuffer = await viewFile(product.refGroundImage);
            product.refGroundImage = {
              filename: path.basename(product.refGroundImage),
              content: fileBuffer.toString("base64"),
              contentType: "image/jpeg", // Change based on actual file type if necessary
            };
          } catch (err) {
            console.error("Error reading image file for product ", err);
            product.refGroundImage = null; // Handle missing or unreadable files gracefully
          }
        }
        // if (product.refDocument1Path) {
        //   try {
        //     const fileBuffer = await viewFile(product.refDocument1Path);
        //     product.refDocument1Path = {
        //       filename: path.basename(product.refDocument1Path),
        //       content: fileBuffer.toString("base64"),
        //       contentType: "application/pdf", // Change based on actual file type if necessary
        //     };
        //   } catch (err) {
        //     console.error("Error reading image file for product ", err);
        //     product.refDocument1Path = null; // Handle missing or unreadable files gracefully
        //   }
        // }
        // if (product.refDocument2Path) {
        //   try {
        //     const fileBuffer = await viewFile(product.refDocument2Path);
        //     product.refDocument2Path = {
        //       filename: path.basename(product.refDocument2Path),
        //       content: fileBuffer.toString("base64"),
        //       contentType: "application/pdf", // Change based on actual file type if necessary
        //     };
        //   } catch (err) {
        //     console.error("Error reading image file for product ", err);
        //     product.refDocument2Path = null; // Handle missing or unreadable files gracefully
        //   }
        // }
      }

      return encrypt(
        {
          success: true,
          message: "owner listed successfully",
          token: tokens,
          result: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list owner", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list owner",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async getOwnerDocumentsV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log("token", token);
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(getOwnersQuery, [userData.refOwnerId]);

      for (const product of result) {
        // if (product.refGroundImage) {
        //   try {
        //     const fileBuffer = await viewFile(product.refGroundImage);
        //     product.refGroundImage = {
        //       filename: path.basename(product.refGroundImage),
        //       content: fileBuffer.toString("base64"),
        //       contentType: "image/jpeg", // Change based on actual file type if necessary
        //     };
        //   } catch (err) {
        //     console.error("Error reading image file for product ", err);
        //     product.refGroundImage = null; // Handle missing or unreadable files gracefully
        //   }
        // }
        if (product.refDocument1Path) {
          try {
            const fileBuffer = await viewFile(product.refDocument1Path);
            product.refDocument1Path = {
              filename: path.basename(product.refDocument1Path),
              content: fileBuffer.toString("base64"),
              contentType: "image/jpeg", // Change based on actual file type if necessary
            };
          } catch (err) {
            console.error("Error reading image file for product ", err);
            product.refDocument1Path = null; // Handle missing or unreadable files gracefully
          }
        }
        if (product.refDocument2Path) {
          try {
            const fileBuffer = await viewFile(product.refDocument2Path);
            product.refDocument2Path = {
              filename: path.basename(product.refDocument2Path),
              content: fileBuffer.toString("base64"),
              contentType: "image/jpeg", // Change based on actual file type if necessary
            };
          } catch (err) {
            console.error("Error reading image file for product ", err);
            product.refDocument2Path = null; // Handle missing or unreadable files gracefully
          }
        }
      }

      return encrypt(
        {
          success: true,
          message: "owner listed successfully",
          token: tokens,
          documentresult: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list owner", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list owner",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async updateOwnersV1(userData: any, token_data?: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: token_data.id, roleId: token_data.roleId };
    console.log("token", token);
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");

      const {
        refOwnerFname,
        refOwnerLname,
        refEmailId,
        refMobileId,
        refCustPassword,
        refAadharId,
        refPANId,
        refGSTnumber,
        isOwnGround,
        refGroundImage,
        refGroundDescription,
        refBankName,
        refBankBranch,
        refAcHolderName,
        refAccountNumber,
        refIFSCcode,
        refDocument1Path,
        refDocument2Path,
        groundAddress,
        isDefaultAddress,
        refGroundSports,
      } = userData;

      const genHashedPassword = await bcrypt.hash(refCustPassword, 10);

      // Update users table
      const userParams = [
        refOwnerFname,
        refOwnerLname,
        refEmailId,
        refMobileId,
        refCustPassword,
        genHashedPassword,
        refAadharId,
        refPANId,
        refGSTnumber,
        isOwnGround,
        refGroundImage,
        refGroundDescription,
        refBankName,
        refBankBranch,
        refAcHolderName,
        refAccountNumber,
        refIFSCcode,
        refDocument1Path,
        refDocument2Path,
        CurrentTime(),
        token_data.id, // updatedBy
        token_data.id, // where refOwnerId = ?
      ];

      const updateUserSql = `
      UPDATE "users"
      SET
        "refOwnerFname" = $1,
        "refOwnerLname" = $2,
        "refEmailId" = $3,
        "refMobileId" = $4,
        "refCustPassword" = $5,
        "genHashedPassword" = $6,
        "refAadharId" = $7,
        "refPANId" = $8,
        "refGSTnumber" = $9,
        "isOwnGround" = $10,
        "refGroundImage" = $11,
        "refGroundDescription" = $12,
        "refBankName" = $13,
        "refBankBranch" = $14,
        "refAcHolderName" = $15,
        "refAccountNumber" = $16,
        "refIFSCcode" = $17,
        "refDocument1Path" = $18,
        "refDocument2Path" = $19,
        "updatedAt" = $20,
        "updatedBy" = $21
      WHERE "refOwnerId" = $22
      RETURNING *
    `;

      userParams.push(token_data.id);

      const userResult = await client.query(updateUserSql, userParams);

      // Soft delete existing sports mappings
      const softDeleteQuery = `
      UPDATE "userSportsMapping"
      SET "isDelete" = true, "deletedAt" = $2, "deletedBy" = $3
      WHERE "refOwnerId" = $1
    `;
      await client.query(softDeleteQuery, [
        token_data.id,
        CurrentTime(),
        token_data.id,
      ]);

      // Insert updated sports preferences
      const allSportDetails = [];
      const commonAddress = groundAddress || null;

      if (Array.isArray(refGroundSports)) {
        for (const sport of refGroundSports) {
          const sportAddress = isDefaultAddress
            ? commonAddress
            : sport.groundAddress;
          if (!sportAddress) {
            throw new Error(`Missing ground address for sport ID: ${sport.id}`);
          }

          const insertSportQuery = `
          INSERT INTO "userSportsMapping"
            ("refOwnerId", "refSportsCategoryId", "groundAddress", "createdAt", "createdBy")
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `;

          const sportParams = [
            token_data.id,
            sport.id,
            sportAddress,
            CurrentTime(),
            token_data.id,
          ];

          const sportInsertResult = await client.query(
            insertSportQuery,
            sportParams
          );
          allSportDetails.push(sportInsertResult.rows[0]);
        }
      }

      if ((userResult.rowCount ?? 0) > 0) {
        // Insert history record
        const historyParams = [
          37,
          token_data.id,
          `${refOwnerFname} Owner updated successfully`,
          CurrentTime(),
          token_data.id,
        ];

        const historyResult = await client.query(
          updateHistoryQuery,
          historyParams
        );

        if ((historyResult.rowCount ?? 0) > 0) {
          await client.query("COMMIT");
          return encrypt(
            {
              success: true,
              message: "Owner update successful",
              user: userResult.rows[0],
              sportDetails: allSportDetails,
              roleId: 3,
              token: tokens,
            },
            true
          );
        }
      }

      await client.query("ROLLBACK");
      return encrypt(
        {
          success: false,
          message: "Owner update failed",
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      console.error("Error during Owner update:", error);
      return encrypt(
        {
          success: false,
          message: "An unexpected error occurred during Owner update",
          error: error instanceof Error ? error.message : String(error),
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }

  public async deleteOwnersV1(userData: any, tokendata: any): Promise<any> {
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log("token", token);

    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN"); // Start transaction

      const { refOwnerId } = userData;
      const result = await client.query(deleteOwnerQuery, [
        refOwnerId,
        CurrentTime(),
        tokendata.id,
      ]);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "booking not found or already deleted",
            token: tokens,
          },
          true
        );
      }

      const history = [
        38, // Unique ID for delete action
        tokendata.id,
        `Owner deleted succesfully`,
        CurrentTime(),
        tokendata.id,
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "Owner deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting Owner:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the Owner",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }

  public async ownerStatusV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log("token", token);
    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN");

      const { refOwnerId, newStatus, content } = userData;

      // 1. Fetch owner details
      const getUserDetails = await executeQuery(getUserDetailsQuery, [
        refOwnerId,
      ]);

      if (!getUserDetails.length) {
        throw new Error("Owner not found");
      }

      const { refUserFname, refEmailId } = getUserDetails[0];

      // 2. Update status in database
      const updatedStatus = await client.query(updateOwnerStatusQuery, [
        newStatus,
        refOwnerId,
      ]);

      // Declare here to avoid reference error
      let updateduserType: any = null;

      // 3. Conditionally update user type if onboarded
      if (newStatus === "ONBOARDED") {
        updateduserType = await client.query(updateduserTypeQuery, [
          refOwnerId,
        ]);
      }

      // 3. Generate email content
      const { subject, body } = getOwnerStatusEmailContent(
        refUserFname,
        newStatus,
        content
      );

      // 4. Send email
      await sendEmail({
        to: refEmailId,
        subject,
        html: body,
      });

      const history = [
        24,
        tokendata.id,
        `${refUserFname}'s status changed to ${OwnerStatusLabels[newStatus]} successfully`,
        CurrentTime(),
        tokendata.id,
      ];
      await client.query(updateHistoryQuery, history);

      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Owner status updated and email sent successfully",
          token: tokens,
          updatedStatus: updatedStatus,
          updateduserType: updateduserType,
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      console.error("Error in ownerStatusV1:", error);

      return encrypt(
        {
          success: false,
          message: "Error while updating owner status",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }

  public async ownerHistoryWithStatusV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log("token", token);
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(OwnersHistoryQuery, [tokendata.id]);
      console.log('result', result)

      for (const product of result) {
        if (product.refGroundImage) {
          try {
            const fileBuffer = await viewFile(product.refGroundImage);
            product.refGroundImage = {
              filename: path.basename(product.refGroundImage),
              content: fileBuffer.toString("base64"),
              contentType: "image/jpeg", // Change based on actual file type if necessary
            };
          } catch (err) {
            console.error("Error reading image file for product ", err);
            product.refGroundImage = null; // Handle missing or unreadable files gracefully
          }
        }
        if (product.refDocument1Path) {
          try {
            const fileBuffer = await viewFile(product.refDocument1Path);
            product.refDocument1Path = {
              filename: path.basename(product.refDocument1Path),
              content: fileBuffer.toString("base64"),
              contentType: "application/pdf", // Change based on actual file type if necessary
            };
          } catch (err) {
            console.error("Error reading image file for product ", err);
            product.refDocument1Path = null; // Handle missing or unreadable files gracefully
          }
        }
        if (product.refDocument2Path) {
          try {
            const fileBuffer = await viewFile(product.refDocument2Path);
            product.refDocument2Path = {
              filename: path.basename(product.refDocument2Path),
              content: fileBuffer.toString("base64"),
              contentType: "application/pdf", // Change based on actual file type if necessary
            };
          } catch (err) {
            console.error("Error reading image file for product ", err);
            product.refDocument2Path = null; // Handle missing or unreadable files gracefully
          }
        }
      }

      return encrypt(
        {
          success: true,
          message: "owner listed successfully",
          token: tokens,
          result: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list owner", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list owner",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async listSportsCategoryV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    try {
      const result = await executeQuery(listSportCategoryQuery);

      return encrypt(
        {
          success: true,
          message: "Sports Category Name listed successfully",
          // token: tokens,
          result: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error liting Sports Category Name:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while listing the Sports Category Name",
          // token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
}
