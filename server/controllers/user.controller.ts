import UserProfile from "@models/UserProfile";
import { asyncHandler } from "@utils/aysncHandler";
import { Request, Response, NextFunction } from "express";
import User, { IUser } from "@models/User";
import { ApiResponse } from "@utils/apiResponse";
import { JwtPayload } from "jsonwebtoken";

interface RequestWithUser extends Request {
  user?: IUser;
}
export const createUserProfile = asyncHandler(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(400).json({ success: false, message: "No such user exists" });
      return;
    }
    const { _id } = req.user;
    const {
      goal,
      sex,
      heightFeet,
      heightInches,
      weight,
      age,
      bodyFat,
      activityLevel,
      foodExclusions,
    } = req.body;

    if (
      !goal ||
      !sex ||
      !heightFeet ||
      !heightInches ||
      !weight ||
      !age ||
      bodyFat ||
      !activityLevel ||
      !foodExclusions
    ) {
      res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Create the UserProfile (user preferences)
    const userProfile = new UserProfile({
      goal,
      sex,
      heightFeet,
      heightInches,
      weight,
      age,
      bodyFat,
      activityLevel,
      foodExclusions,
    });
    await userProfile.save();

    // Update the User with the UserProfile reference
    await User.findByIdAndUpdate(_id, {
      userProfileId: userProfile._id,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          userProfile: userProfile,
        },
        "User profile created"
      )
    );
  }
);
