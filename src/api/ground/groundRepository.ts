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
  getAvailableAddonsQuery,
  listaddonsQuery,
  imgResultQuery,
} from "./query";
import { CurrentTime } from "../../helper/common";

export class groundRepository {
  // public async addGroundV1(userData: any, tokendata: any): Promise<any> {
  //   console.log("userData", userData);
  //   const client: PoolClient = await getClient();
  //   const token = { id: tokendata.id };
  //   const tokens = generateTokenWithExpire(token, true);
  //   try {
  //     await client.query("BEGIN");

  //     const {
  //       refGroundName,
  //       isAddOnAvailable,
  //       // refAddon,
  //       // refAddonStatus,
  //       IframeLink,
  //       refGroundPrice,
  //       refGroundImage,
  //       refGroundLocation,
  //       refGroundPincode,
  //       refGroundState,
  //       refDescription,
  //       refStatus,
  //     } = userData;

  //     // const refAddon = isAddOnAvailable ? userData.refAddon : null;
  //     // const refAddonStatus = isAddOnAvailable ? userData.refAddonStatus : null;

  //     const refAddOnsId = `{${userData.refAddOnsId.join(",")}}`;
  //     const refFeaturesId = `{${userData.refFeaturesId.join(",")}}`;
  //     const refUserGuidelinesId = `{${userData.refUserGuidelinesId.join(",")}}`;
  //     const refFacilitiesId = `{${userData.refFacilitiesId.join(",")}}`;
  //     const refAdditionalTipsId = `{${userData.refAdditionalTipsId.join(",")}}`;
  //     const refSportsCategoryId = `{${userData.refSportsCategoryId.join(",")}}`;

  //     const customerPrefix = "CGA-GRD-";
  //     const baseNumber = 0;

  //     const lastCustomerResult = await client.query(getLastGroundIdQuery);
  //     let newCustomerId: string;

  //     if (lastCustomerResult.rows.length > 0) {
  //       const lastNumber = parseInt(lastCustomerResult.rows[0].count, 10);
  //       newCustomerId = `${customerPrefix}${(baseNumber + lastNumber + 1)
  //         .toString()
  //         .padStart(4, "0")}`;
  //     } else {
  //       newCustomerId = `${customerPrefix}${(baseNumber + 1)
  //         .toString()
  //         .padStart(4, "0")}`;
  //     }

  //     const params = [
  //       refGroundName,
  //       newCustomerId,
  //       isAddOnAvailable,
  //       refAddOnsId,
  //       refFeaturesId,
  //       refUserGuidelinesId,
  //       refAdditionalTipsId,
  //       refSportsCategoryId,
  //       refFacilitiesId,
  //       refGroundPrice,
  //       refGroundImage,
  //       refGroundLocation,
  //       refGroundPincode,
  //       refGroundState,
  //       refDescription,
  //       refStatus,
  //       IframeLink,
  //       CurrentTime(),
  //       tokendata.id,
  //     ];
  //     console.log("params", params);
  //     const Result = await client.query(addGroundQuery, params);
  //     //   console.log("userResult", userResult);
  //     const getgroundId = Result.rows[0];

  //     // const result = await client.query(addAddOnsQuery, [
  //     //   refAddon,
  //     //   getgroundId.refGroundId,
  //     //   refAddonStatus,
  //     // ]);

  //     const history = [
  //       24,
  //       tokendata.id,
  //       `${refGroundName} Ground Added successfully`,
  //       CurrentTime(),
  //       tokendata.id,
  //     ];

  //     const updateHistory = await client.query(updateHistoryQuery, history);
  //     await client.query("COMMIT");

  //     return encrypt(
  //       {
  //         success: true,
  //         message: "Ground added successfully",
  //         Result: Result,
  //         token: tokens,
  //       },
  //       true
  //     );
  //   } catch (error: unknown) {
  //     console.log("error", error);
  //     await client.query("ROLLBACK");

