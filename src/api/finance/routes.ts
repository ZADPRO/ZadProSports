import * as Hapi from "@hapi/hapi";

// import { Logger } from "winston";
import { decodeToken, validateToken } from "../../helper/token";
import IRoute from "../../helper/routes";
import validate from "./validate";
import { financeController } from "./controller";

export class financeRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new financeController();
      server.route([
        {
          method: "GET",
          path: "/api/v1/financeRoutes/recordBookingFinance",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.recordBookingFinance,
            // validate: validate.recordBookingFinance,
            description: "handleBookingFinance",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/financeRoutes/getWeeklyPayouts",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.getWeeklyPayouts,
            // validate: validate.recordBookingFinance,
            description: "getWeeklyPayouts",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/financeRoutes/listPayoutes",
          config: {
            pre: [{ method: validateToken, assign: "token" }],
            handler: controller.listPayoutes,
            // validate: validate.recordBookingFinance,
            description: "listPayoutes",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}
