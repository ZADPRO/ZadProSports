import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
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
import { deletePayoutsquery, groundEarningsQuery } from "./query";

export class financeRepository {
  public async bookingListV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log("token", token);
    const tokens = generateTokenWithExpire(token, true);

    try {
      // // Determine the current week's start and end dates
      // const now = new Date();
      // const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)
      // const diffToMonday =
      //   now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

      // const weekStart = new Date(now.setDate(diffToMonday));
      // weekStart.setHours(0, 0, 0, 0);

      // const weekEnd = new Date(weekStart);
      // weekEnd.setDate(weekStart.getDate() + 6);
      // weekEnd.setHours(23, 59, 59, 999);

      // // Format helper
      // const formatDate = (date: Date) => {
      //   const year = date.getFullYear();
      //   const month = String(date.getMonth() + 1).padStart(2, "0"); // month is 0-based
      //   const day = String(date.getDate()).padStart(2, "0");
      //   return `${year}-${month}-${day}`;
      // };

      // Fetch earnings per owner
      const earningsQuery = `
SELECT
  o."refOwnerId",
  o."refOwnerCustId",
  o."refOwnerFname",
  o."refEmailId",
  o."refMobileId",
  rg."refGroundId",
  rg."refGroundName",
  rg."refGroundCustId",
  ROUND(SUM(ub."retTotalAmount"::numeric), 2) AS "totalEarnings",
  ROUND(SUM((ub."retTotalAmount"::numeric * 30 / 100)), 2) AS "totalCommission",
  ROUND(SUM(ub."retTotalAmount"::numeric - (ub."retTotalAmount"::numeric * 30 / 100)), 2) AS "ownerReceivable"
FROM
  public."refUserBooking" ub
 LEFT JOIN public."refGround" rg ON ub."refGroundId" = rg."refGroundId"
 LEFT JOIN public.owners o ON rg."createdBy"::integer = o."refOwnerId"
WHERE
  ub."isDelete" IS NOT true
GROUP BY
  o."refOwnerId",
  o."refOwnerCustId",
  o."refOwnerFname",
  o."refEmailId",
  o."refMobileId",
  rg."refGroundId";
    `;
      const earningsResult = await executeQuery(earningsQuery, []);
      console.log("earningsResult", earningsResult);

      return encrypt(
        {
          success: true,
          message: "Weekly payouts generated successfully.",
          token: tokens,
          earningsResult: earningsResult,
        },
        true
      );
    } catch (error) {
      console.error("Error generating weekly payouts:", error);
      return encrypt(
        {
          success: false,
          message: "Error generating weekly payouts.",
          token: tokens,
        },
        true
      );
    }
  }
  public async recordBookingFinanceV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log("token", token);
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");

      // // Determine the current week's start and end dates
      // const now = new Date();
      // const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)
      // const diffToMonday =
      //   now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

      // const weekStart = new Date(now.setDate(diffToMonday));
      // weekStart.setHours(0, 0, 0, 0);

      // const weekEnd = new Date(weekStart);
      // weekEnd.setDate(weekStart.getDate() + 6);
      // weekEnd.setHours(23, 59, 59, 999);

      // // Format helper
      // const formatDate = (date: Date) => {
      //   const year = date.getFullYear();
      //   const month = String(date.getMonth() + 1).padStart(2, "0"); // month is 0-based
      //   const day = String(date.getDate()).padStart(2, "0");
      //   return `${year}-${month}-${day}`;
      // };

      // console.log("Week Start:", formatDate(weekStart)); // e.g. 2025-06-02
      // console.log("Week End:", formatDate(weekEnd)); // e.g. 2025-06-08
      // 1. Get weekStart and weekEnd from userData
      const { weekStartDate, weekEndDate } = userData;

      if (!weekStartDate || !weekEndDate) {
        throw new Error("Week start date and end date are required.");
      }

      const weekStart = new Date(weekStartDate);
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekEndDate);
      weekEnd.setHours(23, 59, 59, 999);

      // Optional: Validate that weekEnd is after weekStart
      if (weekEnd <= weekStart) {
        throw new Error("Week end date must be after start date.");
      }

      // Format helper
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      console.log("Week Start:", formatDate(weekStart));
      console.log("Week End:", formatDate(weekEnd));

      // Fetch earnings per owner
      const earningsQuery = `
    SELECT
  o."refOwnerId",
  o."refOwnerCustId",
  o."refOwnerFname",
  o."refEmailId",
  o."refMobileId",
  rg."refGroundId",
  rg."refGroundName",
  rg."refGroundCustId",
  ROUND(SUM(ub."retTotalAmount"::numeric), 2) AS "totalEarnings",
  ROUND(SUM((ub."retTotalAmount"::numeric * 30 / 100)), 2) AS "totalCommission",
  ROUND(SUM(ub."retTotalAmount"::numeric - (ub."retTotalAmount"::numeric * 30 / 100)), 2) AS "ownerReceivable"
FROM
  public."refUserBooking" ub
  JOIN public."refGround" rg ON ub."refGroundId" = rg."refGroundId"
  JOIN public.owners o ON rg."createdBy"::integer = o."refOwnerId"
WHERE
  ub."createdAt"::date BETWEEN $1::date AND $2::date
  AND ub."isDelete" IS NOT true
GROUP BY
  o."refOwnerId",
  o."refOwnerCustId",
  o."refOwnerFname",
  o."refEmailId",
  o."refMobileId",
  rg."refGroundId";
    `;
      const earningsResult = await client.query(earningsQuery, [
        weekStart,
        weekEnd,
      ]);
      console.log("earningsResult", earningsResult);

      const insertResults = [];

      // Insert into weeklyPayouts
      for (const row of earningsResult.rows) {
        const insertQuery = `
      INSERT INTO
     public."weeklyPayouts" (
    "refOwnerId",
    "weekStartDate",
    "weekEndDate",
    "totalEarnings",
    "totalCommission",
    "ownerReceivable",
    "payoutStatus",
    "createdAt",
    "createdBy"
  )
VALUES
  ($1, $2, $3, $4, $5, $6, 'pending', $7, $8)
      `;
        console.log("Row before insert:", row);
        const payouts = await client.query(insertQuery, [
          row.refOwnerId,
          weekStart,
          weekEnd,
          row.totalEarnings,
          row.totalCommission,
          row.ownerReceivable,
          CurrentTime(),
          tokendata.id,
        ]);
        insertResults.push(payouts);
      }

      await client.query("COMMIT");
      return encrypt(
        {
          success: true,
          message: "Weekly payouts generated successfully.",
          token: tokens,
          earningsResult: earningsResult,
          insertResults: insertResults,
        },
        true
      );
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error generating weekly payouts:", error);
      return encrypt(
        {
          success: false,
          message: "Error generating weekly payouts.",
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }

  //update paid status

  public async getWeeklyPayoutsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log("token", token);
    const tokens = generateTokenWithExpire(token, true);

    try {
      const query = `
      UPDATE "weeklyPayouts"
      SET "payoutStatus" = 'paid',
          "payoutDate" = $2,
          "updatedAt" = $3
      WHERE "payoutId" = $1
    `;
      const result = await executeQuery(query, [
        userData.payoutId,
        CurrentTime(),
        CurrentTime(),
      ]);

      return encrypt(
        {
          success: true,
          message: "Weekly payout marked as paid successfully.",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error) {
      console.error("Error marking weekly payout:", error);
      return encrypt(
        {
          success: false,
          message: "Error marking weekly payout.",
          token: tokens,
        },
        true
      );
    }
  }

  public async listPayoutesV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log("token", token);
    const tokens = generateTokenWithExpire(token, true);

    try {
      const listquery = `
      SELECT
     wp."payoutId",
     o."refOwnerFname",
     wp."weekStartDate",
     wp."weekEndDate",
    wp."totalEarnings",
    wp."totalCommission",
    wp."ownerReceivable",
    wp."payoutStatus",
    wp."payoutDate"
  FROM
  public."weeklyPayouts" wp
  LEFT JOIN "owners" o ON wp."refOwnerId" = o."refOwnerId"
WHERE
  wp."isDelete" IS NOT true
ORDER BY
  wp."weekStartDate" DESC
    `;
      const result = await executeQuery(listquery);

      return encrypt(
        {
          success: true,
          message: "list payout successfully.",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error) {
      console.error("Error marking list payout:", error);
      return encrypt(
        {
          success: false,
          message: "Error marking list payout.",
          token: tokens,
        },
        true
      );
    }
  }
  public async deletePayoutsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    console.log("token", token);
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(deletePayoutsquery, [
        userData.payoutId,
        CurrentTime(),
        tokendata.id
      ]);

      return encrypt(
        {
          success: true,
          message: "delete payout successfully.",
          token: tokens,
          result: result,
        },
        true
      );
    } catch (error) {
      console.error("Error marking delete payout:", error);
      return encrypt(
        {
          success: false,
          message: "Error marking delete payout.",
          token: tokens,
        },
        true
      );
    }
  }
}
