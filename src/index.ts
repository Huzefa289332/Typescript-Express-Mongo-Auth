import express, { RequestHandler } from "express";
import { config } from "dotenv";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import { errorHandler, notFound } from "./middlewares";
import { UserController } from "./controllers/UserController";
import { Controller } from "./controllers/Controller";
import { Server } from "./Server";
import "express-async-errors";

config();

const preMiddlewares: RequestHandler[] = [
  json(),
  cookieSession({
    signed: false,
    secure: process.env.env === "development" ? false : true,
  }),
];
const postMiddlewared: RequestHandler[] = [
  notFound,
  errorHandler as () => void,
];
const controllers: Controller[] = [new UserController()];

const app = express();
const server = new Server(app);
server.setControllers(controllers);
server.setPreMiddlewares(preMiddlewares);
server.setPostMiddlewares(postMiddlewared);

server.start();
