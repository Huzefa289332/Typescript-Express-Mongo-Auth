import { Request, Response } from "express";
import { Controller, Methods } from "./Controller";
import {
  validateRequest,
  currentUser,
  checkSignUpCredentials,
  checkSignInCredentials,
} from "../middlewares";
import { UserService } from "../services/UserService";

export class UserController extends Controller {
  path = "/api/users";

  routes = [
    {
      path: "/signup",
      method: Methods.POST,
      handler: this.signUpUser,
      middlewares: [validateRequest],
      validateBody: checkSignUpCredentials,
    },
    {
      path: "/signin",
      method: Methods.POST,
      handler: this.signInUser,
      middlewares: [validateRequest],
      validateBody: checkSignInCredentials,
    },
    {
      path: "/signout",
      method: Methods.POST,
      handler: this.signOutUser,
      middlewares: [],
    },
    {
      path: "/currentuser",
      method: Methods.GET,
      handler: this.getCurrentUser,
      middlewares: [currentUser],
    },
    {
      path: "/confirm/:confirmationCode",
      method: Methods.GET,
      handler: this.confirmUser,
      middlewares: [],
    },
  ];

  constructor() {
    super();
  }

  async signUpUser(req: Request, res: Response) {
    const { username, email, password } = req.body;
    const { user, userJWT } = await UserService.signUp(
      username,
      email,
      password
    );
    req.session = { jwt: userJWT };
    res.status(201).send(user);
  }

  async signInUser(req: Request, res: Response) {
    const { email, password } = req.body;
    const { existingUser, userJWT } = await UserService.signIn(email, password);
    req.session = { jwt: userJWT };
    res.status(200).send(existingUser);
  }

  signOutUser(req: Request, res: Response) {
    req.session = null;
    res.send({});
  }

  getCurrentUser(req: Request, res: Response) {
    res.send({ currentUser: req.currentUser || null });
  }

  async confirmUser(req: Request, res: Response) {
    const { confirmationCode } = req.params;
    const isConfirm = await UserService.confirm(confirmationCode);
    if (isConfirm) res.status(200).send({ message: "Email verified!" });
  }
}
