import { Request, Response } from "express";
import Meal, { IMeal } from "@models/Meal";
import User, { IUser } from "@models/User";
import mongoose, { Schema } from "mongoose";

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
    console.log(req.body.meal);

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
      res.status(404).json({ success: "false", message: "User not found" });
      return;
    }

    const id = newMeal._id as Schema.Types.ObjectId;
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

export const getDateWiseUserMeal = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    if (!req.user) {
      res.status(400).json({ success: false, message: "unauthorized" });
      return;
    }
    const { date } = req.params;
    console.log(date);
    if (!date) {
      res.status(400).json({ success: false, message: "date is required" });
      return;
    }
    const userId = req?.user._id;
    const user = await User.findById(userId).populate("meals");
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const selectedDate = new Date(date);
    // Set the date range for the selected day (midnight to 11:59:59)
    const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

    // Filter the meals by comparing the createdAt field within the start and end of the selected day
    const userMealsForDate = user.meals.filter((meal) => {
      if (meal instanceof Meal) {
        const mealCreatedAt = new Date(meal.createdAt);
        return mealCreatedAt >= startOfDay && mealCreatedAt <= endOfDay;
      } 
      // const mealCreatedAt = new Date(meal.createdAt);
      // return mealCreatedAt >= startOfDay && mealCreatedAt <= endOfDay;
    });
    console.log("user",userMealsForDate)

    if (userMealsForDate.length === 0) {
      res.status(404).json({success:false, message: "No meals found for the selected date" });
      return;
    }

    // Return the meals for the selected date
    res.status(200).json({ success: true, meals: userMealsForDate });
    return;
  } catch (error) {
    console.error("Error getting meals:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
