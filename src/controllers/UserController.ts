import { Request, Response } from "express";
import { UserRepo } from "../repositories/user/UserRepo";

export class UserController {
  static signUp = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    const { user, userJWT } = await UserRepo.signUp(username, email, password);
    req.session = { jwt: userJWT };
    res.status(201).send(user);
  };

  static signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { existingUser, userJWT } = await UserRepo.signIn(email, password);
    req.session = { jwt: userJWT };
    res.status(200).send(existingUser);
  };

  static signOut = (req: Request, res: Response) => {
    req.session = null;
    res.send({});
  };

  static getCurrentUser = (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
  };

  static confirm = async (req: Request, res: Response) => {
    const { confirmationCode } = req.params;
    const isConfirm = await UserRepo.confirm(confirmationCode);
    if (isConfirm) res.status(200).send({ message: "Email verified!" });
  };
}
