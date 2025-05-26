import * as Hapi from "@hapi/hapi";
import { adminRoutes } from "./api/admin/routes";
import { settingsRoutes } from "./api/settings/routes";
import { groundRoutes } from "./api/ground/routes";
import { userRoutes } from "./api/user/routes";
import { feedbackRoutes } from "./api/feedBack/routes";


export default class Router {
  public static async loadRoutes(server: Hapi.Server): Promise<any> {
    await new adminRoutes().register(server);
    await new settingsRoutes().register(server);
    await new groundRoutes().register(server);
    await new userRoutes().register(server);
    await new feedbackRoutes().register(server);

  }
}