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
import { generatePassword } from "../../helper/common";

import { CurrentTime } from "../../helper/common";
import {
  addUnavailbleDatesQuery,
  adduserBookingQuery,
  getGroundPriceQuery,
  getGroundsQuery,
  getGroundUnavailableDateQuery,
  getUsersQuery,
  insertUnavailableQuery,
  listaddonsQuery,
  listFiletedGroundsQuery,
  listFreeGroundsQuery,
  listGroundsQuery,
  listProfleDataQuery,
  listUnavailableAddonsQuery,
  listUserAuditPageQuery,
  listUserBookingHistoryQuery,
  selectUserByLogin,
  updateHistoryQuery,
  updateUserDataQuery,
  updateUserDomainQuery,
  updateUserPasswordQuery,
} from "./query";
import { generateforgotPasswordEmailContent } from "../../helper/mailcontent";
import { sendEmail } from "../../helper/mail";

export class userRepository {
  // public async userGroundBookingV1(
  //   userData: any,
  //   tokendata: any
  // ): Promise<any> {
  //   console.log("userData", userData);
  //   const client: PoolClient = await getClient();
  //   const token = { id: tokendata.id };
  //   const tokens = generateTokenWithExpire(token, true);

  //   try {
  //     const generateDateRange = (start: string, end: string): string[] => {
  //       const dateArray: string[] = [];
  //       const currentDate = new Date(start);
  //       const stopDate = new Date(end);

  //       while (currentDate <= stopDate) {
  //         // Format YYYY-MM-DD
  //         dateArray.push(currentDate.toISOString().split("T")[0]);
  //         currentDate.setDate(currentDate.getDate() + 1);
  //       }

  //       return dateArray;
  //     };
  //     await client.query("BEGIN");

  //     const {
  //       refGroundId,
  //       isAddonNeeded,
  //       refBookingTypeId,
  //       refBookingStartDate,
  //       refBookingEndDate,
  //       refStartTime,
  //       refEndTime,
  //       additionalNotes,
  //     } = userData;

  //     const refAddOnsId = isAddonNeeded
  //       ? `{${userData.refAddOnsId.join(",")}}`
  //       : null;

  //     const endDate = refBookingTypeId === 1 ? refBookingEndDate : null;

  //     const params = [
  //       tokendata.id,
  //       refGroundId,
  //       refBookingTypeId,
  //       refAddOnsId,
  //       refBookingStartDate,
  //       endDate,
  //       refStartTime,
  //       refEndTime,
  //       additionalNotes,
  //       CurrentTime(),
  //       tokendata.id,
  //     ];

  //     console.log("params", params);

  //     const getGroundPrice = await executeQuery(getGroundPriceQuery, [
  //       refGroundId,
  //     ]);
  //     console.log('getGroundPrice', getGroundPrice)

  //     // const { refGroundPrice } = getGroundPrice[0];
  //     const refGroundPrice = Number(getGroundPrice[0]?.refGroundPrice || 0);
  //     console.log('refGroundPrice', refGroundPrice)

  //     let totalAmount = 0;
  //     if (refBookingTypeId === 1 && refBookingStartDate && refBookingEndDate) {
  //       const dateList = generateDateRange(
  //         refBookingStartDate,
  //         refBookingEndDate
  //       );
  //       totalAmount = dateList.length * refGroundPrice;
  //       console.log('totalAmount', totalAmount)
  //     } else {
  //       totalAmount = refGroundPrice;
  //       console.log('totalAmount', totalAmount)
  //     }

  //     const result = await client.query(adduserBookingQuery, params);
  //     console.log('result', result.rows)

  //      // Add unavailable dates for add-ons
  //   if (isAddonNeeded && Array.isArray(refAddOns)) {
  //     for (const addOn of refAddOns) {
  //       const { refAddOnsId, selectedDates } = addOn;
  //       for (const date of selectedDates) {

  //         const insertParams = [
  //           date,
  //           refAddOnsId,
  //           CurrentTime(),
  //           tokendata.id,
  //           refGroundId
  //         ];
  //         await client.query(insertUnavailableQuery, insertParams);
  //       }
  //     }
  //   }

