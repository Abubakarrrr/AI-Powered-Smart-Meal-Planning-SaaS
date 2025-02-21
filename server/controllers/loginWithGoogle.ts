import { Request, Response } from "express";
import { asyncHandler } from "@utils/aysncHandler";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import User from "@models/UserModal";
import { ApiError } from "@utils/apiError";
import Mongoose from "mongoose";
import { ApiResponse } from "@utils/apiResponse";
import { ReturnDocument } from "mongodb";

const CLIENT_ID =
  "959770107004-m7b9du2acvifvhlc8mjh74c856hh2apo.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

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
        //save avatar here in mongodb
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
      res.status(400).json({ error: "Authentication failed" });
    }
  }
);
