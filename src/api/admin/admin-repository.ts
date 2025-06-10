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

import { CurrentTime } from "../../helper/common";
import {
  approveGroundQuery,
  approveGrounNamedQuery,
  checkEmailQuery,
  checkMobileQuery,
  deleteAuditQuery,
  deleteUserBookingQuery,
  getLastCustomerIdQuery,
  groundAuditQuery,
  insertUserDomainQuery,
  insertUserQuery,
  listAdmindashboardQuery,
  listAllUserBookingsQuery,
  listdashboardQuery,
  listOverallAuditQuery,
  listReportQuery,
  listSignUpUserQuery,
  listUserBookingsQuery,
  ownerStatusAuditQuery,
  selectUserByLogin,
  updateHistoryQuery,
} from "./query";

export class adminRepository {
  public async userSignUpV1(userData: any, token_data?: any): Promise<any> {
    const client: PoolClient = await getClient();
    try {
      await client.query("BEGIN");
      const {
        refPassword,
        refFName,
        refLName,
        refDOB,
        refUserEmail,
        refMoblile,
      } = userData;

      const hashedPassword = await bcrypt.hash(refPassword, 10);

      const checkmobile = [refMoblile];
      const checkEmail = [refUserEmail];

      const userCheck = await executeQuery(checkMobileQuery, checkmobile);
      const mobliecount = Number(userCheck[0]?.count || 0); // safely convert to number
      console.log("count", mobliecount);

      if (mobliecount > 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            message: `Moblile Number Already exists`,
            success: false,
          },
          true
        );
      }
      const userEMailCheck = await executeQuery(checkEmailQuery, checkEmail);
      const count = Number(userEMailCheck[0]?.count || 0); // safely convert to number
      console.log("count", count);

