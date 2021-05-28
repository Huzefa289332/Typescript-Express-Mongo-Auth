import jwt from "jsonwebtoken";

type payloadType = string | Buffer | object;

export const generateToken = (payload: payloadType) => {
  return jwt.sign(payload, `${process.env.JWT_SECRET}`);
};
