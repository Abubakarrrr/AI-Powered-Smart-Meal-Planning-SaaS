import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import User, { IUser, UserStatus } from "@models/User";
import Mongoose from "mongoose";
import { ApiError } from "@utils/apiError";
import { ApiResponse } from "@utils/apiResponse";
import { asyncHandler } from "@utils/aysncHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "@config/config";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "@utils/emailSender";
import crypto from "crypto";
import generateAccessAndRefereshTokens from "@utils/generateAccessAndRefereshTokens";

const CLIENT_ID = config.OAUTH_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

// generateAccessAndRefereshTokens function

// signup controller
export const signup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      // throw new ApiError(400, "All fields are required");
      res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // throw new ApiError(400, "User already registered");
      res
        .status(400)
        .json({ success: false, message: "User already registered" });
      return;
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      otp,
      otpExpiresAt: new Date(Date.now() + 24 * 3600 * 1000),
    });

    await newUser.save();

    // send verification email
    await sendVerificationEmail(newUser.email, otp);

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      newUser._id as Mongoose.Types.ObjectId
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true, // Use HTTPS in production
      sameSite: "lax", // Use 'lax' for cross-origin navigation supportsameSite: "strict",
      maxAge: 15 * 60 * 1000, //15 mins
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, // Use HTTPS in production
      sameSite: "lax", // Use 'lax' for cross-origin navigation supportsameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(
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

//verify email
export const verifyEmail = async (req: Request, res: Response) => {
  const { code } = req.body;
  try {
    console.log(code);
    const user = await User.findOne({
      otp: code,
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: "invalid or expired verification code",
      });
      return;
    }

    user.status = UserStatus.VERIFIED;
    user.otp = undefined;
    user.otpExpiresAt = undefined;

    await user.save();

    res.status(200).json(
      new ApiResponse(
        200,
        {
          user,
        },
        "User verified successfully"
      )
    );
  } catch (error) {
    console.log("error in verifyEmail", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// login controller
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    // throw new ApiError(400, "Email and password are required");
    res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    // throw new ApiError(401, "Invalid credentials");
    res.status(400).json({ success: false, message: "Invalid credentials" });
    return;
  }
  if (user.status == UserStatus.BLOCKED) {
    res
      .status(400)
      .json({ success: false, message: "Your account is blocked, contact support" });
    return;
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password!);
  if (!isMatch) {
    // throw new ApiError(401, "Invalid credentials");
    res.status(400).json({ success: false, message: "Invalid credentials" });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id as Mongoose.Types.ObjectId
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true, // Use HTTPS in production
    sameSite: "lax", // Use 'lax' for cross-origin navigation supportsameSite: "strict",
    maxAge: 15 * 60 * 1000, //15 mins
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true, // Use HTTPS in production
    sameSite: "lax", // Use 'lax' for cross-origin navigation supportsameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user,
      },
      "User logged in successfully"
    )
  );
});

// logout controller
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

// refreshAccessToken controller
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

// uploadAvatar controller
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

//deleteAvatar controller
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

// login with google controller
export const loginWithGoogle = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.body;

    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
      });

      const payload: TokenPayload | undefined = ticket.getPayload();

      if (!payload) {
        throw new Error("Failed to retrieve user payload.");
      }
      const userFromDB = await User.findOne({ email: payload.email });
      if (userFromDB) {
        userFromDB.avatar = payload.picture;
        await userFromDB.save();
        const { accessToken, refreshToken } =
          await generateAccessAndRefereshTokens(
            userFromDB._id as Mongoose.Types.ObjectId
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
                user: userFromDB,
              },
              "User logged in successfully"
            )
          );
        return;
      } else {
        const { name, email, picture, email_verified } = payload;
        const newUser = new User({
          name,
          email,
          avatar: picture,
          isVerified: email_verified,
        });
        await newUser.save();
        const { accessToken, refreshToken } =
          await generateAccessAndRefereshTokens(
            newUser._id as Mongoose.Types.ObjectId
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
                user: newUser,
              },
              "User logged in successfully"
            )
          );
      }
    } catch (error) {
      console.error("Error during Google authentication:", error);
      res
        .status(400)
        .json({ sucess: "false", message: "Authentication failed" });
    }
  }
);

// forgot password controller
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    if (!email) {
      throw new Error("Email is requried");
      return;
    }
    const userFromDB = await User.findOne({ email: email });

    if (!userFromDB) {
      res.status(400).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const passwordResetToken = crypto.randomBytes(20).toString("hex");
    const passwordResetTokenExpiresAt = new Date(
      Date.now() + 1 * 60 * 60 * 1000
    ); // 1 hour

    userFromDB.resetPasswordToken = passwordResetToken;
    userFromDB.resetPasswordExpiresAt = passwordResetTokenExpiresAt;
    await userFromDB.save();

    await sendPasswordResetEmail(
      userFromDB.email,
      `${config.CLIENT_URL}/reset-password/${userFromDB.resetPasswordToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset link email sent successfully",
    });
    return;
  } catch (error) {
    console.log("error in forgotPassword");
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

// reset password controller
export const resetPassword = async (req: Request, res: Response) => {
  const { token, password, confirmPassword } = req.body;
  try {
    const userFromDB = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!userFromDB) {
      res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
      return;
    }

    if (password === confirmPassword) {
      const hashedPassword = await bcrypt.hash(password, 10);
      userFromDB.password = hashedPassword;
      await userFromDB.save();
    } else {
      res.status(400).json({
        success: false,
        message: "New password and confirm new password not matched",
      });
    }
    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log("error in resetPassword");
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};
