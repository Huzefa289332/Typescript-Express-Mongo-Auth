import { Application, RequestHandler } from "express";
import { Controller } from "./controllers/Controller";
import { connectDB } from "./config/db";

export class Server {
  constructor(private app: Application) {}

  private preMiddlewares: RequestHandler[] = [];
  private postMiddlewared: RequestHandler[] = [];
  private controllers: Controller[] = [];

  public setPreMiddlewares(preMiddlewares: RequestHandler[]): void {
    this.preMiddlewares = preMiddlewares;
  }

  public setPostMiddlewares(postMiddlewares: RequestHandler[]): void {
    this.postMiddlewared = postMiddlewares;
  }

  public setControllers(controllers: Controller[]): void {
    this.controllers = controllers;
  }

  public start(): void {
    this.preMiddlewares.forEach(middleware => this.app.use(middleware));
    this.controllers.forEach(controller =>
      this.app.use(controller.path, controller.setRoutes())
    );
    this.postMiddlewared.forEach(middleware => this.app.use(middleware));
    connectDB();
    this.app.listen(process.env.PORT, () => {
      console.log(`Listen on port ${process.env.PORT}!`);
    });
  }
}
