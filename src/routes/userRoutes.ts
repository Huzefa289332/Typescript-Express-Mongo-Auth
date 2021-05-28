import express from "express";
import {
  signUpUser,
  signInUser,
  signOutUser,
  getCurrentUser,
  confirmUser,
} from "../controllers/userController";
import { validateRequest } from "../middlewares/validateRequest";
import { currentUser } from "../middlewares/currentUser";
import { requireAuth } from "../middlewares/requireAuth";
import {
  checkSignInCredentials,
  checkSignUpCredentials,
} from "../repository/user/checkUserCredentials";

const router = express.Router();

router
  .route("/signup")
  .post(checkSignUpCredentials, validateRequest, signUpUser);

router
  .route("/signin")
  .post(checkSignInCredentials, validateRequest, signInUser);

router.route("/currentuser").get(currentUser, getCurrentUser);

router.route("/signout").post(signOutUser);

router.route("/confirm/:confirmationCode").get(confirmUser);

export { router as userRoutes };
