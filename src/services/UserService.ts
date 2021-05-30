import { User } from '../models/user';
import { BadRequestError } from '../errors';
import {
  generateToken,
  sendConfirmationEmail,
  Password,
  verifyToken,
} from '../utils';

export class UserService {
  static signUp = async (username: string, email: string, password: string) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Email in use');
    }
    const confirmationCode = generateToken({ email });
    const user = User.build({
      username,
      email,
      password,
      confirmationCode,
    });
    await user.save();
    const userJWT = generateToken({ id: user.id, email: user.email });
    sendConfirmationEmail(user.username, user.email, confirmationCode);
    return { user, userJWT };
  };

  static signIn = async (email: string, password: string) => {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid Credentials');
    }
    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid Credentials');
    }
    if (existingUser.status === 'Pending') {
      throw new BadRequestError('Pending account. Please verify your email.');
    }
    const userJWT = generateToken({
      id: existingUser.id,
      email: existingUser.email,
    });
    return { existingUser, userJWT };
  };

  static confirm = async (confirmationCode: string) => {
    try {
      const { email } = verifyToken(confirmationCode) as {
        email: string;
        iat: number;
      };
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        throw new BadRequestError('User not found.');
      }
      existingUser.status = 'Active';
      await existingUser.save();
      return true;
    } catch (err) {
      throw new BadRequestError('Invalid token');
    }
  };
}
