import { NextFunction, Request, Response } from "express";
import User, { IUser } from "@models/User";

interface RequestWithUser extends Request {
  user?: IUser;
}
export const isAdmin = (req: RequestWithUser, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "admin") {
      res.status(403).json({ success: false, message: "Forbidden: Access restricted to admins only" });
      return;
  }
  next();
};
