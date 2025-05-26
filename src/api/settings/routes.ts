import * as Hapi from "@hapi/hapi";

// import { Logger } from "winston";
import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";
import validate from "./validate";
import { settingsController } from "./controller";

export class settingsRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new settingsController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/settingRoutes/addSportCategory",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addSportCategory,
            validate: validate.addSportCategory,
            description: "add Sport Category",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/updateSportCategory",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateSportCategory,
            validate: validate.updateSportCategory,
            description: "update Sport Category",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/deleteSportCategory",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteSportCategory,
            validate: validate.deleteSportCategory,
            description: "delete Sport Category",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/settingRoutes/listSportCategory",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listSportCategory,
            description: "list Sport Category",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/addFeatures",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addFeatures,
            validate: validate.addFeatures,
            description: "addFeatures",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/updateFeatures",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateFeatures,
            validate: validate.updateFeatures,
            description: "updateFeatures",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/deleteFeatures",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteFeatures,
            validate: validate.deleteFeatures,
            description: "deleteFeatures",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/settingRoutes/listFeatures",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listFeatures,
            description: "list Features",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/addUserGuidelines",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addUserGuidelines,
            validate: validate.addUserGuidelines,
            description: "addUserGuidelines",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/updateUserGuidelines",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateUserGuidelines,
            validate: validate.updateUserGuidelines,
            description: "updateUserGuidelines",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/deleteUserGuidelines",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteUserGuidelines,
            validate: validate.deleteUserGuidelines,
            description: "deleteUserGuidelines",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/settingRoutes/listUserGuidelines",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listUserGuidelines,
            description: "listUserGuidelines",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/addFacilities",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addFacilities,
            validate: validate.addFacilities,
            description: "addFacilities",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/updateFacilities",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateFacilities,
            validate: validate.updateFacilities,
            description: "updateFacilities",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/deleteFacilities",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteFacilities,
            validate: validate.deleteFacilities,
            description: "deleteFacilities",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/settingRoutes/listFacilities",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listFacilities,
            description: "listFacilities",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/addAdditionalTips",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addAdditionalTips,
            validate: validate.addAdditionalTips,
            description: "addAdditionalTips",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/updateAdditionalTips",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateAdditionalTips,
            validate: validate.updateAdditionalTips,
            description: "updateAdditionalTips",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/deleteAdditionalTips",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteAdditionalTips,
            validate: validate.deleteAdditionalTips,
            description: "deleteAdditionalTips",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/settingRoutes/listAdditionalTips",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listAdditionalTips,
            description: "listAdditionalTips",
            tags: ["api", "Users"],
            auth: false,
          },
        },

        // ------------------------------------------------------
        {
          method: "POST",
          path: "/api/v1/settingRoutes/uploadFoodImage",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.uploadFoodImage,
            description: "uploadFoodImage",
            tags: ["api", "Users"],
            auth: false,
            payload: {
              maxBytes: 10485760,
              output: "stream",
              parse: true,
              multipart: true,
            },
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/deleteFoodImage",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteFoodImage,
            // validate: validate.addFoodAndSnacks,
            description: "deleteFoodImage",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/addFoodAndSnacks",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addFoodAndSnacks,
            validate: validate.addFoodAndSnacks,
            description: "addFoodAndSnacks",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/updateFoodAndSnacks",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateFoodAndSnacks,
            validate: validate.updateFoodAndSnacks,
            description: "update FoodAndSnacks",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/deleteFoodAndSnacks",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteFoodAndSnacks,
            validate: validate.deleteFoodAndSnacks,
            description: "delete FoodAndSnacks",
            tags: ["api", "Users"],
            auth: false,
          },
        },

        {
          method: "GET",
          path: "/api/v1/settingRoutes/listFoodAndSnacks",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listFoodAndSnacks,
            description: "list FoodAndSnacks",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/addFoodCombo",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addFoodCombo,
            validate: validate.addFoodCombo,
            description: "addFoodCombo",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/updateFoodCombo",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateFoodCombo,
            validate: validate.updateFoodCombo,
            description: "updateFoodCombo",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/settingRoutes/deleteFoodCombo",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteFoodCombo,
            validate: validate.deleteFoodCombo,
            description: "deleteFoodCombo",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/settingRoutes/listFoodCombo",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listFoodCombo,
            description: "listFoodCombo",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/settingRoutes/listFoodCategory",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listFoodCategory,
            description: "listFoodCategory",
            tags: ["api", "Users"],
            auth: false,
          },
        },
     
      
      ]);
      resolve(true);
    });
  }
}
