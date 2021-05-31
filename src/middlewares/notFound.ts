import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../errors/NotFoundError";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  throw new NotFoundError(`Not Found ${req.originalUrl}`);
};

export { notFound };
