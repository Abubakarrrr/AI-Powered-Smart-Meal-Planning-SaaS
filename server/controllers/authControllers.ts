import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User, { IUser } from "@models/UserModal";
import generateTokenAndSetCookie from "@utils/generateTokenAndSetCookie";
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
    const accessToken = generateTokenAndSetCookie(
      res,
      newUser._id as Mongoose.Types.ObjectId
    );

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

    const accessToken = generateTokenAndSetCookie(
      res,
      user._id as Mongoose.Types.ObjectId
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: { name: user.name, email: user.email },
    });
    return;
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
    return;
  }
};
