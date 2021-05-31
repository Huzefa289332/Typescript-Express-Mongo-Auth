import { Application, RequestHandler } from "express";
import { Route } from "../routes/Route";
import { connectDB } from "../config/db";

export class Server {
  constructor(private app: Application) {}

  private preMiddlewares: RequestHandler[] = [];
  private postMiddlewared: RequestHandler[] = [];
  private routes: Route[] = [];

  public setPreMiddlewares(preMiddlewares: RequestHandler[]): void {
    this.preMiddlewares = preMiddlewares;
  }

  public setPostMiddlewares(postMiddlewares: RequestHandler[]): void {
    this.postMiddlewared = postMiddlewares;
  }

  public setRoutes(routes: Route[]): void {
    this.routes = routes;
  }

  public start(): void {
    this.preMiddlewares.forEach(middleware => this.app.use(middleware));
    this.routes.forEach(route => this.app.use(route.path, route.setRoutes()));
    this.postMiddlewared.forEach(middleware => this.app.use(middleware));

    connectDB();

    this.app.listen(process.env.PORT, () => {
      console.log(`Listen on port ${process.env.PORT}!`);
    });
  }
}
