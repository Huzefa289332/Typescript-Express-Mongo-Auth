import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { User } from "../models/user";
import { BadRequestError } from "../errors/badRequestError";
import { generateToken } from "../utils/generateToken";
import { sendConfirmationEmail } from "../utils/sendConfirmationEmail";
import { verifyToken } from "../utils/verifyToken";
import { Password } from "../utils/passwordManager";

const signUpUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestError("Email in use");
  }
  const confirmationCode = generateToken({ email });
  const user = User.build({ username, email, password, confirmationCode });
  await user.save();
  const userJWT = generateToken({ id: user.id, email: user.email });
  req.session = { jwt: userJWT };
  sendConfirmationEmail(username, email, confirmationCode);
  res.status(201).send(user);
});

const signInUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new BadRequestError("Invalid Credentials");
  }
  const passwordsMatch = await Password.compare(
    existingUser.password,
    password
  );
  if (!passwordsMatch) {
    throw new BadRequestError("Invalid Credentials");
  }
  if (existingUser.status === "Pending") {
    throw new BadRequestError("Pending account. Please verify your email.");
  }
  const userJWT = generateToken({
    id: existingUser.id,
    email: existingUser.email,
  });
  req.session = { jwt: userJWT };
  res.status(200).send(existingUser);
});

const getCurrentUser = (req: Request, res: Response) => {
  res.send({ currentUser: req.currentUser || null });
};

const signOutUser = (req: Request, res: Response) => {
  req.session = null;
  res.send({});
};

const confirmUser = asyncHandler(async (req: Request, res: Response) => {
  const { confirmationCode } = req.params;
  try {
    const { email } = verifyToken(confirmationCode) as {
      email: string;
      iat: number;
    };
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("User not found.");
    }
    existingUser.status = "Active";
    await existingUser.save();
    res.status(200).send({ message: "Email verified!" });
  } catch (err) {
    throw new BadRequestError("Invalid token");
  }
});

export { signUpUser, signInUser, signOutUser, getCurrentUser, confirmUser };
