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
  generateTokenWith5MExpire,
} from "../../helper/token";
import { generatePassword } from "../../helper/common";

import { CurrentTime } from "../../helper/common";
import {
  addUnavailbleDatesQuery,
  adduserBookingQuery,
  deletestorageQuery,
  getconvertedDataAmountQuery,
  getGroundAmtQuery,
  getGroundPriceQuery,
  getGroundsQuery,
  getGroundUnavailableDateQuery,
  getUsersQuery,
  insertUnavailableQuery,
  listaddonsQuery,
  listFiletedGroundsQuery,
  listFreeGroundsQuery,
  listGroundsQuery,
  listItemsQuery,
  listProfleDataQuery,
  listSportCategoryQuery,
  listSubAddOnsQuery,
  listUnavailableAddonsQuery,
  listUserAuditPageQuery,
  listUserBookingHistoryQuery,
  selectOwnerByLogin,
  selectUserByLogin,
  updateHistoryQuery,
  updateUserDataQuery,
  updateUserDomainQuery,
  updateUserPasswordQuery,
} from "./query";
import { generateforgotPasswordEmailContent } from "../../helper/mailcontent";
import { sendEmail } from "../../helper/mail";

export class userRepository {
  // public async loginV1(user_data: any, domain_code?: any): Promise<any> {
  //   const client: PoolClient = await getClient();

  //   try {
  //     const params = [user_data.login, user_data.roleID];
  //     if(user_data.roleID===2){
  //     const users: any = await client.query(selectUserByLogin, params);
  //     }
  //     else{
  //             const owner: any = await client.query(selectOwnerByLogin, params);

  //     }

  //     if (!users.rows || users.rows.length === 0) {
  //       return encrypt(
  //         {
  //           success: false,
  //           message: "Invalid Login Credentials",
  //         },
  //         true
  //       );
  //     }

  //     const { refUserTypeId, refUserFname, refCustId } = users.rows[0];

  //     const user = users.rows[0];

  //     // const getDeletedEmployee = await executeQuery(
  //     //   getDeletedEmployeeCountQuery,params
  //     // );

  //     // const count = Number(getDeletedEmployee[0]?.count || 0); // safely convert to number

  //     // if (count > 0) {
  //     //   return encrypt(
  //     //     {
  //     //       success: false,
  //     //       message: "The Person was already deleted",
  //     //     },
  //     //     true
  //     //   );
  //     // }

  //     if (!user.refCustHashedPassword) {
  //       console.error("Error: User has no hashed password stored.");
  //       return encrypt(
  //         {
  //           success: false,
  //           message: "Invalid Login Credentials",
  //         },
  //         true
  //       );
  //     }

  //     const validPassword = await bcrypt.compare(
  //       user_data.password,
  //       user.refCustHashedPassword
  //     );

  //     if (!validPassword) {
  //       return encrypt(
  //         {
  //           success: false,
  //           message: "Invalid Login Credentials",
  //         },
  //         true
  //       );
  //     }

  //     // validPassword === true
  //     const tokenData = { id: user.refUserId };

  //     const history = [
  //       2,
  //       user.refUserId,
  //       `${user_data.login} login successfully`,
  //       CurrentTime(),
  //       user.refUserId,
  //     ];

  //     await client.query(updateHistoryQuery, history);

  //     return encrypt(
  //       {
  //         success: true,
  //         message: "Login successful",
  //         userId: user.refUserId,
  //         roleId: refUserTypeId,
  //         name: refUserFname,
  //         custId: refCustId,
  //         token: generateTokenWithExpire(tokenData, true),
  //       },
  //       true
  //     );
  //   } catch (error) {
  //     console.error("Error during login:", error);
  //     return encrypt(
  //       {
  //         success: false,
  //         message: "Internal server error",
  //       },
  //       true
  //     );
  //   } finally {
  //     client.release();
  //   }
  // }

