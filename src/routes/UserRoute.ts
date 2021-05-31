import { Route, Methods } from "./Route";
import { UserController } from "../controllers/UserController";
import {
  validateRequest,
  checkSignInCredentials,
  checkSignUpCredentials,
  currentUser,
} from "../middlewares";

export class UserRoute extends Route {
  path = "/api/users";

  routes = [
    {
      path: "/signup",
      method: Methods.POST,
      handler: UserController.signUp,
      middlewares: [validateRequest],
      validateBody: checkSignUpCredentials,
    },
    {
      path: "/signin",
      method: Methods.POST,
      handler: UserController.signIn,
      middlewares: [validateRequest],
      validateBody: checkSignInCredentials,
    },
    {
      path: "/signout",
      method: Methods.POST,
      handler: UserController.signOut,
      middlewares: [],
    },
    {
      path: "/currentuser",
      method: Methods.GET,
      handler: UserController.getCurrentUser,
      middlewares: [currentUser],
    },
    {
      path: "/confirm/:confirmationCode",
      method: Methods.GET,
      handler: UserController.confirm,
      middlewares: [],
    },
  ];
}
