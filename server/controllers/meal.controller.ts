import { Request, Response } from "express";
import Meal, { IMeal, MealType } from "@models/Meal";
import User, { IUser } from "@models/User";
import mongoose, { Schema } from "mongoose";
import UserMeal from "@models/UserMeal";
import config from "@config/config";
import { OAuth2Client } from "google-auth-library";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";


const CLIENT_ID = config.OAUTH_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

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
      images,
      date,
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
      createdBy: role,
      images,
    });

    // Save meal to DB
    await newMeal.save();

    const mealLog = new UserMeal({
      user: userId,
      meal: newMeal._id,
      plannedDate: date,
    });
    await mealLog.save();

    // Add meal to user's meal array
    // const user = await User.findById(userId);
    // if (!user) {
    //   res.status(404).json({ success: "false", message: "User not found" });
    //   return;
    // }
    // const id = newMeal._id as Schema.Types.ObjectId;
    // user.meals.push(id);
    // await user.save();

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
      images,
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !calories || !mealType) {
      res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
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
    meal.images = images;

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

// export const getDateWiseUserMeal = async (
//   req: RequestWithUser,
//   res: Response
// ) => {
//   try {
//     if (!req.user) {
//       res.status(400).json({ success: false, message: "unauthorized" });
//       return;
//     }
//     const userId = req?.user._id;
//     const { date } = req.params;
//     if (!date) {
//       res.status(400).json({ success: false, message: "date is required" });
//       return;
//     }
//     const user = await User.findById(userId).populate("meals");
//     if (!user) {
//       res.status(404).json({ success: false, message: "User not found" });
//       return;
//     }

//     const selectedDate = new Date(date);
//     // Set the date range for the selected day (midnight to 11:59:59)
//     const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
//     const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

//     // Filter the meals by comparing the createdAt field within the start and end of the selected day
//     const userMealsForDate = user.meals?.filter((meal) => {
//       if (meal instanceof Meal) {
//         const mealCreatedAt = new Date(meal.createdAt);
//         return mealCreatedAt >= startOfDay && mealCreatedAt <= endOfDay;
//       }
//       // const mealCreatedAt = new Date(meal.createdAt);
//       // return mealCreatedAt >= startOfDay && mealCreatedAt <= endOfDay;
//     });

//     if (userMealsForDate.length === 0) {
//       res.status(201).json({
//         success: false,
//         message: "No meals found for the selected date",
//       });
//       return;
//     }

//     // Return the meals for the selected date
//     res.status(200).json({ success: true, meals: userMealsForDate });
//     return;
//   } catch (error) {
//     console.error("Error getting meals:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

export const getDateWiseUserMeal = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const userId = req.user._id;
    const { date } = req.params;
    if (!date) {
      res.status(400).json({ success: false, message: "Date is required" });
      return;
    }
    const selectedDate = new Date(date);
    const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

    // ✅ 1. Fetch user meals for the given user and date
    const userMeals = await UserMeal.find({
      user: userId,
      plannedDate: { $gte: startOfDay, $lte: endOfDay },
    }).populate("meal"); // Populate the meal details

    if (!userMeals.length) {
      res.status(200).json({
        success: false,
        message: "No meals found for the selected date",
        meals: [],
      });
      return;
    }
    console.log(userMeals);
    const mealsWithDetails = userMeals.map((userMeal) => {
      if (userMeal.meal instanceof Meal) {
        const meal = userMeal.meal;
        return {
          ...meal.toObject(),
          isLogged: userMeal.isLogged,
          plannedDate: userMeal.plannedDate,
        };
      }
    });

    // ✅ 3. Return response
    res.status(200).json({
      success: true,
      meals: mealsWithDetails,
    });
  } catch (error) {
    console.error("Error getting meals:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
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
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { mealId } = req.params;
    const { isLogged } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!userId || !mealId || typeof isLogged !== "boolean") {
      res.status(400).json({
        success: false,
        message: "Missing required fields or invalid data",
      });
      return;
    }

    // Check if meal log already exists
    let mealLog = await UserMeal.findOne({ user: userId, meal: mealId });

    if (!mealLog) {
      // First-time log → Create a new entry
      mealLog = new UserMeal({
        user: userId,
        meal: mealId,
        isLogged,
      });
    } else {
      // Update existing log
      mealLog.isLogged = isLogged;
    }

    // Save the meal log (create or update)
    await mealLog.save();

    res.status(200).json({
      success: true,
      message: isLogged
        ? "Meal logged successfully"
        : "Meal unlogged successfully",
      mealLog,
    });
  } catch (error) {
    console.error("Error logging meal:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      res
        .status(400)
        .json({ success: false, message: "Public ID is required" });
      return;
    }
    const result = await cloudinary.uploader.destroy(publicId);
    res.json({ success: true, message: "Image deleted successfully", result });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const createAdminMeal = async (req: RequestWithUser, res: Response) => {
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
      images,
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
      createdBy: role,
      images,
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
export const updateAdminMeal = async (req: RequestWithUser, res: Response) => {
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
      images,
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !calories || !mealType) {
      res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
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
    meal.images = images;

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
export const deleteAdminMeal = async (req: RequestWithUser, res: Response) => {
  try {
    if (!req.user) {
      res.status(400).json({ success: false, message: "No such user" });
      return;
    }
    const { mealId } = req.params;

    // Find the meal by ID
    const meal = await Meal.findById(mealId);
    if (!meal) {
      res.status(404).json({ success: false, message: "Meal not found" });
      return;
    }

    // Delete the meal
    await Meal.findByIdAndDelete(mealId);

    res.status(200).json({
      success: true,
      message: "Meal deleted successfully",
    });
    return;
  } catch (error) {
    console.error("Error deleting meal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMealById = async (req: Request, res: Response) => {
  try {
    const { mealId } = req.params;
    const meal = await Meal.findById(mealId);
    if (!meal) {
      res.status(404).json({ success: false, message: "Meal not found" });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Meal fetched successfully",
      meal,
    });
    return;
  } catch (error) {
    console.error("Error fetching meal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const planAdminCreatedMeal = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const userId = req.user._id;
    const { mealId } = req.params;
    const { date } = req.body;
    if (!date || !mealId) {
      res
        .status(400)
        .json({ success: false, message: "Date or MealId is required" });
      return;
    }
    const mealLog = new UserMeal({
      user: userId,
      meal: mealId,
      plannedDate: date,
    });
    await mealLog.save();

    // Add meal to user's meal array
    // const user = await User.findById(userId);
    // if (!user) {
    //   res.status(404).json({ success: "false", message: "User not found" });
    //   return;
    // }
    // const id = mealId as unknown as Schema.Types.ObjectId;
    // user.meals.push(id);
    // await user.save();

    res
      .status(201)
      .json({ success: true, message: "Meal planned successfully" });
  } catch (error) {
    console.log("Error fetching meals:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//ai related
export const fetchRelevantMeals = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const { preferences } = req.body;
    // console.log("preferences",preferences)
    if (!preferences) {
      res
        .status(404)
        .json({ success: false, message: "No preferences are given" });
      return;
    }
    const user = await User.findById(req.user._id).populate("userProfileId");
    if (!user) {
      res
        .status(404)
        .json({ success: false, message: "First complete your profile" });
      return;
    }
    // console.log("user_info",user?.userProfileId);
    const user_info = user.userProfileId;
    // Send request to FastAPI
    const fastAPIResponse = await axios.post(
      "http://0.0.0.0:8000/fetch-relevant-meals",
      {
        user_info,
        preferences,
      }
    );
    const recommendation = fastAPIResponse.data.recommendations
    console.log(fastAPIResponse.data.recommendations);
    // const clear = JSON.stringify(fastAPIResponse.data.recommendations);
    // console.log(clear)
    res.status(201).json({success:true,message:"fetch meals",recommendation})
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//created by admin , role user delete from user meals array
//created by admin , role admin delete from schema
//created by user , role user delete from both
