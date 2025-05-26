import { executeQuery, getClient } from "../../helper/db";
import { Client, PoolClient } from "pg";
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

import {
  updateHistoryQuery,
  addGroundQuery,
  getLastGroundIdQuery,
  getImageRecordQuery,
  deleteImageRecordQuery,
  deleteGroundImageRecordQuery,
  updateGroundQuery,
  listGroundQuery,
  deleteGroundQuery,
  getGroundQuery,
  listBookedDatesQuery,
  addAddOnsQuery,
  updateAddOnsQuery,
  deleteAddonsQuery,
  listAddonesQuery,
  addAddOnsAvailabilityQuery,
  updateAddOnsAvailabilityQuery,
  deleteAddonsAvailabilityQuery,
  listAddonesAvailabilityQuery,
} from "./query";
import { CurrentTime } from "../../helper/common";

export class groundRepository {
  public async addGroundV1(userData: any, tokendata: any): Promise<any> {
    console.log("userData", userData);
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");

      const {
        refGroundName,
        isAddOnAvailable,
        // refAddOnsId,
        refGroundPrice,
        refGroundImage,
        refGroundLocation,
        refGroundPincode,
        refGroundState,
        refDescription,
        refStatus,
      } = userData;

      const refAddOnsId = isAddOnAvailable ? userData.refAddOnsId : null;

      const refFeaturesId = `{${userData.refFeaturesId.join(",")}}`;
      const refUserGuidelinesId = `{${userData.refUserGuidelinesId.join(",")}}`;
      const refFacilitiesId = `{${userData.refFacilitiesId.join(",")}}`;
      const refAdditionalTipsId = `{${userData.refAdditionalTipsId.join(",")}}`;
      const refSportsCategoryId = `{${userData.refSportsCategoryId.join(",")}}`;

      const customerPrefix = "CGA-GRD-";
      const baseNumber = 0;

      const lastCustomerResult = await client.query(getLastGroundIdQuery);
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

      const params = [
        refGroundName,
        newCustomerId,
        isAddOnAvailable,
        refAddOnsId,
        refFeaturesId,
        refUserGuidelinesId,
        refAdditionalTipsId,
        refSportsCategoryId,
        refFacilitiesId,
        refGroundPrice,
        refGroundImage,
        refGroundLocation,
        refGroundPincode,
        refGroundState,
        refDescription,
        refStatus,
        CurrentTime(),
        tokendata.id,
      ];
      console.log("params", params);
      const Result = await client.query(addGroundQuery, params);
      //   console.log("userResult", userResult);

      const history = [
        24,
        tokendata.id,
        `${refGroundName} Ground Added successfully`,
        CurrentTime(),
        tokendata.id,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Ground added successfully",
          Result: Result,
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      await client.query("ROLLBACK");

      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during Ground addition",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async updateGroundV1(userData: any, tokendata: any): Promise<any> {
    console.log("userData", userData);
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");
      const {
        refGroundId,
        refGroundName,
        isAddOnAvailable,
        // refRoomImage,
        refGroundPrice,
        refGroundImage,
        refGroundLocation,
        refGroundPincode,
        refGroundState,
        refDescription,
        refStatus,
      } = userData;

      const refAddOnsId = isAddOnAvailable ? userData.refAddOnsId : null;

      const refFeaturesId = `{${userData.refFeaturesId.join(",")}}`;
      const refUserGuidelinesId = `{${userData.refUserGuidelinesId.join(",")}}`;
      const refFacilitiesId = `{${userData.refFacilitiesId.join(",")}}`;
      const refAdditionalTipsId = `{${userData.refAdditionalTipsId.join(",")}}`;
      const refSportsCategoryId = `{${userData.refSportsCategoryId.join(",")}}`;

      const params = [
        refGroundId,
        refGroundName,
        isAddOnAvailable,
        refAddOnsId,
        refFeaturesId,
        refUserGuidelinesId,
        refAdditionalTipsId,
        refSportsCategoryId,
        refFacilitiesId,
        refGroundPrice,
        refGroundImage,
        refGroundLocation,
        refGroundPincode,
        refGroundState,
        refDescription,
        refStatus,
        CurrentTime(),
        tokendata.id,
      ];
      console.log("params", params);
      const Result = await client.query(updateGroundQuery, params);
      //   console.log("userResult", userResult);

      const history = [
        25,
        tokendata.id,
        `${refGroundName} Ground updated successfully`,
        CurrentTime(),
        tokendata.id,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Ground updated successfully",
          Result: Result,
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      await client.query("ROLLBACK");

      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during Ground update",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async uploadRoomImageV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      // Extract the image from userData
      const image = userData.Image;

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
          token: tokens,
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
          token: tokens,
        },
        true
      );
    }
  }
  public async deleteRoomImageV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      let filePath: string | any;

      if (userData.refTravalDataId) {
        // Retrieve the image record from the database
        const imageRecord = await executeQuery(getImageRecordQuery, [
          userData.refGroundId,
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

        filePath = imageRecord[0].refItinaryMapPath;

        const DeleteImage = await executeQuery(deleteImageRecordQuery, [
          userData.refGroundId,
        ]);
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
  public async uploadGroundImageV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      // Extract the image from userData
      const image = userData.Image;

      // Ensure that only one image is provided
      if (!image) {
        throw new Error("Please provide an image.");
      }

      let filePath: string = "";
      let storedFiles: any[] = [];

      // Store the image
      filePath = await storeFile(image, 3);

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
          token: tokens,
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
          token: tokens,
        },
        true
      );
    }
  }
  public async deleteGroundImageV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      let filePath: string | any;

      if (userData.refTravalDataId) {
        // Retrieve the image record from the database
        const imageRecord = await executeQuery(getImageRecordQuery, [
          userData.refGroundId,
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

        filePath = imageRecord[0].refItinaryMapPath;

        const DeleteImage = await executeQuery(deleteGroundImageRecordQuery, [
          userData.refGroundId,
        ]);
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
  public async listGroundV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {

      
      const result = await executeQuery(listGroundQuery);

      //       for (const product of result) {
      //   if (product.foodPic) {
      //     try {
      //       const fileBuffer = await fs.promises.readFile(product.foodPic);
      //       product.foodPic = {
      //         filename: path.basename(product.foodPic),
      //         content: fileBuffer.toString("base64"),
      //         contentType: "image/jpeg", // Change based on actual file type if necessary
      //       };
      //     } catch (err) {
      //       console.error(
      //         Error reading image file for product ${product.productId}:,
      //         err
      //       );
      //       product.foodPic = null; // Handle missing or unreadable files gracefully
      //     }
      //   }
      // }

      return encrypt(
        {
          success: true,
          message: "ground listed successfully",
          token: tokens,
          result: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list ground", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list ground",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async deleteGroundV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN"); // Start transaction

      const { refGroundId } = userData;
      const result = await client.query(deleteGroundQuery, [
        refGroundId,
        CurrentTime(),
        tokendata.id,
      ]);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "ground not found or already deleted",
            token: tokens,
          },
          true
        );
      }

      const history = [
        26, // Unique ID for delete action
        tokendata.id,
        `ground deleted succesfully`,
        CurrentTime(),
        tokendata.id,
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "ground deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting ground:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the ground",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async getGroundV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN"); // Start transaction

      const { refGroundId } = userData;
      const result = await client.query(getGroundQuery, [refGroundId]);

      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "ground get successfully",
          token: tokens,
          result: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error get ground:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while get the ground",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }

  public async addAddonsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN"); // Start transaction

      const { addOns, refGroundId } = userData;
      const result = await client.query(addAddOnsQuery, [addOns, refGroundId]);

      const history = [
        33,
        tokendata.id,
        `${addOns} addOn Added Successfully`,
        CurrentTime(),
        tokendata.id,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);

      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "addOn Added successfully",
          token: tokens,
          Data: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error addOn Added:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while the addOn Added",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async updateAddonsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN"); // Start transaction

      const { refAddOnsId, addOns, refGroundId } = userData;
      const result = await client.query(updateAddOnsQuery, [
        refAddOnsId,
        addOns,
        refGroundId,
        CurrentTime(),
        tokendata.id,
      ]);

      const history = [
        34,
        tokendata.id,
        `${addOns} addOn Updated Successfully`,
        CurrentTime(),
        tokendata.id,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);

      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "addOn Updated successfully",
          token: tokens,
          Data: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error addOn Updated:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while the addOn Updated",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async deleteAddonsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN"); // Start transaction

      const { refAddOnsId } = userData;
      const result = await client.query(deleteAddonsQuery, [
        refAddOnsId,
        CurrentTime(),
        tokendata.id,
      ]);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "addon not found or already deleted",
            token: tokens,
          },
          true
        );
      }

      const history = [
        35, // Unique ID for delete action
        tokendata.id,
        `Addon deleted succesfully`,
        CurrentTime(),
        tokendata.id,
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "addon deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting addon:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the addon",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listAddOnsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listAddonesQuery);

      return encrypt(
        {
          success: true,
          message: "addon listed successfully",
          token: tokens,
          result: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list addon", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list addon",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }

  public async addAddonAvailabilityV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN"); // Start transaction

      const { unAvailabilityDate, refAddOnsId } = userData;
      const result = await client.query(addAddOnsAvailabilityQuery, [
        unAvailabilityDate,
        refAddOnsId,
        CurrentTime(),
        tokendata.id,
      ]);

      // const history = [
      //   33,
      //   tokendata.id,
      //   `${addOns} addOn Added Successfully`,
      //   CurrentTime(),
      //   tokendata.id,
      // ];

      // const updateHistory = await client.query(updateHistoryQuery, history);

      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "addOn Added successfully",
          token: tokens,
          Data: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error addOn Added:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while the addOn Added",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async updateAddonAvailabilityV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN"); // Start transaction

      const { addOnsAvailabilityId, unAvailabilityDate, refAddOnsId } =
        userData;

      const result = await client.query(updateAddOnsAvailabilityQuery, [
        addOnsAvailabilityId,
        unAvailabilityDate,
        refAddOnsId,
        CurrentTime(),
        tokendata.id,
      ]);

      // const history = [
      //   33,
      //   tokendata.id,
      //   `${addOns} addOn Added Successfully`,
      //   CurrentTime(),
      //   tokendata.id,
      // ];

      // const updateHistory = await client.query(updateHistoryQuery, history);

      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "addOn Availability Added successfully",
          token: tokens,
          Data: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error addOn Availability Added:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while the addOn Availability Added",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async deleteAddonAvailabilityV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN"); // Start transaction

      const { addOnsAvailabilityId } = userData;
      const result = await client.query(deleteAddonsAvailabilityQuery, [
        addOnsAvailabilityId,
        CurrentTime(),
        tokendata.id,
      ]);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "addon not found or already deleted",
            token: tokens,
          },
          true
        );
      }

      // const history = [
      //   35, // Unique ID for delete action
      //   tokendata.id,
      //   `Addon deleted succesfully`,
      //   CurrentTime(),
      //   tokendata.id,
      // ];

      // await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "addon availability deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting addon availability:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the addon availability",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listAddonAvailabilityV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listAddonesAvailabilityQuery);

      return encrypt(
        {
          success: true,
          message: "addon  availability listed successfully",
          token: tokens,
          result: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list addon availability", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list addon availability",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
}
