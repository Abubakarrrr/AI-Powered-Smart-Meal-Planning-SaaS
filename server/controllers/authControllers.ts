import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import User, { IUser } from "@models/UserModal";
import Mongoose from "mongoose";
import { ApiError } from "@utils/apiError";
import { ApiResponse } from "@utils/apiResponse";
import { asyncHandler } from "@utils/aysncHandler";
import jwt, { JwtPayload } from "jsonwebtoken";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateAccessAndRefereshTokens = async (
  userId: Mongoose.Types.ObjectId
) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

export const signup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      throw new ApiError(400, "All fields are required");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "User already registered");
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      newUser._id as Mongoose.Types.ObjectId
    );
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to false in development if not using HTTPS
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: newUser,
          },
          "User logged In Successfully"
        )
      );
  }
);

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password!);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id as Mongoose.Types.ObjectId
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user,
        },
        "User logged in successfully"
      )
    );
});

interface RequestWithUser extends Request {
  user?: IUser;
}

export const logout = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    if (!req.user) {
      throw new ApiError(400, "User not logged in");
    }
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged Out"));
  }
);

interface DecodedToken extends JwtPayload {
  _id: string;
}

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as DecodedToken;

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user._id as Mongoose.Types.ObjectId
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    // Ensure error is an instance of Error before accessing `.message`
    const errorMessage =
      error instanceof Error ? error.message : "Invalid access token";
    throw new ApiError(401, errorMessage);
  }
});

export const uploadAvatar = async (req: Request, res: Response) => {
  const { userId, avatar } = req.body;

  if (!userId || !avatar) {
    res.status(400).json({ error: "User ID and avatar URL are required" });
    return;
  }

  try {
    // Find the user by userId and update the avatar URL
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ message: "Avatar updated successfully", user });
    return;
  } catch (error) {
    console.error("Error updating avatar:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteAvatar = async (req: Request, res: Response) => {
  try {
    const { userId, publicId } = req.body;

    if (!publicId) {
      res.status(400).json({ error: "Public ID is required" });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Update user record in the database
    await User.findByIdAndUpdate(userId, { avatar: "" });

    // Fetch the updated user to ensure fresh data
    const updatedUser = await User.findById(userId);

    res.json({
      success: true,
      message: "Avatar deleted successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error deleting avatar:", error);
    res.status(500).json({ error: "Failed to delete avatar" });
  }
};
