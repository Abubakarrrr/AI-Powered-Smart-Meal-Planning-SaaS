import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@models/UserModal"; 

// Extend Express Request to include user info
interface AuthRequest extends Request {
  user?: { id: string };
}

const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
    }

    // Verify Access Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized - Invalid token" });
    }

    // Attach user to request object (optional: fetch user from DB)
    req.user = { id: decoded.userId };

    next(); // Proceed to the next middleware/controller

  } catch (error) {
    console.error("Authentication Error:", error);
    return res.status(401).json({ success: false, message: "Unauthorized - Token verification failed" });
  }
};

export default authenticate;
