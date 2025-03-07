import { getAllMeals } from "@controllers/admin.controller";
import { createMeal,deleteMeal,getDateWiseUserMeal,updateMeal,logMeal, deleteImage, createAdminMeal, updateAdminMeal, deleteAdminMeal, getMealById } from "@controllers/meal.controller";
import { verifyJWT } from "@middlewares/auth";
import express from "express";
const router = express.Router();

router.get("/get-datewise-user-meal/:date",verifyJWT,getDateWiseUserMeal);
router.post("/create-meal",verifyJWT,createMeal);
router.put("/update-meal/:mealId",verifyJWT,updateMeal);
router.delete("/delete-meal/:mealId",verifyJWT,deleteMeal);
router.post("/log-meal/:mealId",verifyJWT,logMeal);
router.post("/delete-image",deleteImage);
router.get("/getMealById/:mealId",getMealById);

//admin apis
router.get("/get-all-meals",getAllMeals);
router.post("/create-admin-meal",verifyJWT,createAdminMeal);
router.put("/update-admin-meal/:mealId",verifyJWT,updateAdminMeal);
router.delete("/delete-admin-meal/:mealId",verifyJWT,deleteAdminMeal);

export default router 