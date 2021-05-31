import { Router, RequestHandler, response } from "express";
import { ValidationChain } from "express-validator";

export enum Methods {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
}

interface Route {
  path: string;
  method: Methods;
  handler: RequestHandler;
  middlewares: RequestHandler[];
  validateBody?: ValidationChain[];
}

export abstract class Controller {
  private router: Router = Router();
  public abstract path: string;
  protected abstract routes: Route[] = [];

  public setRoutes = (): Router => {
    this.routes.map(route => {
      route.validateBody && this.router.use(route.path, route.validateBody);
      route.middlewares.map(middleware => {
        this.router.use(route.path, middleware);
      });
      this.router[route.method](route.path, route.handler);
    });
    return this.router;
  };
}
