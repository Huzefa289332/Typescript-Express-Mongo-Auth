import { NotFoundError } from "../errors/notFoundError";

const notFound = () => {
  throw new NotFoundError();
};

export { notFound };
