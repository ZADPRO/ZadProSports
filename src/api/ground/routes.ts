import * as Hapi from "@hapi/hapi";

// import { Logger } from "winston";
import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";
import validate from "./validate";
import { groundController } from "./controller";

export class groundRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new groundController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/groundRoutes/addGround",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addGround,
            // validate: validate.addGround,
            description: "addGround",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/groundRoutes/updateGround",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateGround,
            // validate: validate.updateGround,
            description: "updateGround",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/groundRoutes/uploadRoomImage",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.uploadRoomImage,
            description: "uploadRoomImage",
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
          path: "/api/v1/groundRoutes/deleteRoomImage",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteRoomImage,
            // validate: validate.deleteRoomImage,
            description: "deleteRoomImage",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/groundRoutes/uploadGroundImage",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.uploadGroundImage,
            description: "uploadGroundImage",
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
          path: "/api/v1/groundRoutes/deleteGroundImage",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteGroundImage,
            // validate: validate.deleteGroundImage,
            description: "deleteGroundImage",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/groundRoutes/listGround",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listGround,
            description: "listGround",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/groundRoutes/deleteGround",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteGround,
            validate: validate.deleteGround,
            description: "deleteGround",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/groundRoutes/getGround",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.getGround,
            validate: validate.getGround,
            description: "getGround",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/groundRoutes/addAddons",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addAddons,
            validate: validate.addAddons,
            description: "addAddons",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/groundRoutes/updateAddons",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateAddons,
            validate: validate.updateAddons,
            description: "updateAddons",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/groundRoutes/deleteAddons",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteAddons,
            validate: validate.deleteAddons,
            description: "deleteAddons",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/groundRoutes/listAddOns",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listAddOns,
            // validate: validate.deleteAddons,
            description: "listAddOns",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/groundRoutes/addAddonAvailability",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addAddonAvailability,
            validate: validate.addAddonAvailability,
            description: "addAddonAvailability",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/groundRoutes/updateAddonAvailability",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateAddonAvailability,
            validate: validate.updateAddonAvailability,
            description: "updateAddonAvailability",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/groundRoutes/deleteAddonAvailability",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteAddonAvailability,
            validate: validate.deleteAddonAvailability,
            description: "deleteAddonAvailability",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/groundRoutes/listAddonAvailability",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listAddonAvailability,
            // validate: validate.deleteAddonAvailability,
            description: "listAddonAvailability",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}
