import express from 'express';
import { config } from 'dotenv';
import cookieSession from 'cookie-session';
import { json } from 'body-parser';
import { errorHandler, notFound } from './middlewares';
import { UserController } from './controllers/UserController';
import { connectDB } from './config/db';
import 'express-async-errors';

const userController = new UserController();

config();
const app = express();

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.env === 'development' ? false : true,
  })
);
app.use(userController.path, userController.setRoutes());
app.all('*', notFound);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Listen on port ${process.env.PORT}!`);
});
