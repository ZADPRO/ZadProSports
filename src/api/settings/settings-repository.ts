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
  addAditionalTipsQuery,
  addFacilitiesQuery,
  addFeaturesQuery,
  addFoodAndSnacksComboQuery,
  addFoodAndSnacksQuery,
  addSportCategoryQuery,
  addUserGuidelinesQuery,
  checkAdditionalTipsduplicateQuery,
  checkduplicateQuery,
  checkFacilitiesNameduplicateQuery,
  checkFeaturesQuery,
  checkFoodAndSnacksQuery,
  checkSportCategoryQuery,
  checkUserGuidelinesduplicateQuery,
  deleteAdditionalTipsQuery,
  deleteFacilitiesQuery,
  deleteFeaturesQuery,
  deleteFoodAndSnacksQuery,
  deleteFoodComboQuery,
  deleteFoodImageRecordQuery,
  deleteSportCategoryQuery,
  deleteUserGuidelinesQuery,
  getdeleteFeaturesQuery,
  getdeleteSportCategoryQuery,
  getdeleteUserGuidelineQuery,
  getFoodImageRecordQuery,
  listAdditionalTipsQuery,
  listFacilitiesQuery,
  listFeaturesQuery,
  listFoodAndSnacksQuery,
  listFoodCategoryQuery,
  listFoodComboQuery,
  listSportCategoryQuery,
  listUserGuidelinesQuery,
  updateAdditionalTipsQuery,
  updateFacilitiesQuery,
  updateFeaturesQuery,
  updateFoodAndSnacksQuery,
  updateHistoryQuery,
  updateSportCategoryQuery,
  updateUserGuidelinesQuery,
  uploadFoodAndSnacksComboQuery,
} from "./query";

