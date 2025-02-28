import UserProfile from "@models/UserProfile";
import { asyncHandler } from "@utils/aysncHandler";
import { Request, Response, NextFunction } from "express";
import User, { IUser } from "@models/User";
import { ApiResponse } from "@utils/apiResponse";

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
    } = req.body.profileInfo;

    // if (
    //   !goal ||
    //   !sex ||
    //   !heightFeet ||
    //   !heightInches ||
    //   !weight ||
    //   !age ||
    //   bodyFat ||
    //   !activityLevel ||
    //   !foodExclusions
    // ) {
    //   res
    //     .status(400)
    //     .json({ success: false, message: "All fields are required" });
    //   return;
    // }

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

export const getUserProfile = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    try {
      if (!req.user) {
        res
          .status(400)
          .json({ success: false, message: "No such user exists" });
        return;
      }
      const userId = req?.user._id;
      if (!userId) {
        return res
          .status(400)
          .json({ success: false, message: "User ID is required" });
      }
      
      // Find the user and populate the userProfile data
      const user = await User.findById(userId).populate("userProfileId");
      console.log(user) 
      if (!user || !user.userProfileId) {
        return res
          .status(404)
          .json({ success: false, message: "User profile not found" });
      }

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            userProfile: user.userProfileId,
          },
          "User profile fetched successfully"
        )
      );
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);
