import { NextFunction, Request, Response } from "express";
import { IUser } from "@models/User";

interface RequestWithUser extends Request {
  user?: IUser;
}
export const isNutritionist = (req: RequestWithUser, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "nutritionist") {
      res.status(403).json({ success: false, message: "Forbidden: Access restricted to nutritionist only" });
      return;
  }
  next();
};
