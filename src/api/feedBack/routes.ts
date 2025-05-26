import * as Hapi from "@hapi/hapi";

// import { Logger } from "winston";
import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";
import { feedbackController } from "./controller";
import validate from "./validate";

export class feedbackRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new feedbackController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/feedbackRoutes/addFeedBack",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.addFeedBack,
            validate: validate.addFeedBack,
            description: "addFeedBack",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/feedbackRoutes/listFeedBack",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listFeedBack,
            // validate: validate.listFeedBack,
            description: "listFeedBack",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/feedbackRoutes/groundFeedBack",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.groundFeedBack,
            validate: validate.groundFeedBack,
            description: "groundFeedBack",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/feedbackRoutes/userFeedBackHistory",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.userFeedBackHistory,
            // validate: validate.groundFeedBack,
            description: "userFeedBackHistory",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}