  //   // const result2 = await client.query(adduserBookingQuery, params);
  //   // console.log('result', result.rows);

  //     const history = [
  //       28,
  //       tokendata.id,
  //       `Ground booked successfully`,
  //       CurrentTime(),
  //       tokendata.id,
  //     ];

  //     const updateHistory = await client.query(updateHistoryQuery, history);
  //     await client.query("COMMIT");

  //     return encrypt(
  //       {
  //         success: true,
  //         message: "Ground booked successfully",
  //         result,
  //         totalAmount:totalAmount,
  //         token: tokens,
  //       },
  //       true
  //     );
  //   } catch (error: unknown) {
  //     console.error("Ground booking error:", error);
  //     await client.query("ROLLBACK");

  //     return encrypt(
  //       {
  //         success: false,
  //         message: "An error occurred during ground booking",
  //         error: String(error),
  //         token: tokens,
  //       },
  //       true
  //     );
  //   } finally {
  //     client.release();
  //   }
  // }

  public async loginV1(user_data: any, domain_code?: any): Promise<any> {
    const client: PoolClient = await getClient();

    try {
      const params = [user_data.login];
      const users: any = await client.query(selectUserByLogin, params);
      // console.log('users line -------- 31 \n', users)

      if (!users.rows || users.rows.length === 0) {
        return encrypt(
          {
            success: false,
            message: "Invalid Login Credentials",
          },
          true
        );
      }

      const { refUserTypeId, refUserFname, refCustId } = users.rows[0];

      const user = users.rows[0];

      // const getDeletedEmployee = await executeQuery(
      //   getDeletedEmployeeCountQuery,params
      // );

      // const count = Number(getDeletedEmployee[0]?.count || 0); // safely convert to number

      // if (count > 0) {
      //   return encrypt(
      //     {
      //       success: false,
      //       message: "The Person was already deleted",
      //     },
      //     true
      //   );
      // }

      if (!user.refCustHashedPassword) {
        console.error("Error: User has no hashed password stored.");
        return encrypt(
          {
            success: false,
            message: "Invalid Login Credentials",
          },
          true
        );
      }

      const validPassword = await bcrypt.compare(
        user_data.password,
        user.refCustHashedPassword
      );

      if (!validPassword) {
        return encrypt(
          {
            success: false,
            message: "Invalid Login Credentials",
          },
          true
        );
      }

      // validPassword === true
      const tokenData = { id: user.refUserId };

      const history = [
        2,
        user.refUserId,
        `${user_data.login} login successfully`,
        CurrentTime(),
        user.refUserId,
      ];

      await client.query(updateHistoryQuery, history);

      return encrypt(
        {
          success: true,
          message: "Login successful",
          userId: user.refUserId,
          roleId: refUserTypeId,
          name: refUserFname,
          custId: refCustId,
          token: generateTokenWithExpire(tokenData, true),
        },
        true
      );
    } catch (error) {
      console.error("Error during login:", error);
      return encrypt(
        {
          success: false,
          message: "Internal server error",
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async userGroundBookingV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    console.log("userData", userData);
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    const generateDateRange = (start: string, end: string): string[] => {
      const parseDMY = (dateStr: string): Date => {
        const [day, month, year] = dateStr.split("-").map(Number);
        return new Date(year, month - 1, day);
      };

      const formatDMY = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };

      const dateArray: string[] = [];
      const currentDate = parseDMY(start);
      const stopDate = parseDMY(end);

      while (currentDate <= stopDate) {
        dateArray.push(formatDMY(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return dateArray;
    };

    try {
      await client.query("BEGIN");

      const {
        refGroundId,
        isAddonNeeded,
        refBookingTypeId,
        refBookingStartDate,
        refBookingEndDate,
        refStartTime,
        refEndTime,
        additionalNotes,
        refAddOns = [],
        refTotalAmount,
        refBookingAmount,
        refSGSTAmount,
        refCGSTAmount
      } = userData;

      console.log("userData", userData);

      const refAddOnsId = isAddonNeeded
        ? `{${refAddOns.map((a: any) => a.refAddOnsId).join(",")}}`
        : null;

      console.log("refAddOnsId", refAddOnsId);

      const endDate = refBookingTypeId === 1 ? refBookingEndDate : null;

      // const getGroundPrice = await executeQuery(getGroundPriceQuery, [
      //   refGroundId,
      // ]);
      // const refGroundPrice = Number(getGroundPrice[0]?.refGroundPrice || 0);
      // console.log("refGroundPrice", refGroundPrice);

      // let totalAmount = 0;
      // if (refBookingTypeId === 1 && refBookingStartDate && refBookingEndDate) {
      //   const dateList = generateDateRange(
      //     refBookingStartDate,
      //     refBookingEndDate
      //   );
      //   console.log("dateList", dateList);
      //   totalAmount = dateList.length * refGroundPrice;
      // } else {
      //   totalAmount = refGroundPrice;
      // }

      const params = [
        tokendata.id,
        refGroundId,
        refBookingTypeId,
        refAddOnsId,
        refBookingStartDate,
        endDate,
        refStartTime,
        refEndTime,
        additionalNotes,
        refTotalAmount,
        CurrentTime(),
        tokendata.id,
        refBookingAmount,
        refSGSTAmount,
        refCGSTAmount
      ];

      const result = await client.query(adduserBookingQuery, params);
      console.log("result", result.rows);

      if (isAddonNeeded && Array.isArray(refAddOns)) {
        const bookingRangeDates =
          refBookingTypeId === 1 && refBookingStartDate && refBookingEndDate
            ? generateDateRange(refBookingStartDate, refBookingEndDate)
            : [];

        for (const addOn of refAddOns) {
          const { refAddOnsId, selectedDates = [], refPrice } = addOn;
          console.log("addOn", addOn);

          const combinedDates: { date: string; refAddOnsId: number, refPrice: string }[] = [];

          // Push bookingRangeDates with refAddOnsId = 1
          for (const date of bookingRangeDates) {
            combinedDates.push({ date, refAddOnsId: 1, refPrice: "" });
          }

          // Push selectedDates with actual refAddOnsId
          for (const date of selectedDates) {
            combinedDates.push({ date, refAddOnsId, refPrice });
          }

          console.log("combinedDates", combinedDates);

          for (const { date, refAddOnsId, refPrice } of combinedDates) {
            const insertUnavailableQuery = `
            INSERT INTO public."addOnUnAvailability" (
              "unAvailabilityDate", 
              "refAddOnsId",
              "refGroundId",
              "createdAt",
              "createdBy",
              "refAddOnsPrice"
            )
            VALUES ($1, $2, $3, $4, $5, $6)
          `;


            const insertParams = [
              date,
              refAddOnsId,
              refGroundId,
              CurrentTime(),
              tokendata.id,
              refPrice
            ];

            const UnavailableDates = await client.query(
              insertUnavailableQuery,
              insertParams
            );
            console.log("UnavailableDates", UnavailableDates);
          }
        }
      }

      const history = [
        28,
        tokendata.id,
        `Ground booked successfully`,
        CurrentTime(),
        tokendata.id,
      ];
      await client.query(updateHistoryQuery, history);

      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Ground booked successfully",
          result,
          refTotalAmount,
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Ground booking error:", error);
      await client.query("ROLLBACK");

      return encrypt(
        {
          success: false,
          message: "An error occurred during ground booking",
          error: String(error),
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }

  // public async userGroundBookingV1(
  //   userData: any,
  //   tokendata: any
  // ): Promise<any> {
  //   console.log("userData", userData);
  //   const client: PoolClient = await getClient();
  //   const token = { id: tokendata.id };
  //   const tokens = generateTokenWithExpire(token, true);

  //   const generateDateRange = (start: string, end: string): string[] => {
  //     const parseDMY = (dateStr: string): Date => {
  //       const [day, month, year] = dateStr.split("-").map(Number);
  //       return new Date(year, month - 1, day);
  //     };

  //     const formatDMY = (date: Date): string => {
  //       const day = String(date.getDate()).padStart(2, "0");
  //       const month = String(date.getMonth() + 1).padStart(2, "0");
  //       const year = date.getFullYear();
  //       return `${day}-${month}-${year}`;
  //     };

  //     const dateArray: string[] = [];
  //     const currentDate = parseDMY(start);
  //     const stopDate = parseDMY(end);

  //     while (currentDate <= stopDate) {
  //       dateArray.push(formatDMY(currentDate));
  //       currentDate.setDate(currentDate.getDate() + 1);
  //     }

  //     return dateArray;
  //   };

  //   try {
  //     await client.query("BEGIN");

  //     const {
  //       refGroundId,
  //       isAddonNeeded,
  //       refBookingTypeId,
  //       refBookingStartDate,
  //       refBookingEndDate,
  //       refStartTime,
  //       refEndTime,
  //       additionalNotes,
  //       refAddOns = [],
  //     } = userData;
  //     console.log('userData', userData)

  //     const refAddOnsId = isAddonNeeded
  //     ? `{${refAddOns.map((a: any) => a.refAddOnsId).join(",")}}`
  //     : null;
  //     console.log('refAddOnsId', refAddOnsId)

  //     const endDate = refBookingTypeId === 1 ? refBookingEndDate : null;

  //     // Get ground price
  //     const getGroundPrice = await executeQuery(getGroundPriceQuery, [
  //       refGroundId,
  //     ]);
  //     const refGroundPrice = Number(getGroundPrice[0]?.refGroundPrice || 0);
  //     console.log("refGroundPrice", refGroundPrice);

  //     // Calculate total amount
  //     let totalAmount = 0;
  //     if (refBookingTypeId === 1 && refBookingStartDate && refBookingEndDate) {
  //       const dateList = generateDateRange(
  //         refBookingStartDate,
  //         refBookingEndDate
  //       );
  //       console.log('dateList', dateList)
  //       totalAmount = dateList.length * refGroundPrice;
  //     } else {
  //       totalAmount = refGroundPrice;
  //     }

  //     // Insert booking
  //     const params = [
  //       tokendata.id,
  //       refGroundId,
  //       refBookingTypeId,
  //       refAddOnsId,
  //       refBookingStartDate,
  //       endDate,
  //       refStartTime,
  //       refEndTime,
  //       additionalNotes,
  //       totalAmount,
  //       CurrentTime(),
  //       tokendata.id,
  //     ];

  //     const result = await client.query(adduserBookingQuery, params);
  //     console.log("result", result.rows);

  //     if (isAddonNeeded && Array.isArray(refAddOns)) {
  //       const bookingRangeDates =
  //         refBookingTypeId === 1 && refBookingStartDate && refBookingEndDate
  //           ? generateDateRange(refBookingStartDate, refBookingEndDate)
  //           : [];

  //       for (const addOn of refAddOns) {
  //         const { refAddOnsId, selectedDates = [] } = addOn;
  //         console.log('addOn', addOn)

  //         // Combine selectedDates and bookingRangeDates and deduplicate
  //         const combinedDates = Array.from(
  //           new Set([...bookingRangeDates, ...selectedDates])
  //         );
  //         console.log('combinedDates', combinedDates)

  //         for (const date of combinedDates) {
  //           const insertUnavailableQuery = `
  //       INSERT INTO public."addOnUnAvailability" (
  //         "unAvailabilityDate",
  //         "refAddOnsId",
  //         "refGroundId",
  //         "createdAt",
  //         "createdBy"
  //       )
  //       VALUES ($1, $2, $3, $4, $5)
  //     `;
  //           const insertParams = [
  //             date,
  //             refAddOnsId,
  //             refGroundId,
  //             CurrentTime(),
  //             tokendata.id,
  //           ];
  //         const UnavailableDates = await client.query(insertUnavailableQuery, insertParams);
  //         console.log('UnavailableDates', UnavailableDates)
  //         }
  //       }
  //     }

  //     // Insert into history
  //     const history = [
  //       28,
  //       tokendata.id,
  //       `Ground booked successfully`,
  //       CurrentTime(),
  //       tokendata.id,
  //     ];
  //     await client.query(updateHistoryQuery, history);

  //     await client.query("COMMIT");

  //     return encrypt(
  //       {
  //         success: true,
  //         message: "Ground booked successfully",
  //         result,
  //         totalAmount,
  //         token: tokens,
  //       },
  //       true
  //     );
  //   } catch (error: unknown) {
  //     console.error("Ground booking error:", error);
  //     await client.query("ROLLBACK");

  //     return encrypt(
  //       {
  //         success: false,
  //         message: "An error occurred during ground booking",
  //         error: String(error),
  //         token: tokens,
  //       },
  //       true
  //     );
  //   } finally {
  //     client.release();
  //   }
  // }

  public async listFilteredGroundsV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const { refSportsCategoryId } = userData;
      const result = await executeQuery(listFiletedGroundsQuery, [
        refSportsCategoryId,
      ]);

      return encrypt(
        {
          success: true,
          message: "Ground listed successfully",
          token: tokens,
          result: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list Ground ", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list Ground",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async listGroundsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listGroundsQuery);

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
            console.error(
              "Error reading image file for product ${product.productId}:",
              err
            );
            product.refGroundImage = null; // Handle missing or unreadable files gracefully
          }
        }
      }
      return encrypt(
        {
          success: true,
          message: "Ground listed successfully",
          token: tokens,
          result: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list Ground ", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list Ground",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async listFreeGroundsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const {
        refSportsCategoryId,
        refBookingTypeId,
        refBookingStartDate,
        refBookingEndDate,
        refStartTime,
        refEndTime,
      } = userData;

      const endDate = refBookingTypeId === 1 ? refBookingEndDate : null;
      const startTime = refBookingTypeId === 2 ? refStartTime : null;
      const endTime = refBookingTypeId === 2 ? refEndTime : null;

      const result = await executeQuery(listFreeGroundsQuery, [
        refSportsCategoryId,
        refBookingTypeId,
        refBookingStartDate,
        endDate,
        startTime,
        endTime,
      ]);
      if (!result || result.length === 0) {
        return encrypt(
          {
            success: false,
            message: "No free grounds found for the given criteria.",
            token: tokens,
          },
          true
        );
      }
      return encrypt(
        {
          success: true,
          message: "free Ground listed successfully",
          token: tokens,
          result: result, // Return record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list free Ground ", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list free Ground",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async listProfileDataV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listProfleDataQuery, [tokendata.id]);

      return encrypt(
        {
          success: true,
          message: "profile data listed successfully",
          token: tokens,
          result: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list profile data ", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list profile data",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async updateProfileDataV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    console.log("userData", userData);
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");

      const { refFName, refLName, refDOB, refUserEmail, refMoblile } = userData;

      const params = [
        tokendata.id,
        refFName,
        refLName,
        refDOB,
        CurrentTime(),
        tokendata.id,
      ];

      console.log("params", params);
      const result = await client.query(updateUserDataQuery, params);
      const domainParams = [
        tokendata.id,
        refMoblile,
        refUserEmail,
        refUserEmail,
        CurrentTime(),
        tokendata.id,
      ];

      const domainResult = await client.query(
        updateUserDomainQuery,
        domainParams
      );

      const history = [
        30,
        tokendata.id,
        `${refFName}'s Profile data Updated successfully`,
        CurrentTime(),
        tokendata.id,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "update profile data successfully",
          result: result,
          domainResult: domainResult,
          token: tokens,
        },
        true
      );
    } catch (error: unknown) {
      console.error("update profile data error:", error);
      await client.query("ROLLBACK");

      return encrypt(
        {
          success: false,
          message: "An error occurred during update profile data",
          error: String(error),
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async forgotPasswordV1(userData: any, token_data?: any): Promise<any> {
    const client: PoolClient = await getClient();
    // const token = { id: token_data.id }; // Extract token ID
    // const tokens = generateTokenWithExpire(token, true);
    try {
      const { emailId } = userData;

      // Validate input
      if (!emailId) {
        return encrypt(
          {
            success: false,
            message: "Email ID is missing",
          },
          true
        );
      }

      // Begin database transaction
      await client.query("BEGIN");

      // Fetch all mobile numbers associated with the user
      const Result = await executeQuery(getUsersQuery, [emailId]);

      // Check if any mobile numbers were found
      if (!Result.length) {
        return encrypt(
          {
            success: false,
            message: "No found for the user",
            // token: tokens,
          },
          true
        );
      }
      const genPassword = generatePassword();
      console.log("genPassword", genPassword);
      const genHashedPassword = await bcrypt.hash(genPassword, 10);
      console.log("genHashedPassword", genHashedPassword);

      const updatePassword = await client.query(updateUserPasswordQuery, [
        emailId,
        // token_data.id,
        genPassword,
        genHashedPassword,
        CurrentTime(),
        // token_data.id,
      ]);

      // console.log("token_data.id", token_data.id);
      // const tokenData = {
      //   // id: token_data.id,
      //   email: emailId,
      // };

      await client.query("COMMIT");

      // way 1
      const main = async () => {
        const mailOptions = {
          to: emailId,
          subject: "Password Reset Successful", // Subject of the email
          html: generateforgotPasswordEmailContent(emailId, genPassword),
        };

        // Call the sendEmail function
        try {
          await sendEmail(mailOptions);
        } catch (error) {
          console.error("Failed to send email:", error);
        }
      };
      main().catch(console.error);

      // // way 2
      // const mailToUser = {
      //   to: emailId,
      //   subject: "You Accont has be Created Successfully In our Platform", // Subject of the email
      //   html: generateforgotPasswordEmailContent(emailId, genPassword),
      // };

      // const transporter = nodemailer.createTransport({
      //   service: "gmail",
      //   auth: {
      //     user: process.env.EMAILID,
      //     pass: process.env.PASSWORD,
      //   },
      // });

      // await transporter.sendMail(mailToUser);

      // Return the mobile numbers and email ID in the response

      return encrypt(
        {
          success: true,
          message: "mail send successfully",
          emailId: emailId,
          // token: tokens,
        },
        true
      );
    } catch (error) {
      console.error("Error retrieving user contact info:", error);

      await client.query("ROLLBACK");

      return encrypt(
        {
          success: false,
          message: "Internal server error",
          // token: tokens,
        },
        true
      );
    } finally {
      client.release(); // Release the client back to the pool
    }
  }
  public async resetPasswordV1(userData: any, token_data?: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: token_data.id }; // Extract token ID
    const tokens = generateTokenWithExpire(token, true);
    try {
      const { emailId } = userData;

      // Validate input
      if (!emailId) {
        return encrypt(
          {
            success: false,
            message: "Email ID is missing",
          },
          true
        );
      }

      // Begin database transaction
      await client.query("BEGIN");

      // Fetch all mobile numbers associated with the user
      const Result = await executeQuery(getUsersQuery, [emailId]);

      // Check if any mobile numbers were found
      if (!Result.length) {
        return encrypt(
          {
            success: false,
            message: "No found for the user",
            token: tokens,
          },
          true
        );
      }
      const genPassword = generatePassword();
      console.log("genPassword", genPassword);
      const genHashedPassword = await bcrypt.hash(genPassword, 10);
      console.log("genHashedPassword", genHashedPassword);

      const updatePassword = await client.query(updateUserPasswordQuery, [
        emailId,
        // token_data.id,
        genPassword,
        genHashedPassword,
        CurrentTime(),
        // token_data.id,
      ]);

      // console.log("token_data.id", token_data.id);
      // const tokenData = {
      //   // id: token_data.id,
      //   email: emailId,
      // };
      const history = [
        29,
        token_data.id,
        `Password Reset successfully`,
        CurrentTime(),
        token_data.id,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      // way 1
      const main = async () => {
        const mailOptions = {
          to: emailId,
          subject: "Password Reset Successful", // Subject of the email
          html: generateforgotPasswordEmailContent(emailId, genPassword),
        };

        // Call the sendEmail function
        try {
          await sendEmail(mailOptions);
        } catch (error) {
          console.error("Failed to send email:", error);
        }
      };
      main().catch(console.error);

      return encrypt(
        {
          success: true,
          message: "mail send successfully",
          emailId: emailId,
          token: tokens,
        },
        true
      );
    } catch (error) {
      console.error("Error retrieving user contact info:", error);

      await client.query("ROLLBACK");

      return encrypt(
        {
          success: false,
          message: "Internal server error",
          token: tokens,
        },
        true
      );
    } finally {
      client.release(); // Release the client back to the pool
    }
  }
  public async userBookingHistoryV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listUserBookingHistoryQuery, [
        tokendata.id,
      ]);

      return encrypt(
        {
          success: true,
          message: "profile data listed successfully",
          token: tokens,
          result: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list profile data ", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list profile data",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async userAuditPageV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listUserAuditPageQuery, [tokendata.id]);

      return encrypt(
        {
          success: true,
          message: "profile data listed successfully",
          token: tokens,
          result: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list profile data ", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list profile data",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async getGroundsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(getGroundsQuery, [
        userData.refGroundId,
      ]);

      const groundUnavailableDate = await executeQuery(
        getGroundUnavailableDateQuery,
        [userData.refGroundId]
      );
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
            console.error(
              "Error reading image file for product ${product.productId}:",
              err
            );
            product.refGroundImage = null; // Handle missing or unreadable files gracefully
          }
        }
      }
      return encrypt(
        {
          success: true,
          message: "Ground listed successfully",
          token: tokens,
          groundResult: result, // Return deleted record for reference
          groundUnavailableDate: groundUnavailableDate,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list Ground data ", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list Ground data",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async getUnavailableAddonsV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN");

      const { fromDate, toDate, refGroundId } = userData;
      console.log("userData", userData);

      const result = await executeQuery(listUnavailableAddonsQuery);

      const addons = await executeQuery(listaddonsQuery);

      const groundUnavailableDate = await executeQuery(
        getGroundUnavailableDateQuery,
        [userData.refGroundId]
      );
      // 🧠 Helper function to generate date list
      const generateDateRange = (start: string, end: string): string[] => {
        const parseDMY = (dateStr: string): Date => {
          const [day, month, year] = dateStr.split("-").map(Number);
          return new Date(year, month - 1, day); // JS months are 0-based
        };

        const formatDMY = (date: Date): string => {
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          return `${day}-${month}-${year}`;
        };

        const dateArray: string[] = [];
        const currentDate = parseDMY(start);
        const stopDate = parseDMY(end);

        while (currentDate <= stopDate) {
          dateArray.push(formatDMY(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }

        return dateArray;
      };

      // ✅ Generate the list of dates
      // const dateList = generateDateRange(fromDate, toDate);
      // for (const date of dateList) {
      //   const insertParams = [
      //     date,
      //     // refAddOnsId,
      //     refGroundId,
      //     CurrentTime(),
      //     tokendata.id,
      //   ];
      //   const result2 = await client.query(
      //     addUnavailbleDatesQuery,
      //     insertParams
      //   );
      // }

      const getGroundPrice = await executeQuery(getGroundPriceQuery, [
        refGroundId,
      ]);
      console.log("getGroundPrice", getGroundPrice);

      const refGroundPrice = Number(getGroundPrice[0]?.refGroundPrice || 0);
      console.log("refGroundPrice", refGroundPrice);

      let totalAmount = 0;
      if (fromDate && toDate) {
        const dateList = generateDateRange(fromDate, toDate);
        console.log("dateList", dateList);
        totalAmount = dateList.length * refGroundPrice;
      } else {
        totalAmount = refGroundPrice;
      }
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Unavailable Addons data listed successfully",
          token: tokens,
          result: result, // Return deleted record for reference
          addons: addons,
          groundUnavailableDates: groundUnavailableDate,
          totalAmount: totalAmount,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list Unavailable Addons data ", error);
      await client.query("ROLLBACK");

      return encrypt(
        {
          success: false,
          message: "An error occurred while list Unavailable Addons data",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
}
