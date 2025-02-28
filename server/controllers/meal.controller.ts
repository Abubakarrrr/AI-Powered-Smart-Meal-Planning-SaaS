import { Request, Response } from "express";
import Meal from "@models/Meal";
import User, { IUser } from "@models/User";
import mongoose from "mongoose";

interface RequestWithUser extends Request {
  user?: IUser;
}

export const createMeal = async (req: RequestWithUser, res: Response) => {
  try {
    if (!req.user) {
        res.status(400).json({ success: false, message: "No such user" });
        return;
      }
    const userId = req.user._id;
    const {
      title,
      description,
      ingredients,
      steps,
      category,
      calories,
      protein,
      carbs,
      fats,
      mealType,
    } = req.body.meal;
    console.log(req.body.meal)

    // Validate required fields
    if (
      !userId ||
      !title ||
      !description ||
      !category ||
      !calories ||
      !mealType
    ) {
       res.status(400).json({ message: "Missing required fields" });
       return;
    }

    // Create the meal
    const newMeal = new Meal({
      title,
      description,
      ingredients,
      steps,
      category,
      calories,
      protein,
      carbs,
      fats,
      mealType,
    });

    // Save meal to DB
    await newMeal.save();

    // Add meal to user's meal array
    const user = await User.findById(userId);
    if (!user) {
       res.status(404).json({ success:"false",message: "User not found" });
       return;
    }
    const id = newMeal._id as mongoose.Types.ObjectId;
    user.meals.push(id);
    await user.save();

     res
      .status(201)
      .json({ message: "Meal created successfully", meal: newMeal });
      return;
      
  } catch (error) {
    console.error("Error creating meal:", error);
     res.status(500).json({ message: "Internal server error" });
  }
};
