import { ApiError } from "@utils/apiError";
import { asyncHandler } from "@utils/aysncHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "@models/User";
import { Request, Response, NextFunction } from "express";


interface DecodedToken extends JwtPayload {
  _id: string;
}
interface RequestWithUser extends Request {
  user?: IUser;
}

export const verifyJWT = asyncHandler(
  async (req: RequestWithUser, _: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken || 
        req.header("Authorization")?.replace("Bearer ", "");
      if (!token) {
        throw new ApiError(401, "Unauthorized request");
      }
      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as DecodedToken;

      const user = await User.findById(decodedToken._id);

      if (!user) {
        throw new ApiError(401, "Invalid Access Token");
      }

      req.user = user;
      next();
    } catch (error) {
      // Ensure error is an instance of Error before accessing `.message`
      const errorMessage =
        error instanceof Error ? error.message : "Invalid access token";
      throw new ApiError(401, errorMessage);
    }
  }
);
