import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User, { IUser } from "@models/UserModal";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@utils/generateToken";
import Mongoose from "mongoose";

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      res
        .status(400)
        .json({ success: false, message: "All fields are required" });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res
        .status(400)
        .json({ success: false, message: "User already registered" });
      return;
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser: IUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate Access and Refresh Tokens & Set HTTP-only Cookie
    const accessToken = generateAccessToken(
      newUser._id as Mongoose.Types.ObjectId
    );
    const refreshToken = generateRefreshToken(
      newUser._id as Mongoose.Types.ObjectId
    );
    newUser.refreshToken = refreshToken;
    await newUser.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Prevents JavaScript access (protects from XSS attacks)
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Prevents CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken,
      user: newUser,
    });
    return;
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
    return;
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
      return;
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const accessToken = generateAccessToken(
      user._id as Mongoose.Types.ObjectId
    );
    const refreshToken = generateRefreshToken(
      user._id as Mongoose.Types.ObjectId
    );
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Prevents JavaScript access (protects from XSS attacks)
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Prevents CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: {userId: user._id, name: user.name, email: user.email },
    });
    return;
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
    return;
  }
};

interface LogoutRequest extends Request {
  body: {
    userId: string; // User ID sent from the frontend
  };
}

export const logout = async (req: LogoutRequest, res: Response) => {
  try {
    const { userId } = req.body; // Extract userId from request body

    if (!userId) {
      res.status(400).json({ success: false, message: "User ID is required" });
      return;
    }

    // Step 1: Remove Refresh Token from Cookies
    res.cookie("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use in production environment only
      sameSite: "strict",
      maxAge: 0, // Expire the cookie immediately
    });

    // Step 2: Remove Refresh Token from the Database for the provided userId
    await User.updateOne(
      { _id: userId },
      { $unset: { refreshToken: "" } } // Unset the refreshToken field
    );

    // Optionally: If you're storing other session data, you can clear it here

    // Step 3: Send Success Response
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
    return;
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({
      success: false,
      message: "Server error during logout",
    });
    return;
  }
};