  //     return encrypt(
  //       {
  //         success: false,
  //         message: "An unknown error occurred during Ground addition",
  //         token: tokens,
  //         error: String(error),
  //       },
  //       true
  //     );
  //   } finally {
  //     client.release();
  //   }
  // }

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
        refAddOns,
        refFeaturesId,
        refUserGuidelinesId,
        refFacilitiesId,
        refAdditionalTipsId,
        refSportsCategoryId,
        refGroundPrice,
        refGroundImage,
        refGroundLocation,
        refGroundPincode,
        refGroundState,
        refDescription,
        refStatus,
        IframeLink,
      } = userData;

      // Prepare array strings for Postgres arrays
      const refFeatures = `{${refFeaturesId.join(",")}}`;
      const refUserGuidelines = `{${refUserGuidelinesId.join(",")}}`;
      const refFacilities = `{${refFacilitiesId.join(",")}}`;
      const refTips = `{${refAdditionalTipsId.join(",")}}`;
      const refSports = `{${refSportsCategoryId.join(",")}}`;

      // Get last ground count for new ID generation
      const lastGroundResult = await client.query(getLastGroundIdQuery);
      const lastNumber =
        lastGroundResult.rows.length > 0
          ? parseInt(lastGroundResult.rows[0].count, 10)
          : 0;
      const newCustomerId = `CGA-GRD-${(lastNumber + 1)
        .toString()
        .padStart(4, "0")}`;

      // Insert ground data
      const groundInsertParams = [
        refGroundName,
        newCustomerId,
        isAddOnAvailable,
        refFeatures,
        refUserGuidelines,
        refTips,
        refSports,
        refFacilities,
        refGroundPrice,
        refGroundImage,
        refGroundLocation,
        refGroundPincode,
        refGroundState,
        refDescription,
        refStatus,
        IframeLink,
        CurrentTime(),
        tokendata.id,
      ];

      const groundResult = await client.query(
        addGroundQuery,
        groundInsertParams
      );
      const groundId = groundResult.rows[0].refGroundId;
      console.log("groundId", groundId);

      // Maps to hold inserted IDs by name for referencing in sub records
      const refAddOnsIdMap = new Map<string, number>();
      const refSubAddOnsIdMap = new Map<string, number>();

      // Insert AddOns with their nested SubAddOns and Items
      if (isAddOnAvailable && refAddOns?.length) {
        for (const addon of refAddOns) {
          // Insert AddOn
          const addonRes = await client.query(
            `
          INSERT INTO "refAddOns" (
            "refAddOn",
            "refAddonPrice",
            "refGroundId",
            "createdAt",
            "createdBy",
            "refStatus"
          )
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING "refAddOnsId";
          `,
            [
              addon.name,
              addon.price,
              groundId,
              CurrentTime(),
              tokendata.id,
              true,
            ]
          );
          const addOnId = addonRes.rows[0].refAddOnsId;
          refAddOnsIdMap.set(addon.name, addOnId);

          // Insert SubAddOns if available
          if (addon.isSubaddonsAvailable && addon.refSubAddOns?.length) {
            for (const subAddon of addon.refSubAddOns) {
              const subRes = await client.query(
                `
              INSERT INTO "subAddOns" (
                "refAddOnsId",
                "refSubAddOnName",
                "refSubAddOnPrice",
                "refGroundId",
                "createdAt",
                "createdBy",
                "refStatus"
              )
              VALUES ($1, $2, $3, $4, $5, $6, $7)
              RETURNING "subAddOnsId";
              `,
                [
                  addOnId,
                  subAddon.name,
                  subAddon.price,
                  groundId,
                  CurrentTime(),
                  tokendata.id,
                  true,
                ]
              );
              const subAddOnId = subRes.rows[0].subAddOnsId;
              refSubAddOnsIdMap.set(subAddon.name, subAddOnId);

              // Insert Items if available
              if (subAddon.isItemsAvailable && subAddon.refItems?.length) {
                for (const item of subAddon.refItems) {
                  await client.query(
                    `
                  INSERT INTO "refItems" (
                    "subAddOnsId",
                    "refItemsName",
                    "refItemsPrice",
                    "refGroundId",
                    "createdAt",
                    "createdBy",
                    "refStatus"
                  )
                  VALUES ($1, $2, $3, $4, $5, $6, $7)
                  `,
                    [
                      subAddOnId,
                      item.name,
                      item.price,
                      groundId,
                      CurrentTime(),
                      tokendata.id,
                      true,
                    ]
                  );
                }
              }
            }
          }
        }
      }

      // Add to history
      const history = [
        24,
        tokendata.id,
        `${refGroundName} Ground Added successfully`,
        CurrentTime(),
        tokendata.id,
      ];
      await client.query(updateHistoryQuery, history);

      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Ground added successfully",
          groundId,
          token: tokens,
        },
        true
      );
    } catch (error) {
      console.log("error", error);
      await client.query("ROLLBACK");
      return encrypt(
        {
          success: false,
          message: "An error occurred while adding ground",
          error: String(error),
          token: tokens,
        },
        true
      );
    } finally {
      client.release();
    }
  }

  // public async updateGroundV1(userData: any, tokendata: any): Promise<any> {
  //   console.log("userData", userData);
  //   const client: PoolClient = await getClient();
  //   const token = { id: tokendata.id };
  //   const tokens = generateTokenWithExpire(token, true);
  //   try {
  //     await client.query("BEGIN");
  //     const {
  //       refGroundId,
  //       refGroundName,
  //       isAddOnAvailable,
  //       // refAddOnsId,
  //       // refAddon,
  //       // refAddonStatus,
  //       IframeLink,
  //       refGroundPrice,
  //       refGroundImage,
  //       refGroundLocation,
  //       refGroundPincode,
  //       refGroundState,
  //       refDescription,
  //       refStatus,
  //     } = userData;
  //     console.log("userData", userData);

  //     // const refAddon = isAddOnAvailable ? userData.refAddon : null;

  //     //       let refAddon = null;
  //     // if (isAddOnAvailable === true) {
  //     //   refAddon = userData.refAddon;
  //     // }

  //     // const refAddonStatus = isAddOnAvailable ? userData.refAddonStatus : null;

  //     const refAddOnsId = `{${userData.refAddOnsId.join(",")}}`;
  //     const refFeaturesId = `{${userData.refFeaturesId.join(",")}}`;
  //     const refUserGuidelinesId = `{${userData.refUserGuidelinesId.join(",")}}`;
  //     const refFacilitiesId = `{${userData.refFacilitiesId.join(",")}}`;
  //     const refAdditionalTipsId = `{${userData.refAdditionalTipsId.join(",")}}`;
  //     const refSportsCategoryId = `{${userData.refSportsCategoryId.join(",")}}`;

  //     const params = [
  //       refGroundId,
  //       refGroundName,
  //       isAddOnAvailable,
  //       refAddOnsId,
  //       refFeaturesId,
  //       refUserGuidelinesId,
  //       refAdditionalTipsId,
  //       refSportsCategoryId,
  //       refFacilitiesId,
  //       refGroundPrice,
  //       refGroundImage,
  //       refGroundLocation,
  //       refGroundPincode,
  //       refGroundState,
  //       refDescription,
  //       refStatus,
  //       IframeLink,
  //       CurrentTime(),
  //       tokendata.id,
  //     ];
  //     console.log("params", params);
  //     const Result = await client.query(updateGroundQuery, params);
  //     console.log("Result", Result);

  //     // const result2 = await client.query(updateAddOnsQuery, [
  //     //   refAddOnsId,
  //     //   refAddon,
  //     //   refGroundId,
  //     //   refAddonStatus,
  //     //   CurrentTime(),
  //     //   tokendata.id,
  //     // ]);
  //     // console.log("result2", result2);

  //     const history = [
  //       25,
  //       tokendata.id,
  //       `${refGroundName} Ground updated successfully`,
  //       CurrentTime(),
  //       tokendata.id,
  //     ];

  //     const updateHistory = await client.query(updateHistoryQuery, history);
  //     await client.query("COMMIT");

  //     return encrypt(
  //       {
  //         success: true,
  //         message: "Ground updated successfully",
  //         Result: Result,
  //         token: tokens,
  //         // addon: result2,
  //       },
  //       true
  //     );
  //   } catch (error: unknown) {
  //     console.log("error", error);
  //     await client.query("ROLLBACK");

  //     return encrypt(
  //       {
  //         success: false,
  //         message: "An unknown error occurred during Ground update",
  //         token: tokens,
  //         error: String(error),
  //       },
  //       true
  //     );
  //   } finally {
  //     client.release();
  //   }
  // }
  public async updateGroundV1(userData: any, tokendata: any): Promise<any> {
    const client: PoolClient = await getClient();
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);

    try {
      await client.query("BEGIN");

      const {
        refGroundId,
        refGroundName,
        isAddOnAvailable,
        refAddOns,
        refFeaturesId,
        refUserGuidelinesId,
        refFacilitiesId,
        refAdditionalTipsId,
        refSportsCategoryId,
        refGroundPrice,
        refGroundImage,
        refGroundLocation,
        refGroundPincode,
        refGroundState,
        refDescription,
        refStatus,
        IframeLink,
      } = userData;

      // Prepare array strings for Postgres arrays
      const refFeatures = `{${refFeaturesId.join(",")}}`;
      const refUserGuidelines = `{${refUserGuidelinesId.join(",")}}`;
      const refFacilities = `{${refFacilitiesId.join(",")}}`;
      const refTips = `{${refAdditionalTipsId.join(",")}}`;
      const refSports = `{${refSportsCategoryId.join(",")}}`;

      // Update ground main record
      await client.query(
        `
      UPDATE "refGround"
      SET 
        "refGroundName" = $1,
        "isAddOnAvailable" = $2,
        "refFeaturesId" = $3,
        "refUserGuidelinesId" = $4,
        "refAdditionalTipsId" = $5,
        "refSportsCategoryId" = $6,
        "refFacilitiesId" = $7,
        "refGroundPrice" = $8,
        "refGroundImage" = $9,
        "refGroundLocation" = $10,
        "refGroundPincode" = $11,
        "refGroundState" = $12,
        "refDescription" = $13,
        "refStatus" = $14,
        "IframeLink" = $15,
        "updatedAt" = $16,
        "updatedBy" = $17
      WHERE "refGroundId" = $18
    `,
        [
          refGroundName,
          isAddOnAvailable,
          refFeatures,
          refUserGuidelines,
          refTips,
          refSports,
          refFacilities,
          refGroundPrice,
          refGroundImage,
          refGroundLocation,
          refGroundPincode,
          refGroundState,
          refDescription,
          refStatus,
          IframeLink,
          CurrentTime(),
          tokendata.id,
          refGroundId,
        ]
      );

      // Maps to keep track of updated or inserted IDs
      const refAddOnsIdMap = new Map<string, number>();
      const refSubAddOnsIdMap = new Map<string, number>();

      // Process AddOns
      if (isAddOnAvailable && refAddOns?.length) {
        for (const addon of refAddOns) {
          if (addon.refAddOnsId) {
            // Update existing AddOn
            await client.query(
              `
            UPDATE "refAddOns"
            SET
              "refAddOn" = $1,
              "refAddonPrice" = $2,
              "updatedAt" = $3,
              "updatedBy" = $4,
              "refStatus" = true
            WHERE "refAddOnsId" = $5
          `,
              [
                addon.name,
                addon.price,
                CurrentTime(),
                tokendata.id,
                addon.refAddOnsId,
              ]
            );
            refAddOnsIdMap.set(addon.name, addon.refAddOnsId);
          } else {
            // Insert new AddOn
            const res = await client.query(
              `
            INSERT INTO "refAddOns" (
              "refAddOn", "refAddonPrice", "refGroundId", "createdAt", "createdBy", "refStatus"
            )
            VALUES ($1, $2, $3, $4, $5, true)
            RETURNING "refAddOnsId"
          `,
              [
                addon.name,
                addon.price,
                refGroundId,
                CurrentTime(),
                tokendata.id,
              ]
            );
            const newId = res.rows[0].refAddOnsId;
            refAddOnsIdMap.set(addon.name, newId);
          }

          // Process SubAddOns for this AddOn
          if (addon.isSubaddonsAvailable && addon.refSubAddOns?.length) {
            for (const sub of addon.refSubAddOns) {
              const parentAddOnId =
                addon.refAddOnsId || refAddOnsIdMap.get(addon.name);
              if (!parentAddOnId) {
                throw new Error(
                  `Parent AddOn ID not found for SubAddOn: ${sub.name}`
                );
              }

              if (sub.refSubAddOnsId) {
                // Update existing SubAddOn
                await client.query(
                  `
                UPDATE "subAddOns"
                SET
                  "refAddOnsId" = $1,
                  "refSubAddOnName" = $2,
                  "refSubAddOnPrice" = $3,
                  "updatedAt" = $4,
                  "updatedBy" = $5,
                  "refStatus" = true
                WHERE "subAddOnsId" = $6
              `,
                  [
                    parentAddOnId,
                    sub.name,
                    sub.price,
                    CurrentTime(),
                    tokendata.id,
                    sub.refSubAddOnsId,
                  ]
                );
                refSubAddOnsIdMap.set(sub.name, sub.refSubAddOnsId);
              } else {
                // Insert new SubAddOn
                const res = await client.query(
                  `
                INSERT INTO "subAddOns" (
                  "refAddOnsId", "refSubAddOnName", "refSubAddOnPrice",
                  "refGroundId", "createdAt", "createdBy", "refStatus"
                )
                VALUES ($1, $2, $3, $4, $5, $6, true)
                RETURNING "subAddOnsId"
              `,
                  [
                    parentAddOnId,
                    sub.name,
                    sub.price,
                    refGroundId,
                    CurrentTime(),
                    tokendata.id,
                  ]
                );
                const newSubId = res.rows[0].subAddOnsId;
                refSubAddOnsIdMap.set(sub.name, newSubId);
              }

              // Process Items for this SubAddOn
              if (sub.isItemsAvailable && sub.refItems?.length) {
                for (const item of sub.refItems) {
                  const parentSubAddOnId =
                    sub.refSubAddOnsId || refSubAddOnsIdMap.get(sub.name);
                  if (!parentSubAddOnId) {
                    throw new Error(
                      `Parent SubAddOn ID not found for Item: ${item.name}`
                    );
                  }

                  if (item.refItemsId) {
                    // Update existing Item
                    await client.query(
                      `
                    UPDATE "refItems"
                    SET
                      "subAddOnsId" = $1,
                      "refItemsName" = $2,
                      "refItemsPrice" = $3,
                      "updatedAt" = $4,
                      "updatedBy" = $5,
                      "refStatus" = true
                    WHERE "refItemsId" = $6
                  `,
                      [
                        parentSubAddOnId,
                        item.name,
                        item.price,
                        CurrentTime(),
                        tokendata.id,
                        item.refItemsId,
                      ]
                    );
                  } else {
                    // Insert new Item
                    await client.query(
                      `
                    INSERT INTO "refItems" (
                      "subAddOnsId", "refItemsName", "refItemsPrice",
                      "refGroundId", "createdAt", "createdBy", "refStatus"
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, true)
                  `,
                      [
                        parentSubAddOnId,
                        item.name,
                        item.price,
                        refGroundId,
                        CurrentTime(),
                        tokendata.id,
                      ]
                    );
                  }
                }
              }
            }
          }
        }
      }

      // Optional: You may want to handle deletion of removed AddOns/SubAddOns/Items here
      // (e.g., mark as inactive or delete based on business rules)

      // Add to history
      const history = [
        24,
        tokendata.id,
        `${refGroundName} Ground updated successfully`,
        CurrentTime(),
        tokendata.id,
      ];
      await client.query(updateHistoryQuery, history);

      await client.query("COMMIT");

      return encrypt(
        {
          success: true,
          message: "Ground updated successfully",
          groundId: refGroundId,
          token: tokens,
        },
        true
      );
    } catch (error) {
      await client.query("ROLLBACK");
      return encrypt(
        {
          success: false,
          message: "An error occurred while updating ground",
          error: String(error),
          token: tokens,
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
      const result = await executeQuery(listGroundQuery, [tokendata.id]);
      const addons = await executeQuery(listaddonsQuery,[tokendata.id]);

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
          message: "ground listed successfully",
          token: tokens,
          result: result, // Return deleted record for reference
          addons: addons,
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
      const result: any = await client.query(getGroundQuery, [refGroundId]);

      const getAddons = await executeQuery(getAvailableAddonsQuery, [
        refGroundId,
      ]);

      const addons = await executeQuery(listaddonsQuery);

      const imgResult = await executeQuery(imgResultQuery, [refGroundId]);
      console.log("imgResult", imgResult);

      //  for (const image of imgResult) {
      //   if (image.refGroundImage) {
      //     try {
      //       const fileBuffer = await viewFile(image.refGroundImage);
      //       image.refGroundImage = {
      //         filename: path.basename(image.refGroundImage),
      //         content: fileBuffer.toString("base64"),
      //         contentType: "image/jpeg", // Change based on actuwal file type if necessary
      //       };
      //     } catch (error) {
      //       console.error("Error reading image file for product ,err");
      //       image.refGroundImage = null; // Handle missing or unreadable files gracefully
      //     }
      //   }
      // }
      for (const product of imgResult) {
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

      await client.query("COMMIT"); // Commit transaction

      return encrypt(
        {
          success: true,
          message: "ground get successfully",
          token: tokens,
          result: result.rows[0],
          getAddons: getAddons, // Return deleted record for reference
          listOfAddones: addons,
          imgResult: imgResult,
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

      const { addOns, refGroundId, refStatus, refPrice } = userData;
      const result = await client.query(addAddOnsQuery, [
        addOns,
        refPrice,
        refGroundId,
        refStatus,
        CurrentTime(),
        tokendata.id,
      ]);

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
    } finally {
      client.release();
    }
  }
  public async updateAddonsV1(userData: any, tokendata: any): Promise<any> {
    const token = { id: tokendata.id };
    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN"); // Start transaction

      const { refAddOnsId, addOns, refGroundId, refStatus } = userData;
      const result = await client.query(updateAddOnsQuery, [
        refAddOnsId,
        addOns,
        refGroundId,
        refStatus,
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
    } finally {
      client.release();
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
    console.log("tokendata.id", tokendata.id);
    const tokens = generateTokenWithExpire(token, true);
    const client: PoolClient = await getClient();

    try {
      await client.query("BEGIN"); // Start transaction

      const { unAvailabilityDate, refAddOnsId, refGroundId } = userData;
      const result = await client.query(addAddOnsAvailabilityQuery, [
        unAvailabilityDate,
        refAddOnsId,
        refGroundId,
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
    } finally {
      client.release();
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

      const {
        addOnsAvailabilityId,
        unAvailabilityDate,
        refAddOnsId,
        refGroundId,
      } = userData;

      const result = await client.query(updateAddOnsAvailabilityQuery, [
        addOnsAvailabilityId,
        unAvailabilityDate,
        refAddOnsId,
        refGroundId,
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
    } finally {
      client.release();
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
      // const result = await executeQuery(listAddonesAvailabilityQuery);
      const result = await executeQuery(listAddonesAvailabilityQuery); // returns array of rows

      console.log("result", result);

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