      if (count > 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            message: `Email Already exists`,
            success: false,
          },
          true
        );
      }

      const customerPrefix = "CGA-CUS-";
      const baseNumber = 0;

      const lastCustomerResult = await client.query(getLastCustomerIdQuery);
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
        refFName,
        refLName,
        refDOB,
        2,
        CurrentTime(),
        2,
      ];
      const userResult = await client.query(insertUserQuery, params);
      const newUser = userResult.rows[0];

      // Insert into userDomain table
      const domainParams = [
        newUser.refuserId,
        refMoblile,
        refUserEmail,
        refUserEmail,
        refPassword,
        hashedPassword,
        CurrentTime(),
        2,
      ];

      const domainResult = await client.query(
        insertUserDomainQuery,
        domainParams
      );
      if ((userResult.rowCount ?? 0) > 0 && (domainResult.rowCount ?? 0) > 0) {
        const history = [
          1,
          newUser.refuserId,
          `${userData.refFName} user signed Up succcesfully`,
          CurrentTime(),
          3,
        ];
        const updateHistory = await client.query(updateHistoryQuery, history);

        await client.query("COMMIT");

        return encrypt(
          {
            success: true,
            message: "User signed up added successful",
            user: newUser,
            firstName: refFName,
            lastName: refLName,
          },
          true
        );
      }
    } catch (error: unknown) {
      await client.query("ROLLBACK");
      console.error("Error during User signed up:", error);
      return encrypt(
        {
          success: false,
          message: "An unexpected error occurred during User signed up ",
          error: error instanceof Error ? error.message : String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async userLoginV1(user_data: any, domain_code?: any): Promise<any> {
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN");

      const params = [user_data.login];
      const users: any = await client.query(selectUserByLogin, params);

      if (!users.rows || users.rows.length === 0) {
        return encrypt(
          {
            success: false,
            message: "Invalid login credentials. User not found.",
          },
          true
        );
      }

      const { refUserTypeId } = users.rows[0];

      const user = users.rows[0];

      if (!user.refCustHashedPassword) {
        console.error("Error: User has no hashed password stored.");
        return encrypt(
          {
            success: false,
            message: "Invalid login credentials UserHashedPassword not match",
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
            message: "Invalid login credentials, validPassword is in false",
          },
          true
        );
      }

      // validPassword === true
      // const tokenData = { id: user.refUserId };

      const tokenData = { id: user.refUserId, roleId: refUserTypeId };
      console.log("tokenData", tokenData);

      const history = [
        2,
        user.refUserId,
        `${user_data.login} login successfully`,
        CurrentTime(),
        user.refUserId,
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      const generatedToken = generateTokenWithExpire(tokenData, true);
      console.log("generatedToken", generatedToken);

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
      await client.query("ROLLBACK");

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

  public async listUserBookingsV1(userData: any, tokendata: any): Promise<any> {
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log('token', token)

    const tokens = generateTokenWithExpire(token, true);

    try {
      let result;

      if (tokendata.roleId !== 1) {
        result = await executeQuery(listUserBookingsQuery, [tokendata.id]);
      } else {
        result = await executeQuery(listAllUserBookingsQuery);
      }

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
          message: "ground booking listed successfully",
          token: tokens,
          result: result, // Return deleted record for reference
          parsedPayloadArray: parsedPayloadArray,
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list ground", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list ground booking",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async deleteBookingsV1(userData: any, tokendata: any): Promise<any> {
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log('token', token)

    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN"); // Start transaction

      const { refUserBookingId } = userData;
      const result = await client.query(deleteUserBookingQuery, [
        refUserBookingId,
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
        27, // Unique ID for delete action
        tokendata.id,
        `booking deleted succesfully`,
        CurrentTime(),
        tokendata.id,
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "booking deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting booking:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the booking",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listSignUpUsersV1(userData: any, tokendata: any): Promise<any> {
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log('token', token)

    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listSignUpUserQuery);

      return encrypt(
        {
          success: true,
          message: "sign up users listed successfully",
          token: tokens,
          result: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list sign up users", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list sign up users",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async listOverallAuditV1(userData: any, tokendata: any): Promise<any> {
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log('token', token)

    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listOverallAuditQuery);

      return encrypt(
        {
          success: true,
          message: "over all audit listed successfully",
          token: tokens,
          result: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list over all audit", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list over all audit",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async reportPageV1(userData: any, tokendata: any): Promise<any> {
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log('token', token)

    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listReportQuery);

      return encrypt(
        {
          success: true,
          message: "list Report listed successfully",
          token: tokens,
          result: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list list Report", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list over all Report",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async dashboardV1(userData: any, tokendata: any): Promise<any> {
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log('token', token)

    const tokens = generateTokenWithExpire(token, true);

    try {
      // const result = await executeQuery(listdashboardQuery);
      let result;

      if (tokendata.roleId !== 1) {
        result = await executeQuery(listdashboardQuery, [tokendata.id]);
      } else {
        result = await executeQuery(listAdmindashboardQuery);
      }
      return encrypt(
        {
          success: true,
          message: "list dashboard listed successfully",
          token: tokens,
          result: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list list dashboardV1", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list dashboardV1",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async approveGroundV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log('token', token)

    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN"); // Start transaction

      const { refGroundId, status } = userData;
      const result = await client.query(approveGroundQuery, [
        refGroundId,
        status,
        // CurrentTime(),
        // tokendata.id,
      ]);

      const name = await executeQuery(approveGrounNamedQuery, [refGroundId]);
      console.log("name", name);
      const groundName = name[0].refGroundName;
      console.log("groundName", groundName);

      // if (result.rowCount === 0) {
      //   await client.query("ROLLBACK");
      //   return encrypt(
      //     {
      //       success: false,
      //       message: "booking not found or already deleted",
      //       token: tokens,
      //     },
      //     true
      //   );
      // }

      const history = [
        40, // Unique ID for delete action
        tokendata.id,
        `${groundName} Ground ${status} Successfully`,
        CurrentTime(),
        tokendata.id,
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "ground Approved successfully",
          token: tokens,
          result: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error ground Approved", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while ground Approved",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async ownerAuditV1(userData: any, tokendata: any): Promise<any> {
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log('token', token)

    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(ownerStatusAuditQuery);
      const groundAudit = await executeQuery(groundAuditQuery);
   
      return encrypt(
        {
          success: true,
          message: "list ownerAudit listed successfully",
          token: tokens,
          result: result, // Return deleted record for reference
          groundAudit:groundAudit
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list list ownerAudit", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list ownerAudit",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async deleteAuditV1(userData: any, tokendata: any): Promise<any> {
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log('token', token)
    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN"); // Start transaction

      const { refTxnHistoryId } = userData;
      const result = await client.query(deleteAuditQuery, [
        refTxnHistoryId,
        CurrentTime(),
        tokendata.id,
      ]);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "audit not found or already deleted",
            token: tokens,
          },
          true
        );
      }

      // const history = [
      //   27, // Unique ID for delete action
      //   tokendata.id,
      //   `booking deleted succesfully`,
      //   CurrentTime(),
      //   tokendata.id,
      // ];

      // await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "audit deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting audit:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the audit",
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