export class settingsRepository {
  public async addSportCategoryV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };

    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");

      const { refSportsCategoryName } = userData;

      const check: any = await executeQuery(checkSportCategoryQuery, [
        refSportsCategoryName,
      ]);

      const count = Number(check[0]?.count || 0); // safely convert to number

      if (count > 0) {
        throw new Error(
          `Duplicate Sports Category found: "${refSportsCategoryName}" already exists.`
        );
      }

      const userResult = await executeQuery(addSportCategoryQuery, [
        refSportsCategoryName,
        CurrentTime(),
        tokendata.id,
      ]);

      const history = [
        3,
        tokendata.id,
        `${refSportsCategoryName} Sports Category added succesfully`,
        CurrentTime(),
        tokendata.id,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Sports Category added successfully",
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
          message: "An unknown error occurred during Sports Category addition",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async updateSportCategoryV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };

    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");

      const { refSportsCategoryId, refSportsCategoryName } = userData;

      const check: any = await executeQuery(checkSportCategoryQuery, [
        refSportsCategoryName,
      ]);

      const count = Number(check[0]?.count || 0); // safely convert to number

      if (count > 0) {
        throw new Error(
          `Duplicate Sports Category found: "${refSportsCategoryName}" already exists.`
        );
      }

      const userResult = await executeQuery(updateSportCategoryQuery, [
        refSportsCategoryId,
        refSportsCategoryName,
        CurrentTime(),
        tokendata.id,
      ]);

      const history = [
        4,
        tokendata.id,
        `${refSportsCategoryName} Sports Category Updated succesfully`,
        CurrentTime(),
        tokendata.id,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Sports Category updated successfully",
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
          message: "An unknown error occurred during Sports Category update",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async deleteSportCategoryV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };

    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN"); // Start transaction

      const { refSportsCategoryId } = userData;
      const result = await client.query(deleteSportCategoryQuery, [
        refSportsCategoryId,
        CurrentTime(),
        tokendata.id,
      ]);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "Sports Category not found or already deleted",
            token: tokens,
          },
          true
        );
      }

      const getdeleted: any = await client.query(getdeleteSportCategoryQuery, [
        refSportsCategoryId,
      ]);
      console.log("getdeleted", getdeleted);

      const { refSportsCategoryName } = getdeleted.rows[0];

      const history = [
        5, // Unique ID for delete action
        tokendata.id,
        `${refSportsCategoryName} Sports Category deleted succesfully`,
        CurrentTime(),
        tokendata.id,
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "Sports Category Name deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting Sports Category Name:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the Sports Category Name",
          token: tokens,
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

    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listSportCategoryQuery);

      return encrypt(
        {
          success: true,
          message: "Sports Category Name listed successfully",
          token: tokens,
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
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }

  public async addFeaturesV1(userData: any, tokendata: any): Promise<any> {
    console.log("tokendata", tokendata);
    const client: PoolClient = await getClient();
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");

      const { refFeaturesName } = userData;

      if (!Array.isArray(refFeaturesName) || refFeaturesName.length === 0) {
        return encrypt(
          {
            success: false,
            message: "No Features Name provided",
            token: tokens,
          },
          true
        );
      }

      const resultArray = [];

      for (const feature of refFeaturesName) {
        const { refFeaturesName } = feature;

        if (!refFeaturesName) continue;

        const duplicateCheck: any = await client.query(checkduplicateQuery, [
          refFeaturesName,
          tokendata.id,
        ]);

        const count = Number(duplicateCheck.rows[0]?.count || 0);
        if (count > 0) {
          throw new Error(
            `Duplicate Features found: "${refFeaturesName}" already exists.`
          );
        }

        const result = await client.query(addFeaturesQuery, [
          refFeaturesName,
          CurrentTime(),
          tokendata.id,
        ]);

        resultArray.push(result);
      }

      const history = [
        6,
        tokendata.id,
        `Added Features: ${refFeaturesName
          .map((item: any) => item.refFeaturesName)
          .join(", ")}`,
        CurrentTime(),
        tokendata.id,
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Features added successfully",
          token: tokens,
          result: resultArray,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      await client.query("ROLLBACK");

      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during Features addition",
          error: String(error),
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async updateFeaturesV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };

    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");

      const { refFeaturesId, refFeaturesName } = userData;

      const check: any = await executeQuery(checkFeaturesQuery, [
        refFeaturesName,
        tokendata.id,
      ]);

      const count = Number(check[0]?.count || 0); // safely convert to number

      if (count > 0) {
        throw new Error(
          `Duplicate Features found: "${refFeaturesName}" already exists.`
        );
      }

      const userResult = await executeQuery(updateFeaturesQuery, [
        refFeaturesId,
        refFeaturesName,
        CurrentTime(),
        tokendata.id,
      ]);

      const history = [
        7,
        tokendata.id,
        `${refFeaturesName} Feature Updated succesfully`,
        CurrentTime(),
        tokendata.id,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: " Features updated successfully",
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
          message: "An unknown error occurred during Features update",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async deleteFeaturesV1(userData: any, tokendata: any): Promise<any> {
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };

    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN"); // Start transaction

      const { refFeaturesId } = userData;
      const result = await client.query(deleteFeaturesQuery, [
        refFeaturesId,
        CurrentTime(),
        tokendata.id,
      ]);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "Features not found or already deleted",
            token: tokens,
          },
          true
        );
      }

      // const getdeleted: any = await client.query(getdeleteFeaturesQuery, [
      //   refFeaturesId,
      // ]);
      // console.log("getdeleted", getdeleted);

      // const { refFeaturesName } = getdeleted.rows[0];

      const history = [
        8, // Unique ID for delete action
        tokendata.id,
        ` Features deleted succesfully`,
        CurrentTime(),
        tokendata.id,
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "Features deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting Features:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the Features",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listFeaturesV1(userData: any, tokendata: any): Promise<any> {
    console.log("tokendata", tokendata);
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };

    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listFeaturesQuery, [tokendata.id]);

      return encrypt(
        {
          success: true,
          message: "Features Name listed successfully",
          token: tokens,
          result: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list Features", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list Features",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }

  public async addUserGuidelinesV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };

    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");

      const { refUserGuidelinesName } = userData;

      if (
        !Array.isArray(refUserGuidelinesName) ||
        refUserGuidelinesName.length === 0
      ) {
        return encrypt(
          {
            success: false,
            message: "No User Guidelines provided",
            token: tokens,
          },
          true
        );
      }

      const resultArray = [];

      for (const Guidelines of refUserGuidelinesName) {
        const { refUserGuidelinesName } = Guidelines;

        if (!refUserGuidelinesName) continue;

        const duplicateCheck: any = await client.query(
          checkUserGuidelinesduplicateQuery,
          [refUserGuidelinesName, tokendata.id]
        );

        const count = Number(duplicateCheck.rows[0]?.count || 0);
        if (count > 0) {
          throw new Error(
            `Duplicate User Guidelines found: "${refUserGuidelinesName}" already exists.`
          );
        }

        const result = await client.query(addUserGuidelinesQuery, [
          refUserGuidelinesName,
          CurrentTime(),
          tokendata.id,
        ]);

        resultArray.push(result);
      }

      const history = [
        9,
        tokendata.id,
        `Added UserGuidelines: ${refUserGuidelinesName
          .map((item: any) => item.refUserGuidelinesName)
          .join(", ")}`,
        CurrentTime(),
        tokendata.id,
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "User Guidelines added successfully",
          token: tokens,
          result: resultArray,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      await client.query("ROLLBACK");

      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during User Guidelines addition",
          error: String(error),
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async updateUserGuidelinesV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };

    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");

      const { refUserGuidelinesId, refUserGuidelinesName } = userData;

      const check: any = await executeQuery(checkUserGuidelinesduplicateQuery, [
        refUserGuidelinesName,
        tokendata.id,
      ]);

      const count = Number(check[0]?.count || 0); // safely convert to number

      if (count > 0) {
        throw new Error(
          `Duplicate User guideline found: "${refUserGuidelinesName}" already exists.`
        );
      }

      const userResult = await executeQuery(updateUserGuidelinesQuery, [
        refUserGuidelinesId,
        refUserGuidelinesName,
        CurrentTime(),
        tokendata.id,
      ]);

      const history = [
        10,
        tokendata.id,
        `${refUserGuidelinesName} User guideline Updated succesfully`,
        CurrentTime(),
        tokendata.id,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: " User guideline updated successfully",
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
          message: "An unknown error occurred during User guideline update",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async deleteUserGuidelinesV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };

    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN"); // Start transaction

      const { refUserGuidelinesId } = userData;
      const result = await client.query(deleteUserGuidelinesQuery, [
        refUserGuidelinesId,
        CurrentTime(),
        tokendata.id,
      ]);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "User guideline not found or already deleted",
            token: tokens,
          },
          true
        );
      }

      // const getdeleted: any = await client.query(getdeleteUserGuidelineQuery, [
      //   refUserGuidelinesId,
      // ]);

      // if (
      //   !getdeleted ||
      //   !Array.isArray(getdeleted.rows) ||
      //   getdeleted.rows.length === 0
      // ) {
      //   await client.query("ROLLBACK");
      //   return encrypt(
      //     {
      //       success: false,
      //       message: "User guideline not found for history log",
      //       token: tokens,
      //     },
      //     true
      //   );
      // }

      // const { refUserGuidelinesName } = getdeleted.rows[0];

      const history = [
        11, // Unique ID for delete action
        tokendata.id,
        `User guideline deleted succesfully`,
        CurrentTime(),
        tokendata.id,
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "User guideline deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting User guideline:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the User guideline",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listUserGuidelinesV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };

    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listUserGuidelinesQuery, [
        tokendata.id,
      ]);

      return encrypt(
        {
          success: true,
          message: "User Guidelines Name listed successfully",
          token: tokens,
          result: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list User Guidelines", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list User Guidelines",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }

  public async addFacilitiesV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };

    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");

      const { refFacilitiesName } = userData;

      if (!Array.isArray(refFacilitiesName) || refFacilitiesName.length === 0) {
        return encrypt(
          {
            success: false,
            message: "No Facilities provided",
            token: tokens,
          },
          true
        );
      }

      const resultArray = [];

      for (const Facilities of refFacilitiesName) {
        const { refFacilitiesName } = Facilities;

        if (!refFacilitiesName) continue;

        const duplicateCheck: any = await client.query(
          checkFacilitiesNameduplicateQuery,
          [refFacilitiesName]
        );

        const count = Number(duplicateCheck.rows[0]?.count || 0);
        if (count > 0) {
          throw new Error(
            `Duplicate Facilities found: "${refFacilitiesName}" already exists.`
          );
        }

        const result = await client.query(addFacilitiesQuery, [
          refFacilitiesName,
          CurrentTime(),
          tokendata.id,
        ]);

        resultArray.push(result);
      }

      const history = [
        12,
        tokendata.id,
        `Added Facilities: ${refFacilitiesName
          .map((item: any) => item.refFacilitiesName)
          .join(", ")}`,
        CurrentTime(),
        tokendata.id,
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Facilities added successfully",
          token: tokens,
          result: resultArray,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      await client.query("ROLLBACK");

      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during Facilities addition",
          error: String(error),
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async updateFacilitiesV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };

    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");

      const { refFacilitiesId, refFacilitiesName } = userData;

      const check: any = await executeQuery(checkFacilitiesNameduplicateQuery, [
        refFacilitiesName,
        tokendata.id,
      ]);

      const count = Number(check[0]?.count || 0); // safely convert to number

      if (count > 0) {
        throw new Error(
          `Duplicate Facilities found: "${refFacilitiesName}" already exists.`
        );
      }

      const userResult = await executeQuery(updateFacilitiesQuery, [
        refFacilitiesId,
        refFacilitiesName,
        CurrentTime(),
        tokendata.id,
      ]);

      const history = [
        13,
        tokendata.id,
        `${refFacilitiesName} Facilities Updated succesfully`,
        CurrentTime(),
        tokendata.id,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: " Facilities updated successfully",
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
          message: "An unknown error occurred during Facilities update",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async deleteFacilitiesV1(userData: any, tokendata: any): Promise<any> {
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };

    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN"); // Start transaction

      const { refFacilitiesId } = userData;
      const result = await client.query(deleteFacilitiesQuery, [
        refFacilitiesId,
        CurrentTime(),
        tokendata.id,
      ]);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "Facilities not found or already deleted",
            token: tokens,
          },
          true
        );
      }

      // const getdeleted: any = await client.query(getdeleteUserGuidelineQuery, [
      //   refUserGuidelinesId,
      // ]);

      // if (
      //   !getdeleted ||
      //   !Array.isArray(getdeleted.rows) ||
      //   getdeleted.rows.length === 0
      // ) {
      //   await client.query("ROLLBACK");
      //   return encrypt(
      //     {
      //       success: false,
      //       message: "User guideline not found for history log",
      //       token: tokens,
      //     },
      //     true
      //   );
      // }

      // const { refUserGuidelinesName } = getdeleted.rows[0];

      const history = [
        14, // Unique ID for delete action
        tokendata.id,
        `Facilities deleted succesfully`,
        CurrentTime(),
        tokendata.id,
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "Facilities deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting Facilities:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the Facilities",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listFacilitiesV1(userData: any, tokendata: any): Promise<any> {
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };

    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listFacilitiesQuery, [tokendata.id]);

      return encrypt(
        {
          success: true,
          message: "facilities listed successfully",
          token: tokens,
          result: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list facilities", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list facilities",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }

  public async addAdditionalTipsV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };

    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");

      const { refAdditionalTipsName } = userData;

      if (
        !Array.isArray(refAdditionalTipsName) ||
        refAdditionalTipsName.length === 0
      ) {
        return encrypt(
          {
            success: false,
            message: "No additional tips provided",
            token: tokens,
          },
          true
        );
      }

      const resultArray = [];

      for (const tips of refAdditionalTipsName) {
        const { refAdditionalTipsName } = tips;

        if (!refAdditionalTipsName) continue;

        const duplicateCheck: any = await client.query(
          checkAdditionalTipsduplicateQuery,
          [refAdditionalTipsName, tokendata.id]
        );

        const count = Number(duplicateCheck.rows[0]?.count || 0);
        if (count > 0) {
          throw new Error(
            `Duplicate additional tips found: "${refAdditionalTipsName}" already exists.`
          );
        }

        const result = await client.query(addAditionalTipsQuery, [
          refAdditionalTipsName,
          CurrentTime(),
          tokendata.id,
        ]);

        resultArray.push(result);
      }

      const history = [
        15,
        tokendata.id,
        `Added additional tips: ${refAdditionalTipsName
          .map((item: any) => item.refAdditionalTipsName)
          .join(", ")}`,
        CurrentTime(),
        tokendata.id,
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "additional tips added successfully",
          token: tokens,
          result: resultArray,
        },
        true
      );
    } catch (error: unknown) {
      console.log("error", error);
      await client.query("ROLLBACK");

      return encrypt(
        {
          success: false,
          message: "An unknown error occurred during additional tips addition",
          error: String(error),
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async updateAdditionalTipsV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const client: PoolClient = await getClient();
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };

    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");

      const { refAdditionalTipsId, refAdditionalTipsName } = userData;

      const check: any = await executeQuery(checkAdditionalTipsduplicateQuery, [
        refAdditionalTipsName,
        tokendata.id,
      ]);

      const count = Number(check[0]?.count || 0); // safely convert to number

      if (count > 0) {
        throw new Error(
          `Duplicate additional tips found: "${refAdditionalTipsName}" already exists.`
        );
      }

      const userResult = await executeQuery(updateAdditionalTipsQuery, [
        refAdditionalTipsId,
        refAdditionalTipsName,
        CurrentTime(),
        tokendata.id,
      ]);

      const history = [
        12,
        tokendata.id,
        `${refAdditionalTipsName} additional tips Updated succesfully`,
        CurrentTime(),
        tokendata.id,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: " additional tips updated successfully",
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
          message: "An unknown error occurred during additional tips update",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async deleteAdditionalTipsV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };

    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN"); // Start transaction

      const { refAdditionalTipsId } = userData;
      const result = await client.query(deleteAdditionalTipsQuery, [
        refAdditionalTipsId,
        CurrentTime(),
        tokendata.id,
      ]);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "Additional Tips not found or already deleted",
            token: tokens,
          },
          true
        );
      }

      // const getdeleted: any = await client.query(getdeleteUserGuidelineQuery, [
      //   refUserGuidelinesId,
      // ]);

      // if (
      //   !getdeleted ||
      //   !Array.isArray(getdeleted.rows) ||
      //   getdeleted.rows.length === 0
      // ) {
      //   await client.query("ROLLBACK");
      //   return encrypt(
      //     {
      //       success: false,
      //       message: "User guideline not found for history log",
      //       token: tokens,
      //     },
      //     true
      //   );
      // }

      // const { refUserGuidelinesName } = getdeleted.rows[0];

      const history = [
        17, // Unique ID for delete action
        tokendata.id,
        `Additional Tips deleted succesfully`,
        CurrentTime(),
        tokendata.id,
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "Additional Tips deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting Facilities:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the Additional Tips",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listAdditionalTipsV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    // const token = { id: tokendata.id };
    const token = { id: tokendata.id, roleId: tokendata.roleId };

    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listAdditionalTipsQuery, [
        tokendata.id,
      ]);

      return encrypt(
        {
          success: true,
          message: "additional tips listed successfully",
          token: tokens,
          result: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list additional tips", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list additional tips",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }

  public async uploadFoodImageV1(userData: any, tokendata: any): Promise<any> {
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
      filePath = await storeFile(image, 1);

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
  public async deleteFoodImageV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      let filePath: string | any;

      if (userData.refFoodAndSnacksId) {
        // Retrieve the image record from the database
        const imageRecord = await executeQuery(getFoodImageRecordQuery, [
          userData.refFoodAndSnacksId,
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

        filePath = imageRecord[0].refCoverImage;

        // Delete the image record from the database
        await executeQuery(deleteFoodImageRecordQuery, [
          userData.refFoodAndSnacksId,
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
          message: " cover image deleted successfully",
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
  public async addFoodAndSnacksV1(userData: any, tokendata: any): Promise<any> {
    console.log("userData", userData);
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");

      const {
        refFoodCategory,
        refFoodName,
        refPrice,
        refQuantity,
        refFoodImage,
      } = userData;
      console.log("userData", userData);

      // const food = [
      //   refFoodName
      // ]
      // const check: any = await client.query(checkFoodAndSnacksQuery,food);

      // console.log('check', check)
      // const count = Number(check[0]?.count || 0); // safely convert to number
      // console.log('count', count)

      // if (count > 0) {
      //   throw new Error(
      //     `Duplicate Food And Snacks found: "${refFoodName}" already exists.`
      //   );
      // }
      const params = [
        refFoodCategory,
        refFoodName,
        refPrice,
        refQuantity,
        refFoodImage,
        CurrentTime(),
        tokendata.id,
      ];
      console.log("params", params);
      const userResult = await client.query(addFoodAndSnacksQuery, params);
      console.log("userResult", userResult);

      const history = [
        18,
        tokendata.id,
        `${refFoodName} Food And Snacks added succesfully`,
        CurrentTime(),
        tokendata.id,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Food And Snacks added successfully",
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
  public async updateFoodAndSnacksV1(
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
        refFoodAndSnacksId,
        refFoodName,
        refPrice,
        refQuantity,
        refFoodImage,
        refFoodCategory,
      } = userData;
      console.log("userData", userData);

      // const food = [
      //   refFoodName
      // ]
      // const check: any = await client.query(checkFoodAndSnacksQuery,food);

      // console.log('check', check)
      // const count = Number(check[0]?.count || 0); // safely convert to number
      // console.log('count', count)

      // if (count > 0) {
      //   throw new Error(
      //     `Duplicate Food And Snacks found: "${refFoodName}" already exists.`
      //   );
      // }

      const params = [
        refFoodAndSnacksId,
        refFoodName,
        refPrice,
        refQuantity,
        refFoodImage,
        CurrentTime(),
        tokendata.id,
        refFoodCategory,
      ];
      console.log("params", params);
      const userResult = await client.query(updateFoodAndSnacksQuery, params);
      console.log("userResult", userResult);

      const history = [
        19,
        tokendata.id,
        `${refFoodName} Food And Snacks updated succesfully`,
        CurrentTime(),
        tokendata.id,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Food And Snacks updated successfully",
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
          message: "An unknown error occurred during Food And Snacks update",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async deleteFoodAndSnacksV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN"); // Start transaction

      const { refFoodAndSnacksId } = userData;
      const result = await client.query(deleteFoodAndSnacksQuery, [
        refFoodAndSnacksId,
        CurrentTime(),
        tokendata.id,
      ]);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "FoodAndSnacks not found or already deleted",
            token: tokens,
          },
          true
        );
      }

      // const getdeleted: any = await client.query(getdeleteUserGuidelineQuery, [
      //   refUserGuidelinesId,
      // ]);

      // if (
      //   !getdeleted ||
      //   !Array.isArray(getdeleted.rows) ||
      //   getdeleted.rows.length === 0
      // ) {
      //   await client.query("ROLLBACK");
      //   return encrypt(
      //     {
      //       success: false,
      //       message: "User guideline not found for history log",
      //       token: tokens,
      //     },
      //     true
      //   );
      // }

      // const { refUserGuidelinesName } = getdeleted.rows[0];

      const history = [
        20, // Unique ID for delete action
        tokendata.id,
        `Food And Snacks deleted succesfully`,
        CurrentTime(),
        tokendata.id,
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "Food And Snacks  deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting Food And Snacks :", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the Food And Snacks",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listFoodAndSnacksV1(
    userData: any,
    tokendata: any
  ): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listFoodAndSnacksQuery);

      for (const product of result) {
        if (product.refFoodImage) {
          try {
            const fileBuffer = await viewFile(product.refFoodImage);
            product.refFoodImage = {
              filename: path.basename(product.refFoodImage),
              content: fileBuffer.toString("base64"),
              contentType: "image/jpeg", // Change based on actual file type if necessary
            };
          } catch (err) {
            console.error(
              `Error reading image file for product ${product.refFoodImage}:`,
              err
            );
            product.refFoodImage = null; // Handle missing or unreadable files gracefully
            console.log("product.refFoodImage", product.refFoodImage);
          }
        }
      }

      return encrypt(
        {
          success: true,
          message: "FoodAndSnacks listed successfully",
          token: tokens,
          result: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list FoodAndSnacks", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list FoodAndSnacks",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }

  public async addFoodComboV1(userData: any, tokendata: any): Promise<any> {
    console.log("userData", userData);
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");

      const {
        breakfastTime,
        breakfastPrice,
        lunchTime,
        lunchPrice,
        dinnerTime,
        dinnerPrice,
        snacks1Time,
        snacks1Price,
        snacks2Time,
        snacks2Price,
      } = userData;

      const refGroundId = `{${userData.refGroundId.join(",")}}`;
      const breakfast = `{${userData.breakfast.join(",")}}`;
      const lunch = `{${userData.lunch.join(",")}}`;
      const dinner = `{${userData.dinner.join(",")}}`;
      const snacks1 = `{${userData.snacks1.join(",")}}`;
      const snacks2 = `{${userData.snacks2.join(",")}}`;

      const params = [
        refGroundId,
        breakfast,
        breakfastTime,
        breakfastPrice,
        lunch,
        lunchTime,
        lunchPrice,
        dinner,
        dinnerTime,
        dinnerPrice,
        snacks1,
        snacks1Time,
        snacks1Price,
        snacks2,
        snacks2Time,
        snacks2Price,
        CurrentTime(),
        tokendata.id,
      ];
      console.log("params", params);
      const userResult = await client.query(addFoodAndSnacksComboQuery, params);
      console.log("userResult", userResult);

      const history = [
        20,
        tokendata.id,
        `Food combo added succesfully`,
        CurrentTime(),
        tokendata.id,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Food And Snacks added successfully",
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
  public async updateFoodComboV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    try {
      await client.query("BEGIN");

      const {
        refComboId,
        breakfastTime,
        breakfastPrice,
        lunchTime,
        lunchPrice,
        dinnerTime,
        dinnerPrice,
        snacks1Time,
        snacks1Price,
        snacks2Time,
        snacks2Price,
      } = userData;

      const refGroundId = `{${userData.refGroundId.join(",")}}`;
      const breakfast = `{${userData.breakfast.join(",")}}`;
      const lunch = `{${userData.lunch.join(",")}}`;
      const dinner = `{${userData.dinner.join(",")}}`;
      const snacks1 = `{${userData.snacks1.join(",")}}`;
      const snacks2 = `{${userData.snacks2.join(",")}}`;

      const params = [
        refGroundId,
        breakfast,
        breakfastTime,
        breakfastPrice,
        lunch,
        lunchTime,
        lunchPrice,
        dinner,
        dinnerTime,
        dinnerPrice,
        snacks1,
        snacks1Time,
        snacks1Price,
        snacks2,
        snacks2Time,
        snacks2Price,
        CurrentTime(),
        tokendata.id,
        refComboId,
      ];
      console.log("params", params);
      const userResult = await client.query(
        uploadFoodAndSnacksComboQuery,
        params
      );
      console.log("userResult", userResult);

      const history = [
        22,
        tokendata.id,
        `Food combo added succesfully`,
        CurrentTime(),
        tokendata.id,
      ];

      const updateHistory = await client.query(updateHistoryQuery, history);
      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Food And Snacks added successfully",
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
  public async deleteFoodComboV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN"); // Start transaction

      const { refComboId } = userData;
      const result = await client.query(deleteFoodComboQuery, [
        refComboId,
        CurrentTime(),
        tokendata.id,
      ]);

      if (result.rowCount === 0) {
        await client.query("ROLLBACK");
        return encrypt(
          {
            success: false,
            message: "FoodCombo not found or already deleted",
            token: tokens,
          },
          true
        );
      }

      // const getdeleted: any = await client.query(getdeleteUserGuidelineQuery, [
      //   refUserGuidelinesId,
      // ]);

      // if (
      //   !getdeleted ||
      //   !Array.isArray(getdeleted.rows) ||
      //   getdeleted.rows.length === 0
      // ) {
      //   await client.query("ROLLBACK");
      //   return encrypt(
      //     {
      //       success: false,
      //       message: "User guideline not found for history log",
      //       token: tokens,
      //     },
      //     true
      //   );
      // }

      // const { refUserGuidelinesName } = getdeleted.rows[0];

      const history = [
        23, // Unique ID for delete action
        tokendata.id,
        `Food Combo deleted succesfully`,
        CurrentTime(),
        tokendata.id,
      ];

      await client.query(updateHistoryQuery, history);
      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "Food Combo deleted successfully",
          token: tokens,
          deletedData: result.rows[0], // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      await client.query("ROLLBACK"); // Rollback on error
      console.error("Error deleting Facilities:", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while deleting the Additional Tips",
          token: tokens,
          error: String(error),
        },
        true
      );
    } finally {
      client.release();
    }
  }
  public async listFoodComboV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listFoodComboQuery);

      return encrypt(
        {
          success: true,
          message: "FoodAndSnacks combo listed successfully",
          token: tokens,
          result: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list FoodAndSnacks combo", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list FoodAndSnacks combo",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
  public async listFoodCategoryV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      const result = await executeQuery(listFoodCategoryQuery);

      return encrypt(
        {
          success: true,
          message: "FoodAndSnacks category listed successfully",
          token: tokens,
          result: result, // Return deleted record for reference
        },
        true
      );
    } catch (error: unknown) {
      console.error("Error list FoodAndSnacks category", error);

      return encrypt(
        {
          success: false,
          message: "An error occurred while list FoodAndSnacks category",
          token: tokens,
          error: String(error),
        },
        true
      );
    }
  }
}
