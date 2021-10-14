import { Response, Request } from "express";
import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { environment } from "../config/environment";

export interface IContext {
  req: Request;
  res: Request;
  payload: { userId: string };
}

export const isAuth: MiddlewareFn<IContext> = ({ context }, next) => {
  try {
    const bearerToken = context.req.headers["authorization"];
    if (!bearerToken) {
      throw new Error("Unauthorized");
    }
    const jwt = bearerToken.split(" ")[1];
    const payload = verify(jwt, environment.JWT_SECRET);
    context.payload = payload as any;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
  return next();
};
