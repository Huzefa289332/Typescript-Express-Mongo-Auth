import express, { RequestHandler } from "express";
import { config } from "dotenv";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import { errorHandler, notFound } from "./middlewares";
import { Route } from "./routes/Route";
import { UserRoute } from "./routes/UserRoute";
import { Server } from "./Server/Server";
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
const routes: Route[] = [new UserRoute()];

const app = express();
const server = new Server(app);
server.setRoutes(routes);
server.setPreMiddlewares(preMiddlewares);
server.setPostMiddlewares(postMiddlewared);

server.start();
