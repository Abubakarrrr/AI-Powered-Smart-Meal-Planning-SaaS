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
    const role = req.user.role;
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
    } = req.body;

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
      createdBy:role
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

    res.status(201).json({
      success: true,
      message: "Meal created successfully",
      meal: newMeal,
    });
    return;
  } catch (error) {
    console.error("Error creating meal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateMeal = async (req: RequestWithUser, res: Response) => {
  try {
    if (!req.user) {
      res.status(400).json({ success: false, message: "No such user" });
      return;
    }

    // const userId = req.user._id;
    const { mealId } = req.params;
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
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !calories || !mealType) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    // Find the meal by ID and check ownership
    const meal = await Meal.findById(mealId);
    if (!meal) {
      res.status(404).json({ success: false, message: "Meal not found" });
      return;
    }

    // Update the meal fields
    meal.title = title;
    meal.description = description;
    meal.ingredients = ingredients;
    meal.steps = steps;
    meal.category = category;
    meal.calories = calories;
    meal.protein = protein;
    meal.carbs = carbs;
    meal.fats = fats;
    meal.mealType = mealType;

    // Save the updated meal
    await meal.save();

    res
      .status(200)
      .json({ success: true, message: "Meal updated successfully", meal });
    return;
  } catch (error) {
    console.error("Error updating meal:", error);
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
    const userMealsForDate = user.meals?.filter((meal) => {
      if (meal instanceof Meal) {
        const mealCreatedAt = new Date(meal.createdAt);
        return mealCreatedAt >= startOfDay && mealCreatedAt <= endOfDay;
      }
      // const mealCreatedAt = new Date(meal.createdAt);
      // return mealCreatedAt >= startOfDay && mealCreatedAt <= endOfDay;
    });

    if (userMealsForDate.length === 0) {
      res.status(201).json({
        success: false,
        message: "No meals found for the selected date",
      });
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

export const deleteMeal = async (req: RequestWithUser, res: Response) => {
  try {
    const { mealId } = req.params;
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const userId = req.user._id;
    const role = req.user.role;

    // Validate mealId
    // if (!mongoose.Types.ObjectId.isValid(mealId)) {
    //   return res.status(400).json({ success: false, message: "Invalid meal ID" });
    // }

    // Find the meal
    const meal = await Meal.findById(mealId);
    if (!meal) {
      res.status(404).json({ success: false, message: "Meal not found" });
      return;
    }
    // if(role == "admin"  && createdBY)

    // Check if the user owns the meal    
    const user = await User.findById(userId);
    if (!user || !user.meals.includes(meal._id as Schema.Types.ObjectId)) {
      res.status(403).json({
        success: false,
        message: "Not authorized to delete this meal",
      });
      return;
    }

    // Remove meal from Meal collection
    await Meal.findByIdAndDelete(mealId);

    // Remove mealId from user's meals array
    user.meals = user.meals.filter((id) => id.toString() !== mealId);
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Meal deleted successfully" });
    return;
  } catch (error) {
    console.error("Error deleting meal:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
};

export const logMeal = async (req: RequestWithUser, res: Response) => {
  try {
    if (!req.user) {
      res.status(400).json({ success: false, message: "No such user" });
      return;
    }
    const { mealId } = req.params;
    const { isLogged } = req.body; // `isLogged` will be true (log) or false (unlog)

    const userId = req.user._id;

    // Validate required fields
    if (!userId || !mealId || typeof isLogged !== "boolean") {
      res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
      return;
    }

    // Find the meal log entry
    let mealLog = await Meal.findByIdAndUpdate(
      mealId,
      { $set: { isLogged } },
      { new: true, upsert: true }
    );
    // const log = mealLog.isLogged;

    res.status(200).json({
      success: true,
      // message: isLogged
        // ? "Meal logged successfully"
        // : "Meal unlogged successfully",
      // log,
    });
  } catch (error) {
    console.error("Error logging meal:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//created by admin , role user delete from user meals array
//created by admin , role admin delete from schema 
//created by user , role user delete from both

