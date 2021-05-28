import express from "express";
import { config } from "dotenv";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import { errorHandler } from "./middlewares/errorHandler";
import { notFound } from "./middlewares/notFound";
import { userRoutes } from "./routes/userRoutes";
import { connectDB } from "./config/db";
import "express-async-errors";

config();
const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.env === "development" ? false : true,
  })
);

app.use("/api/users", userRoutes);
app.all("*", notFound);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Listen on port ${process.env.PORT}!`);
});
