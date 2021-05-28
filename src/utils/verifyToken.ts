import jwt from "jsonwebtoken";

export const verifyToken = (confirmationCode: string) => {
  return jwt.verify(confirmationCode, `${process.env.JWT_SECRET}`);
};
