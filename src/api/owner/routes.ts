import * as Hapi from "@hapi/hapi";

// import { Logger } from "winston";
import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";
import validate from "./validate";
import { ownerController } from "./controller";

export class ownerRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new ownerController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/ownerRoutes/addOwners",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addOwners,
            // validate: validate.addOwners,
            description: "add Owners",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/ownerRoutes/uploadGroundImage",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
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
          path: "/api/v1/ownerRoutes/uploadownerDocuments1",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.uploadownerDocuments1,
            description: "uploadownerDocuments1",
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
          path: "/api/v1/ownerRoutes/uploadownerDocuments2",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.uploadownerDocuments2,
            description: "uploadownerDocuments2",
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
          path: "/api/v1/ownerRoutes/deleteimages",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteimages,
            description: "deleteimages",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/ownerRoutes/listOwners",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listOwners,
            description: "lsit Owners",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/ownerRoutes/updateOwners",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateOwners,
            validate: validate.updateOwners,
            description: "updateOwners",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/ownerRoutes/getOwners",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.getOwners,
            validate: validate.getOwners,
            description: "getOwners",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/ownerRoutes/getOwnerDocuments",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.getOwnerDocuments,
            validate: validate.getOwners,
            description: "getOwners",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/ownerRoutes/deleteOwners",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteOwners,
            validate: validate.deleteOwners,
            description: "deleteOwners",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/ownerRoutes/ownerStatus",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.ownerStatus,
            // validate: validate.approveOwners,
            description: "ownerStatus",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/ownerRoutes/ownerHistoryWithStatus",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.ownerHistoryWithStatus,
            description: "ownerHistoryWithStatus",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/ownerRoutes/listSportsCategory",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listSportsCategory,
            description: "listSportsCategory",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}
