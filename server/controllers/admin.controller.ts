import User, { IUser, UserStatus } from "@models/User";
import { ApiError } from "@utils/apiError";
import { ApiResponse } from "@utils/apiResponse";
import { asyncHandler } from "@utils/aysncHandler";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { userCreationEmail } from "@utils/emailSender";
import Meal, { CreatedBy } from "@models/Meal";

//create user
export const createUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      status: UserStatus.VERIFIED,
    });

    await newUser.save();

    // send ACCOUNT created email
    // await userCreationEmail(name, email, password, role);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          user: newUser,
        },
        "User Created Successfully"
      )
    );
  }
);

//get users
export const getAllUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Fetch all users
      const users = await User.find(
        { status: { $ne: UserStatus.DELETED } }, // Exclude users with status DELETED
        "name email role avatar status" // Projecting required fields
      );

      if (!users) {
        return res
          .status(404)
          .json({ success: false, message: "No users found" });
      }
      res.status(201).json(
        new ApiResponse(
          201,
          {
            users,
          },
          "Users fetched sucessfully"
        )
      );
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

//delete users
export const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    // Validate required parameter
    if (!userId) {
      res.status(400).json({ success: false, message: "User id is required" });
      return;
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.status = UserStatus.DELETED;
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User Deleted Successfully"));
  }
);

//update user
export const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { password, status, role } = req.body;
    if (!userId) {
      res.status(400).json({ success: false, message: "User id is required" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let updatedFields: Partial<{
      password: string;
      status: UserStatus;
      role: string;
    }> = {};
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedFields.password = hashedPassword;
      // Send password change email
      // await passwordChangedEmail(user.name, user.email);
    }
    if (status) {
      updatedFields.status = status;
      // if (status === UserStatus.BLOCKED) {
      // await accountBlockedEmail(user.name, user.email);
      // }
    }
    if (role) {
      updatedFields.role = role;
    }
    // Update user
    const newUser = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          user: newUser,
        },
        "User Updated Successfully"
      )
    );
  }
);

//getAllMeals-Admin

export const getAllMeals = async (req: Request, res: Response) => {
  try {
    const { mealType, category } = req.query;
    let filter: any = { createdBy: "admin" };
    if (mealType) filter.mealType = mealType;
    if (category) filter.category = category;
    const meals = await Meal.find(filter);
    if (!meals.length) { 
       res.status(200).json({
        success: false,
        message: "No meals created by Admin found",
        meals: [],
      });
      return;
    }
    // ✅ 3. Return meals
    res.status(200).json({
      success: true,
      meals,
    });
  } catch (error) {
    console.error("Error fetching admin meals:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
