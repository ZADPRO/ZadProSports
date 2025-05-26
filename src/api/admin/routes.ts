import * as Hapi from "@hapi/hapi";

// import { Logger } from "winston";
import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";
import validate from "./validate";
import { adminController } from "./controller";

export class adminRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new adminController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/adminRoutes/userSignUp",
          config: {
            handler: controller.userSignUp,
            description: "user SignUp",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/adminRoutes/userLogin",
          config: {
            // pre: [{ method: validateToken, assign: "token" }],
            handler: controller.userLogin,
            validate: validate.userLogin,
            description: "user Login",
            // tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/adminRoutes/listUserBookings",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listUserBookings,
            // validate: validate.listUserBookings,
            description: "listUserBookings",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/adminRoutes/deleteBookings",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.deleteBookings,
            validate: validate.deleteBookings,
            description: "deleteBookings",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/adminRoutes/listSignUpUsers",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listSignUpUsers,
            description: "listSignUpUsers",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/adminRoutes/listOverallAudit",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listOverallAudit,
            description: "listOverallAudit",
            tags: ["api", "Users"],
            auth: false,
          },
        },
         {
          method: "GET",
          path: "/api/v1/adminRoutes/reportPage",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.reportPage,
            // validate: validate.listUserBookings,
            description: "reportPage",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}
