import { createMeal,deleteMeal,getDateWiseUserMeal,updateMeal,logMeal } from "@controllers/meal.controller";
import { verifyJWT } from "@middlewares/auth";
import express from "express";
const router = express.Router();

router.get("/get-datewise-user-meal/:date",verifyJWT,getDateWiseUserMeal);
router.post("/create-meal",verifyJWT,createMeal);
router.put("/update-meal/:mealId",verifyJWT,updateMeal);
router.delete("/delete-meal/:mealId",verifyJWT,deleteMeal);
router.post("/log-meal/:mealId",verifyJWT,logMeal);

export default router 