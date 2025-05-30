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
                    pre: [{ method: validateToken, assign: "token" }],
                    handler: controller.addOwners,
                    // validate: validate.addOwners,
                    description: "add Owners",
                    tags: ["api", "Users"],
                    auth: false,
                  },
                },
      
      ]);
      resolve(true);
    });
  }
}
