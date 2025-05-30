import * as Hapi from "@hapi/hapi";

// import { Logger } from "winston";
import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";
import { userController } from "./controller";
import validate from "./validate";

export class userRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new userController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/adminRoutes/login",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.login,
            validate: validate.login,
            description: "user Login",
            // tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/userRoutes/userGroundBooking",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.userGroundBooking,
            // validate: validate.userGroundBooking,
            description: "user SignUp",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/userRoutes/listFilteredGrounds",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listFilteredGrounds,
            validate: validate.listFilteredGrounds,
            description: "listFilteredGrounds",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/userRoutes/listGrounds",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listGrounds,
            description: "listGrounds",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/userRoutes/listFreeGrounds",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listFreeGrounds,
            // validate: validate.listFreeGrounds,
            description: "listFreeGrounds",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/userRoutes/listProfileData",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listProfileData,
            // validate: validate.listFreeGrounds,
            description: "listProfileData",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/userRoutes/updateProfileData",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.updateProfileData,
            validate: validate.updateProfileData,
            description: "updateProfileData",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/userRoutes/forgotPassword",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.forgotPassword,
            validate: validate.forgotPassword,
            description: "forgotPassword",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/userRoutes/resetPassword",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.resetPassword,
            validate: validate.resetPassword,
            description: "resetPassword",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/userRoutes/userBookingHistory",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.userBookingHistory,
            description: "userBookingHistory",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/userRoutes/userAuditPage",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.userAuditPage,
            description: "userAuditPage",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/userRoutes/getGrounds",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.getGrounds,
            description: "getGrounds",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/userRoutes/getUnavailableAddons",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.getUnavailableAddons,
            description: "getUnavailableAddons",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/userRoutes/payConvertString",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.payConvertString,
            description: "payConvertString",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/userRoutes/getconvertedDataAmount",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.getconvertedDataAmount,
            description: "getconvertedDataAmount",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}