  public async loginV1(user_data: any, domain_code?: any): Promise<any> {
    console.log("user_data", user_data);
    const client: PoolClient = await getClient();
    try {
      const params = [user_data.login, user_data.roleID];
      console.log("params", params);

      let user: any;

      if (user_data.roleID === 2) {
        const usersResult = await client.query(selectUserByLogin, params);
        console.log("usersResult", usersResult);

        if (!usersResult.rows || usersResult.rows.length === 0) {
          return encrypt(
            { success: false, message: "Invalid Login Credentials" },
            true
          );
        }
        user = usersResult.rows[0];
        console.log("user", user);
      } else {
        const ownerResult = await client.query(selectOwnerByLogin, params);
        if (!ownerResult.rows || ownerResult.rows.length === 0) {
          return encrypt(
            { success: false, message: "Invalid Login Credentials" },
            true
          );
        }
        user = ownerResult.rows[0];
        console.log("user", user);
      }

      if (!user.refCustHashedPassword) {
        console.error("Error: User has no hashed password stored.");
        return encrypt(
          { success: false, message: "Invalid Login Credentials" },
          true
        );
      }

      const validPassword = await bcrypt.compare(
        user_data.password,
        user.refCustHashedPassword
      );
      if (!validPassword) {
        return encrypt(
          { success: false, message: "Invalid Login Credentials" },
          true
        );
      }

      // const tokenData = { id: user.refUserId,  };
      // const tokenData = { id: user.refUserId, roleId: user_data.roleID };

      const tokenData = {
        id: user.refUserId || user.refOwnerId,
        roleId: user_data.roleID,
      };
      console.log("tokenData", tokenData);

      const history = [
        2,
        user.refUserId,
        `${user_data.login} login successfully`,
        CurrentTime(),
        user.refUserId,
      ];
      await client.query(updateHistoryQuery, history);
      console.log('generateTokenWithExpire(tokenData, true) line ------ 228', generateTokenWithExpire(tokenData, true))

      return encrypt(
        {
          // success: true,
          // message: "Login successful",
          // userId: user.refUserId,
          // roleId: user.refUserTypeId,
          // name: user.refUserFname,
          // custId: user.refCustId,
          // token: generateTokenWithExpire(tokenData, true),
          success: true,
          message: "Login successful",
          userId: user.refUserId || user.refOwnerId,
          roleId: user.refUserTypeId || user.refOwnerTypeId,
          name: user_data.roleID === 2 ? user.refUserFname : user.refOwnerFname,
          custId: user.refCustId || user.refOwnerCustId,
          token: generateTokenWithExpire(tokenData, true),
        },
        true
      );
    } catch (error) {
      console.error("Error during login:", error);
      return encrypt(
        { success: false, message: "Internal server error" },
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
    const client: PoolClient = await getClient();
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };

    const tokens = generateTokenWithExpire(token, true);

    const parseDMY = (dateStr: string): Date => {
      const [day, month, year] = dateStr.split("-").map(Number);
      return new Date(year, month - 1, day);
    };

    const formatDMY = (date: Date): string => {
      return `${String(date.getDate()).padStart(2, "0")}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${date.getFullYear()}`;
    };

    const generateDateRange = (start: string, end: string): string[] => {
      const result: string[] = [];
      const currentDate = parseDMY(start);
      const stopDate = parseDMY(end);
      while (currentDate <= stopDate) {
        result.push(formatDMY(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return result;
    };

    try {
      await client.query("BEGIN");

      const {
        refGroundId,
        isAddonNeeded = false,
        refBookingTypeId,
        refBookingStartDate,
        refBookingEndDate,
        refStartTime,
        refEndTime,
        additionalNotes = "",
        refAddOns = [],
      } = userData;

      if (!refGroundId || !refBookingTypeId || !refBookingStartDate) {
        throw new Error("Required booking details are missing.");
      }

      const endDate = refBookingTypeId === 1 ? refBookingEndDate : null;
      const refAddOnsId =
        isAddonNeeded && refAddOns.length > 0
          ? `{${refAddOns.map((a: any) => a.refAddOnsId).join(",")}}`
          : null;

      const groundPriceRes = await executeQuery(getGroundPriceQuery, [
        refGroundId,
      ]);
      const refGroundPrice = Number(groundPriceRes[0]?.refGroundPrice || 0);
      const refTournamentPrice = Number(
        groundPriceRes[0]?.refTournamentPrice || 0
      );

      const dateList = generateDateRange(
        refBookingStartDate,
        refBookingEndDate
      );
      // const totalGroundPrice = dateList.length * refGroundPrice;
      // console.log("totalGroundPrice", totalGroundPrice);

      const actualGroundPrice =
        dateList.length > 1 ? refTournamentPrice : refGroundPrice;
      const totalGroundPrice = dateList.length * actualGroundPrice;
      console.log("totalGroundPrice", totalGroundPrice);

      console.log("actualGroundPrice", actualGroundPrice);
      let totalAddonPrice = 0;
      const addonPriceDetails: any[] = [];

      // Price Preloading
      const addonIds = refAddOns.map((a: any) => a.refAddOnsId);
      const subaddonIds: number[] = [];
      const itemIds: number[] = [];

      for (const addon of refAddOns) {
        if (addon.isSubaddonNeeded && Array.isArray(addon.refSubaddons)) {
          for (const subaddon of addon.refSubaddons) {
            subaddonIds.push(subaddon.refSubaddonId);
            if (subaddon.isItemsNeeded && Array.isArray(subaddon.refItems)) {
              for (const item of subaddon.refItems) {
                itemIds.push(item.refItemsId);
              }
            }
          }
        }
      }

      const { rows: addonPriceRows } = await client.query(
        `SELECT "refAddOnsId", "refAddonPrice" FROM public."refAddOns" WHERE "refGroundId" = $1 AND "refAddOnsId" = ANY($2::int[])`,
        [refGroundId, addonIds.length > 0 ? addonIds : [-1]]
      );

      const { rows: subaddonPriceRows } = await client.query(
        `SELECT "subAddOnsId", "refSubAddOnPrice" FROM public."subAddOns" WHERE "refGroundId" = $1 AND "subAddOnsId" = ANY($2::int[])`,
        [refGroundId, subaddonIds.length > 0 ? subaddonIds : [-1]]
      );

      const { rows: itemPriceRows } = await client.query(
        `SELECT "refItemsId", "refItemsPrice" FROM public."refItems" WHERE "refGroundId" = $1 AND "refItemsId" = ANY($2::int[])`,
        [refGroundId, itemIds.length > 0 ? itemIds : [-1]]
      );

      const addonPriceMap = new Map<number, number>();
      addonPriceRows.forEach((r) =>
        addonPriceMap.set(r.refAddOnsId, Number(r.refAddonPrice))
      );

      const subaddonPriceMap = new Map<number, number>();
      subaddonPriceRows.forEach((r) =>
        subaddonPriceMap.set(r.subAddOnsId, Number(r.refSubAddOnPrice))
      );

      const itemPriceMap = new Map<number, number>();
      itemPriceRows.forEach((r) =>
        itemPriceMap.set(r.refItemsId, Number(r.refItemsPrice))
      );

      // Optimized calculation
      if (isAddonNeeded && refAddOns.length > 0) {
        for (const addon of refAddOns) {
          const {
            refAddOnsId,
            selectedDates = [],
            refPersonCount = 1,
            isSubaddonNeeded = false,
            refSubaddons = [],
          } = addon;

          let addonTotal = 0;

          for (const date of selectedDates) {
            let dailyAddonTotal = 0;

            if (isSubaddonNeeded) {
              for (const sub of refSubaddons) {
                const {
                  refSubaddonId,
                  isItemsNeeded = false,
                  refItems = [],
                } = sub;

                if (isItemsNeeded && refItems.length > 0) {
                  for (const item of refItems) {
                    dailyAddonTotal +=
                      (itemPriceMap.get(item.refItemsId) || 0) * refPersonCount;
                  }
                } else {
                  dailyAddonTotal +=
                    (subaddonPriceMap.get(refSubaddonId) || 0) * refPersonCount;
                }
              }
            } else {
              dailyAddonTotal +=
                (addonPriceMap.get(refAddOnsId) || 0) * refPersonCount;
            }

            addonTotal += dailyAddonTotal;
            totalAddonPrice += dailyAddonTotal;
          }

          addonPriceDetails.push({
            refAddOnsId,
            selectedDates,
            isSubaddonNeeded,
            refPersonCount,
            addonAmount: addonTotal,
          });
        }
      }

      const subtotalRaw = totalGroundPrice + totalAddonPrice;
      const subtotal = +subtotalRaw.toFixed(2); // Round to 2 decimal places

      console.log("totalGroundPrice", totalGroundPrice);
      console.log("totalAddonPrice", totalAddonPrice);
      console.log("subtotal", subtotal);

      const refSGSTAmount = +(subtotal * 0.09).toFixed(2);
      const refCGSTAmount = +(subtotal * 0.09).toFixed(2);

      console.log("refSGSTAmount", refSGSTAmount);
      console.log("refCGSTAmount", refCGSTAmount);

      const refTotalAmountRaw = subtotal + refSGSTAmount + refCGSTAmount;
      const refTotalAmount = +refTotalAmountRaw.toFixed(2); // Round to 2 decimal places

      const deleteStorage = await client.query(deletestorageQuery, [
        tokendata.id,
      ]);
      console.log("deleteStorage", deleteStorage);

      const { tempStorageId } = deleteStorage.rows[0];

      const bookingParams = [
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
        totalGroundPrice,
        refSGSTAmount,
        refCGSTAmount,
        userData.transactionId,
        tempStorageId,
      ];

      const result = await client.query(adduserBookingQuery, bookingParams);

      // Add-on unavailability
      if (isAddonNeeded) {
        for (const addon of refAddOns) {
          for (const date of addon.selectedDates || []) {
            await client.query(
              `INSERT INTO public."addOnUnAvailability" (
              "unAvailabilityDate", "refAddOnsId", "refGroundId", "createdAt", "createdBy", "refAddOnsPrice"
            ) VALUES ($1, $2, $3, $4, $5, $6)`,
              [
                date,
                addon.refAddOnsId,
                refGroundId,
                CurrentTime(),
                tokendata.id,
                0,
              ]
            );
          }
        }
      }

      // Ground unavailability
      for (const date of dateList) {
        await client.query(
          `INSERT INTO public."addOnUnAvailability" (
          "unAvailabilityDate", "refAddOnsId", "refGroundId", "createdAt", "createdBy", "refAddOnsPrice"
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
          [date, 1, refGroundId, CurrentTime(), tokendata.id, 0]
        );
      }

      await client.query(updateHistoryQuery, [
        28,
        tokendata.id,
        `Ground booked successfully`,
        CurrentTime(),
        tokendata.id,
      ]);

      await client.query("COMMIT");

      // return encrypt(
      //   {
      //     success: true,
      //     message: "Ground booked successfully",
      //     result,
      //     token: tokens,
      //     totalGroundPrice,
      //     totalAddonPrice,
      //     addonPriceDetails,
      //     refSGSTAmount,
      //     refCGSTAmount,
      //     refTotalAmount,
      //   },
      //   true
      // );
      return encrypt(
        {
          success: true,
          message: "Ground booked successfully",
          result,
          token: tokens,
          totalGroundPrice: totalGroundPrice.toFixed(2),
          totalAddonPrice: totalAddonPrice.toFixed(2),
          addonPriceDetails,
          refSGSTAmount: refSGSTAmount.toFixed(2),
          refCGSTAmount: refCGSTAmount.toFixed(2),
          refTotalAmount: refTotalAmount.toFixed(2),
        },
        true
      );
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Booking error:", error);

      return encrypt(
        {
          success: false,
          message: "Error during booking",
          error: error,
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }

  public async listFilteredGroundsV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log("token", token);

    const tokens = generateTokenWithExpire(token, true);

    try {
      const { refSportsCategoryId } = userData;

      const result = await executeQuery(listFiletedGroundsQuery, [
        refSportsCategoryId,
      ]);

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

  public async listGroundsV1(userData: any, tokendata: any): Promise<any> {
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log("token", token);

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
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log("token", token);

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
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log("token", token);

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
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log("token", token);

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
    // const token = { id: token_data.id }; // Extract token ID
    const token = { id: token_data.id, roleId: token_data.roleId };
    console.log("token", token);

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
  // public async userBookingHistoryV1(
  //   userData: any,
  //   tokendata: any
  // ): Promise<any> {
  //   const token = { id: tokendata.id };
  //   const tokens = generateTokenWithExpire(token, true);

  //   try {
  //     const result = await executeQuery(listUserBookingHistoryQuery, [
  //       tokendata.id,
  //     ]);

  //   const payloadString = result[0].payload;
  //     let parsedPayload;
  //     try {
  //       parsedPayload = JSON.parse(payloadString);
  //     } catch (err) {
  //       throw new Error("Invalid JSON in payload field");
  //     }

  //     // Replace string payload with parsed JSON
  //     result[0].payload = parsedPayload;
  //     console.log("parsedPayload", parsedPayload);

  //     return encrypt(
  //       {
  //         success: true,
  //         message: "booking history listed successfully",
  //         token: tokens,
  //         result: result, // Return deleted record for reference
  //         payload:parsedPayload
  //       },
  //       true
  //     );
  //   } catch (error: unknown) {
  //     console.error("Error list booking history", error);

  //     return encrypt(
  //       {
  //         success: false,
  //         message: "An error occurred while list booking history",
  //         token: tokens,
  //         error: String(error),
  //       },
  //       true
  //     );
  //   }
  // }
  public async userBookingHistoryV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log("token", token);

    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listUserBookingHistoryQuery, [
        tokendata.id,
      ]);

      const parsedPayloadArray = [];

      for (const record of result) {
        try {
          const parsed = JSON.parse(record.payload);
          record.payload = parsed; // Replace string with parsed object
          parsedPayloadArray.push(parsed);
        } catch (err) {
          console.warn("Invalid JSON in payload field for record:", record);
          record.payload = null; // Optional: mark as null or handle differently
        }
      }

      return encrypt(
        {
          success: true,
          message: "Booking history listed successfully",
          token: tokens,
          result: result, // Now includes parsed payloads
          payloadArray: parsedPayloadArray, // Optional array of payloads only
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error listing booking history", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while listing booking history",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }

  public async userAuditPageV1(userData: any, tokendata: any): Promise<any> {
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log("token", token);

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
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log("token", token);

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
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log("token", token);

    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN");

      const { fromDate, toDate, refGroundId } = userData;
      console.log("userData", userData);

      const result = await executeQuery(listUnavailableAddonsQuery, [
        refGroundId,
      ]);

      const addons = await executeQuery(listaddonsQuery, [refGroundId]);
      const subAddOns = await executeQuery(listSubAddOnsQuery, [refGroundId]);
      const Items = await executeQuery(listItemsQuery, [refGroundId]);

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

      const getGroundPrice = await executeQuery(getGroundPriceQuery, [
        refGroundId,
      ]);
      console.log("getGroundPrice", getGroundPrice);

      const refGroundPrice = Number(getGroundPrice[0]?.refGroundPrice || 0);
      console.log("refGroundPrice", refGroundPrice);

      const refTournamentPrice = Number(
        getGroundPrice[0]?.refTournamentPrice || 0
      ); // ✅ correct key
      console.log("refTournamentPrice", refTournamentPrice);

      const dateList = generateDateRange(fromDate, toDate);
      console.log("dateList", dateList);
      console.log("dateList", dateList.length);
      // const totalGroundPrice = dateList.length * refGroundPrice;
      // console.log("totalGroundPrice", totalGroundPrice);

      const actualGroundPrice =
        dateList.length > 1 ? refTournamentPrice : refGroundPrice;
      const totalGroundPrice = dateList.length * actualGroundPrice;
      console.log("actualGroundPrice", actualGroundPrice);
      console.log("totalGroundPrice", totalGroundPrice);

      //       const refGroundPrice = Number(groundPriceRes[0]?.refGroundPrice || 0);
      // const refTournamentPrice = Number(groundPriceRes[0]?.refTournamentPrice || 0);

      let totalAmount = 0;
      if (fromDate && toDate) {
        const dateList = generateDateRange(fromDate, toDate);
        console.log("dateList", dateList);
        totalAmount = dateList.length * actualGroundPrice;
      } else {
        totalAmount = actualGroundPrice;
      }
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Unavailable Addons data listed successfully",
          token: tokens,
          result: result, // Return deleted record for reference
          addons: addons,
          subAddOns: subAddOns,
          Items: Items,
          groundUnavailableDates: groundUnavailableDate,
          totalgroundPrice: totalAmount,
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

  //   public async payConvertStringV1(userData: any, tokendata: any): Promise<any> {
  //     const token = { id: tokendata.id };
  //     const tokens = generateTokenWith5MExpire(token, true);
  //     const client: PoolClient = await getClient();

  //     try {
  //       await client.query("BEGIN");

  //       // 1. Convert payload to string
  //       const payloadString = JSON.stringify(userData);
  //       const refGroundId = userData.refGroundId;

  //       let totalAddonAmount = 0;

  //       // 2. Calculate addon amount
  //       for (const addon of userData.refAddOns || []) {
  //         const addonId = addon.refAddOnsId;
  //         const dates = addon.selectedDates || [];
  //         const personCount = addon.refPersonCount || 1;

  //         for (const date of dates) {
  //           if (addon.isSubaddonNeeded && addon.refSubaddons?.length > 0) {
  //             for (const subaddon of addon.refSubaddons) {
  //               const subaddonId = subaddon.refSubaddonId;

  //               if (subaddon.isItemsNeeded && subaddon.refItems?.length > 0) {
  //                 for (const item of subaddon.refItems) {
  //                   const itemId = item.refItemsId;

  //                   // Try to get item price
  //                   const { rows: itemPriceRows } = await client.query(
  //                     `
  // SELECT
  //   "refItemsPrice"
  // FROM
  //   public."refItems"
  // WHERE
  //   "refGroundId" = $1
  //   AND "refItemsId" = $2                    `,
  //                     [refGroundId, itemId]
  //                   );

  //                   if (
  //                     itemPriceRows.length > 0 &&
  //                     itemPriceRows[0].refItemsPrice !== null
  //                   ) {
  //                     totalAddonAmount +=
  //                       Number(itemPriceRows[0].refItemsPrice) * personCount;
  //                   } else {
  //                     // Fallback: subaddon price
  //                     const { rows: subaddonPriceRows } = await client.query(
  //                       `
  // SELECT
  //   "refSubAddOnPrice"
  // FROM
  //   public."subAddOns"
  // WHERE
  //   "refGroundId" = $1
  //   AND "subAddOnsId" = $2                      `,
  //                       [refGroundId, subaddonId]
  //                     );
  //                     if (
  //                       subaddonPriceRows.length > 0 &&
  //                       subaddonPriceRows[0].refSubAddOnPrice !== null
  //                     ) {
  //                       totalAddonAmount +=
  //                         Number(subaddonPriceRows[0].refSubAddOnPrice) *
  //                         personCount;
  //                     } else {
  //                       // Fallback: addon price
  //                       const { rows: addonPriceRows } = await client.query(
  //                         `
  //                          SELECT
  //                        "refAddonPrice"
  //                 FROM
  //   public."refAddOns"
  // WHERE
  //   "refGroundId" = $1
  //   AND "refAddOnsId" = $2                        `,
  //                         [refGroundId, addonId]
  //                       );
  //                       if (
  //                         addonPriceRows.length > 0 &&
  //                         addonPriceRows[0].refAddonPrice !== null
  //                       ) {
  //                         totalAddonAmount +=
  //                           Number(addonPriceRows[0].refAddonPrice) * personCount;
  //                       }
  //                     }
  //                   }
  //                 }
  //               } else {
  //                 // No items needed, use subaddon price if exists
  //                 const { rows: subaddonPriceRows } = await client.query(
  //                   `
  // SELECT
  //   "refSubAddOnPrice"
  // FROM
  //   public."subAddOns"
  // WHERE
  //   "refGroundId" = $1
  //   AND "subAddOnsId" = $2                  `,
  //                   [refGroundId, subaddon.subAddonId]
  //                 );
  //                 if (
  //                   subaddonPriceRows.length > 0 &&
  //                   subaddonPriceRows[0].subAddonPrice !== null
  //                 ) {
  //                   totalAddonAmount +=
  //                     Number(subaddonPriceRows[0].subAddonPrice) * personCount;
  //                 }
  //               }
  //             }
  //           } else {
  //             // No subaddons needed, use addon price
  //             const { rows: addonPriceRows } = await client.query(
  //               `
  //               SELECT "addOnPrice" FROM "refAddOns" WHERE "refGroundId" = $1 AND "refAddOnsId" = $2
  //               `,
  //               [refGroundId, addonId]
  //             );
  //             if (
  //               addonPriceRows.length > 0 &&
  //               addonPriceRows[0].addOnPrice !== null
  //             ) {
  //               totalAddonAmount +=
  //                 Number(addonPriceRows[0].addOnPrice) * personCount;
  //             }
  //           }
  //         }
  //       }

  //       // 3. Get base booking amount (ground price)
  //       const { rows: groundPriceRows } = await client.query(
  //         `SELECT "refGroundPrice" FROM "refGround" WHERE "refGroundId" = $1`,
  //         [refGroundId]
  //       );
  //       const bookingAmount = Number(groundPriceRows[0]?.groundPrice ?? 0);

  //       // 4. GST calculations (9% SGST + 9% CGST)
  //       const resSGSTAmount = (bookingAmount + totalAddonAmount) * 0.09;
  //       const refCGSTAmount = (bookingAmount + totalAddonAmount) * 0.09;
  //       const totalAmount =
  //         bookingAmount + totalAddonAmount + resSGSTAmount + refCGSTAmount;

  //       // 5. Insert into tempStorage
  //       await client.query(
  //         `
  //        INSERT INTO
  //   public."tempStorage" (
  //     "payload",
  //     "bookingAmount",
  //     "addonsAmount",
  //     "resSGSTAmount",
  //     "refCGSTAmount",
  //     "totalAmount",
  //     "createdAt",
  //     "createdBy"
  //   )
  // VALUES
  //   ($1, $2, $3, $4, $5, $6, $7, $8)
  //        `,
  //         [
  //           payloadString,
  //           bookingAmount.toFixed(2),
  //           totalAddonAmount.toFixed(2),
  //           resSGSTAmount.toFixed(2),
  //           refCGSTAmount.toFixed(2),
  //           totalAmount.toFixed(2),
  //           CurrentTime(),
  //           tokendata.id,
  //           false,
  //         ]
  //       );

  //       await client.query("COMMIT");

  //       return encrypt(
  //         {
  //           success: true,
  //           message: "Payment conversion and calculation successful",
  //           token: tokens,
  //           bookingAmount: bookingAmount.toFixed(2),
  //           addonsAmount: totalAddonAmount.toFixed(2),
  //           resSGSTAmount: resSGSTAmount.toFixed(2),
  //           refCGSTAmount: refCGSTAmount.toFixed(2),
  //           totalAmount: totalAmount.toFixed(2),
  //         },
  //         true
  //       );
  //     } catch (error: unknown) {
  //       console.error("Error in payConvertStringV1:", error);
  //       await client.query("ROLLBACK");

  //       return encrypt(
  //         {
  //           success: false,
  //           message: "An error occurred while processing payment conversion",
  //           token: tokens,
  //           error: String(error),
  //         },
  //         true
  //       );
  //     } finally {
  //       client.release();
  //     }
  //   }
  public async payConvertStringV1(userData: any, tokendata: any): Promise<any> {
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log("token", token);

    const tokens = generateTokenWith5MExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN");

      // 1. Convert payload to string
      const payloadString = JSON.stringify(userData);
      const refGroundId = userData.refGroundId;

      let totalAddonAmount = 0;

      // 2. Preload all addon, subaddon, and item prices to reduce DB calls
      // Extract all IDs needed from userData
      const addonIds = (userData.refAddOns || []).map(
        (a: any) => a.refAddOnsId
      );
      const subaddonIds: number[] = [];
      const itemIds: number[] = [];

      for (const addon of userData.refAddOns || []) {
        if (addon.isSubaddonNeeded && Array.isArray(addon.refSubaddons)) {
          for (const subaddon of addon.refSubaddons) {
            subaddonIds.push(subaddon.refSubaddonId);
            if (subaddon.isItemsNeeded && Array.isArray(subaddon.refItems)) {
              for (const item of subaddon.refItems) {
                itemIds.push(item.refItemsId);
              }
            }
          }
        }
      }

      // Fetch prices in bulk for all IDs at once
      const { rows: addonPriceRows } = await client.query(
        `
      SELECT "refAddOnsId", "refAddonPrice"
      FROM public."refAddOns"
      WHERE "refGroundId" = $1 AND "refAddOnsId" = ANY($2::int[])
      `,
        [refGroundId, addonIds.length > 0 ? addonIds : [-1]]
      );

      const { rows: subaddonPriceRows } = await client.query(
        `
      SELECT "subAddOnsId", "refSubAddOnPrice"
      FROM public."subAddOns"
      WHERE "refGroundId" = $1 AND "subAddOnsId" = ANY($2::int[])
      `,
        [refGroundId, subaddonIds.length > 0 ? subaddonIds : [-1]]
      );

      const { rows: itemPriceRows } = await client.query(
        `
      SELECT "refItemsId", "refItemsPrice"
      FROM public."refItems"
      WHERE "refGroundId" = $1 AND "refItemsId" = ANY($2::int[])
      `,
        [refGroundId, itemIds.length > 0 ? itemIds : [-1]]
      );

      // Create lookup maps for quick price access
      const addonPriceMap = new Map<number, number>();
      addonPriceRows.forEach((r) =>
        addonPriceMap.set(r.refAddOnsId, Number(r.refAddonPrice))
      );

      const subaddonPriceMap = new Map<number, number>();
      subaddonPriceRows.forEach((r) =>
        subaddonPriceMap.set(r.subAddOnsId, Number(r.refSubAddOnPrice))
      );

      const itemPriceMap = new Map<number, number>();
      itemPriceRows.forEach((r) =>
        itemPriceMap.set(r.refItemsId, Number(r.refItemsPrice))
      );

      // 3. Calculate addon amount using preloaded price maps
      for (const addon of userData.refAddOns || []) {
        const addonId = addon.refAddOnsId;
        const dates = addon.selectedDates || [];
        const personCount = addon.refPersonCount || 1;

        for (const _date of dates) {
          if (
            addon.isSubaddonNeeded &&
            Array.isArray(addon.refSubaddons) &&
            addon.refSubaddons.length > 0
          ) {
            for (const subaddon of addon.refSubaddons) {
              const subaddonId = subaddon.refSubaddonId;

              if (
                subaddon.isItemsNeeded &&
                Array.isArray(subaddon.refItems) &&
                subaddon.refItems.length > 0
              ) {
                for (const item of subaddon.refItems) {
                  const itemId = item.refItemsId;

                  if (itemPriceMap.has(itemId)) {
                    totalAddonAmount += itemPriceMap.get(itemId)! * personCount;
                  } else if (subaddonPriceMap.has(subaddonId)) {
                    totalAddonAmount +=
                      subaddonPriceMap.get(subaddonId)! * personCount;
                  } else if (addonPriceMap.has(addonId)) {
                    totalAddonAmount +=
                      addonPriceMap.get(addonId)! * personCount;
                  }
                  // else price zero
                }
              } else {
                // No items needed, use subaddon price if exists
                if (subaddonPriceMap.has(subaddonId)) {
                  totalAddonAmount +=
                    subaddonPriceMap.get(subaddonId)! * personCount;
                }
              }
            }
          } else {
            // No subaddons needed, use addon price
            if (addonPriceMap.has(addonId)) {
              totalAddonAmount += addonPriceMap.get(addonId)! * personCount;
            }
          }
        }
      }

      // 4. Get base booking amount (ground price)
      const { rows: groundPriceRows } = await client.query(
        `SELECT "refGroundPrice", "refTournamentPrice" FROM "refGround" WHERE "refGroundId" = $1`,
        [refGroundId]
      );

      // const {refGroundPrice, refTournamentPrice} = groundPriceRows[0]
      if (!groundPriceRows.length || groundPriceRows[0].groundPrice === null) {
        throw new Error("Ground price not found for the given refGroundId");
      }

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

      //  const dateList = generateDateRange(userData.refBookingStartDate, userData.refBookingEndDate);
      // console.log("dateList", dateList);
      // console.log("dateList", dateList.length);

      // const actualGroundPrice =
      //   dateList.length > 1 ? refTournamentPrice : refGroundPrice;
      //   console.log('refGroundPrice', refGroundPrice)
      //   console.log('refTournamentPrice', refTournamentPrice)
      // const totalGroundPrice = dateList.length * actualGroundPrice;
      // console.log("actualGroundPrice", actualGroundPrice);
      // console.log("totalGroundPrice", totalGroundPrice);

      // const bookingAmount = Number(
      //   groundPriceRows[0].actualGroundPrice *
      //     generateDateRange(
      //      userData.refBookingStartDate, userData.refBookingEndDate
      //     ).length
      // );

      // console.log(bookingAmount + "---->>>>>>>>>");

      const refGroundPrice = Number(groundPriceRows[0].refGroundPrice);
      console.log("refGroundPrice", refGroundPrice);
      const refTournamentPrice = Number(groundPriceRows[0].refTournamentPrice);
      console.log("refTournamentPrice", refTournamentPrice);

      const dateList = generateDateRange(
        userData.refBookingStartDate,
        userData.refBookingEndDate
      );

      const actualGroundPrice =
        dateList.length > 1 ? refTournamentPrice : refGroundPrice;
      const totalGroundPrice = dateList.length * actualGroundPrice;
      const bookingAmount = totalGroundPrice;
      console.log("actualGroundPrice", actualGroundPrice);
      // 5. GST calculations (9% SGST + 9% CGST)
      const resSGSTAmount = (bookingAmount + totalAddonAmount) * 0.09;
      const refCGSTAmount = (bookingAmount + totalAddonAmount) * 0.09;
      const totalAmount =
        bookingAmount + totalAddonAmount + resSGSTAmount + refCGSTAmount;

      // 6. Insert into tempStorage
      const existing = await client.query(
        `SELECT
          *
        FROM
          public."tempStorage"
        WHERE
          "createdBy" = $1
          AND "isDelete" IS NOT true
        LIMIT
          1`,
        [tokendata.id]
      );

      if (existing.rows.length > 0) {
        // Update existing record
        await client.query(
          `
          UPDATE public."tempStorage"
          SET 
            "payload" = $1,
            "bookingAmount" = $2,
            "addonsAmount" = $3,
            "resSGSTAmount" = $4,
            "refCGSTAmount" = $5,
            "totalAmount" = $6,
            "createdAt" = NOW()
          WHERE "createdBy" = $7
          AND "isDelete" IS NOT true
          `,
          [
            payloadString,
            bookingAmount.toFixed(2),
            totalAddonAmount.toFixed(2),
            resSGSTAmount.toFixed(2),
            refCGSTAmount.toFixed(2),
            totalAmount.toFixed(2),
            tokendata.id,
          ]
        );
      } else {
        // Insert new record
        await client.query(
          `
    INSERT INTO public."tempStorage" (
      "payload",
      "bookingAmount",
      "addonsAmount",
      "resSGSTAmount",
      "refCGSTAmount",
      "totalAmount",
      "createdAt",
      "createdBy"
    ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)
    `,
          [
            payloadString,
            bookingAmount.toFixed(2),
            totalAddonAmount.toFixed(2),
            resSGSTAmount.toFixed(2),
            refCGSTAmount.toFixed(2),
            totalAmount.toFixed(2),
            tokendata.id,
          ]
        );
      }

      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Payment conversion and calculation successful",
          token: tokens,
          bookingAmount: bookingAmount.toFixed(2),
          addonsAmount: totalAddonAmount.toFixed(2),
          resSGSTAmount: resSGSTAmount.toFixed(2),
          refCGSTAmount: refCGSTAmount.toFixed(2),
          totalAmount: totalAmount.toFixed(2),
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error in payConvertStringV1:", error);
      await client.query("ROLLBACK");

      return encrypt(
        {
          success: false,
          message: "An error occurred while processing payment conversion",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }

  public async getconvertedDataAmountV1(
    user_data: any,
    tokendata: any
  ): Promise<any> {
    // const token = { id: tokendata.id };
    // const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      const result = await executeQuery(getconvertedDataAmountQuery, [
        tokendata.id,
      ]);

      const profile = await executeQuery(
        `
        SELECT
        u."refUserFname" || ' ' || u."refUserLname" AS "username",
        rd."refMobileNumber" AS "mobilenumber",
        rd."refEmail" AS "email"
      FROM
        public."users" u
        JOIN public."refUsersDomain" rd ON rd."refUserId" = u."refuserId"
      WHERE
        u."refuserId" = $1
        `,
        [tokendata.id]
      );

      // const getpayload = result[0].payload;

      if (!result || result.length === 0) {
        throw new Error("No data found for given tempStorageId");
      }

      // Convert string payload to JSON
      const payloadString = result[0].payload;
      let parsedPayload;
      try {
        parsedPayload = JSON.parse(payloadString);
      } catch (err) {
        throw new Error("Invalid JSON in payload field");
      }

      // Replace string payload with parsed JSON
      result[0].payload = parsedPayload;
      console.log("parsedPayload", parsedPayload);
      return encrypt(
        {
          success: true,
          message: "get convertedData and Amount successful",
          // token: tokens,
          result: result,
          parsedPayload: parsedPayload,
          profile: profile,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error in get convertedData and Amount:", error);
      await client.query("ROLLBACK");

      return encrypt(
        {
          success: false,
          message:
            "An error occurred while processing get convertedData and Amount",
          // token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }

  public async listSportCategoryV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log("token", token);

    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listSportCategoryQuery);

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

}
