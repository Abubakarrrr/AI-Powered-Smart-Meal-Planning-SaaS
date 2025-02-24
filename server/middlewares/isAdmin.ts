import { NextFunction, Request, Response } from "express";
import User, { IUser } from "@models/User";

interface RequestWithUser extends Request {
  user?: IUser;
}
export const isAdmin = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  // can simplify it by only checking the user role directly beacause we already have the user through verifyJWT and before it add verifyJWT middle ware
  const userId = req.user?._id;
  if (!userId) {
    return res.status(400).json({
      status: false,
      messaage: "Unothorized - No user found",
    });
  }
  try {
    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Forbidden: Admin access required" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("error in checking user");
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};
