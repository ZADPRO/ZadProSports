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
  adduserBookingQuery,
  getUsersQuery,
  listFiletedGroundsQuery,
  listFreeGroundsQuery,
  listGroundsQuery,
  listProfleDataQuery,
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
  //   public async userGroundBookingV1(
  //     userData: any,
  //     tokendata: any
  //   ): Promise<any> {
  //     console.log("userData", userData);
  //     const client: PoolClient = await getClient();
  //     const token = { id: tokendata.id };
  //     const tokens = generateTokenWithExpire(token, true);
  //     try {
  //       await client.query("BEGIN");

  //       const {
  //         refGroundId,
  //         isFoodNeeded,
  //         refComboId,
  //         refComboCount,
  //         refBookingTypeId,
  //         isRoomNeeded,
  //         refBookingStartDate,
  //         refBookingEndDate,
  //         refStartTime,
  //         refEndTime,
  //         additionalNotes,
  //       } = userData;

  //       const food = isFoodNeeded === true;
  //       const combo = isFoodNeeded ? refComboId && refComboCount: null;
  //       if (refBookingTypeId === 1 ){
  //         const endDate = refBookingTypeId ? refBookingEndDate: null;
  //       }

  //       const params = [
  //         tokendata.id,
  //         refGroundId,
  //         food,
  //         combo,
  //         refComboCount,
  //         refBookingTypeId,
  //         isRoomNeeded,
  //         refBookingStartDate,
  //         endDate,
  //         refStartTime,
  //         refEndTime,
  //         additionalNotes,
  //         CurrentTime(),
  //         tokendata.id,
  //       ];
  //       console.log("params", params);
  //       const Result = await client.query(adduserBookingQuery, params);
  //       //   console.log("userResult", userResult);

  //       //   const history = [
  //       //     24,
  //       //     tokendata.id,
  //       //     `Ground Booked Successfully`,
  //       //     CurrentTime(),
  //       //     tokendata.id,
  //       //   ];

  //       //   const updateHistory = await client.query(updateHistoryQuery, history);
  //       await client.query("COMMIT");

  //       return encrypt(
  //         {
  //           success: true,
  //           message: "Ground booked  successfully",
  //           Result: Result,
  //           token: tokens,
  //         },
  //         true
  //       );
  //     } catch (error: unknown) {
  //       console.log("error", error);
  //       await client.query("ROLLBACK");

  //       return encrypt(
  //         {
  //           success: false,
  //           message: "An unknown error occurred during Ground booked",
  //           token: tokens,
  //           error: String(error),
  //         },
  //         true
  //       );
  //     } finally {
  //       client.release();
  //     }
  //   }
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

      const { refUserTypeId } = users.rows[0];

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

    try {
      await client.query("BEGIN");

      const {
        refGroundId,
        isFoodNeeded,
        refComboId,
        refComboCount,
        refBookingTypeId,
        isRoomNeeded,
        refBookingStartDate,
        refBookingEndDate,
        refStartTime,
        refEndTime,
        additionalNotes,
      } = userData;

      const food = isFoodNeeded === true;
      const comboId = food ? refComboId : null;
      const comboCount = food ? refComboCount : null;
      const endDate = refBookingTypeId === 1 ? refBookingEndDate : null;

      const params = [
        tokendata.id,
        refGroundId,
        food,
        comboId,
        comboCount,
        refBookingTypeId,
        isRoomNeeded,
        refBookingStartDate,
        endDate,
        refStartTime,
        refEndTime,
        additionalNotes,
        CurrentTime(),
        tokendata.id,
      ];

      console.log("params", params);
      const result = await client.query(adduserBookingQuery, params);
      const history = [
        28,
        tokendata.id,
        `Ground booked successfully`,
        CurrentTime(),
        tokendata.id,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Ground booked successfully",
          result,
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
  public async userAuditPageV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listUserAuditPageQuery, [
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
  
}
