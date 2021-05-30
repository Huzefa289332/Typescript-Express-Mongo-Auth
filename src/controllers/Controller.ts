import { Router, RequestHandler } from 'express';
import { ValidationChain } from 'express-validator';

export enum Methods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

interface Route {
  path: string;
  method: Methods;
  handler: RequestHandler;
  localMiddleware: RequestHandler[];
  checkBody?: ValidationChain[];
}

export abstract class Controller {
  private router: Router = Router();
  public abstract path: string;
  protected abstract readonly routes: Array<Route> = [];

  public setRoutes = (): Router => {
    for (const route of this.routes) {
      if (route.checkBody) this.router.use(route.path, route.checkBody);

      for (const mw of route.localMiddleware) {
        this.router.use(route.path, mw);
      }

      switch (route.method) {
        case 'GET':
          this.router.get(route.path, route.handler);
          break;
        case 'POST':
          this.router.post(route.path, route.handler);
          break;
        case 'PUT':
          this.router.put(route.path, route.handler);
          break;
        case 'DELETE':
          this.router.delete(route.path, route.handler);
          break;
        default:
          console.log('not a valid method');
          break;
      }
    }

    return this.router;
  };
}
