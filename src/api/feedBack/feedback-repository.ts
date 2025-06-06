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

// import {

// } from "./query";
import { CurrentTime } from "../../helper/common";
import {
  addFeedBackQuery,
  addGroundFeedBackQuery,
  getTransactionHistoryQuery,
  listFeedBackQuery,
  listGroundFeedBackHistoryQuery,
  listUserFeedBackHistoryQuery,
  updateHistoryQuery,
} from "./query";

export class feedBackRepository {
  public async addFeedBackV1(userData: any, tokendata: any): Promise<any> {
    console.log("userData", userData);
    const client: PoolClient = await getClient();
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };

    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");
      const { refGroundId, refContent, refRatings } = userData;

      const params = [
        tokendata.id,
        refGroundId,
        refContent,
        refRatings,
        CurrentTime(),
        tokendata.id,
      ];
      console.log("params", params);
      const userResult = await client.query(addFeedBackQuery, params);
      console.log("userResult", userResult);

      const history = [
        31,
        tokendata.id,
        `User Feedback added succesfully`,
        CurrentTime(),
        tokendata.id,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "User Feedback added successfully",
          data: userResult,
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
          message: "An unknown error occurred during Food And Snacks addition",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listFeedBackV1(userData: any, tokendata: any): Promise<any> {
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };

    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listFeedBackQuery);

      return encrypt(
        {
          success: true,
          message: "Feed Back listed successfully",
          token: tokens,
          result: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list Feed Back", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list Feed Back",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async groundFeedBackV1(userData: any, tokendata: any): Promise<any> {
    console.log("userData", userData);
    const client: PoolClient = await getClient();
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };

    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");

      const { refGroundId, refContent, refRatings } = userData;

      const getTransactionHistory = await executeQuery(
        getTransactionHistoryQuery,
        [tokendata.id]
      );
      console.log("getTransactionHistory", getTransactionHistory);

      if (getTransactionHistory.length === 0) {
        await client.query("ROLLBACK");

        return encrypt(
          {
            success: false,
            message: "You are not allowed to give ground feedback",
            token: tokens,
          },
          true
        );
      }

      const params = [
        tokendata.id,
        refGroundId,
        refContent,
        refRatings,
        "GroundFeedBack",
        CurrentTime(),
        tokendata.id,
      ];
      console.log("params", params);
      const userResult = await client.query(addGroundFeedBackQuery, params);
      console.log("userResult", userResult);

      const history = [
        32,
        tokendata.id,
        `Ground Feedback added successfully`,
        CurrentTime(),
        tokendata.id,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "ground Feedback added successfully",
          data: userResult,
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
          message: "An unknown error occurred while adding feedback",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async userFeedBackHistoryV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };

    const tokens = generateTokenWithExpire(token, true);

    try {
      const result1 = await executeQuery(listUserFeedBackHistoryQuery, [
        tokendata.id,
      ]);
      const result2 = await executeQuery(listGroundFeedBackHistoryQuery, [
        tokendata.id,
      ]);

      return encrypt(
        {
          success: true,
          message: "Feed Back History listed successfully",
          token: tokens,
          userFeedBack: result1, // Return deleted record for reference
          groundFeenback: result2, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list Feed Back History", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list Feed Back History",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
}
