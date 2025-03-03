import { createMeal,getDateWiseUserMeal } from "@controllers/meal.controller";
import { verifyJWT } from "@middlewares/auth";
import express from "express";
const router = express.Router();

router.get("/get-datewise-user-meal/:date",verifyJWT,getDateWiseUserMeal);
router.post("/create-meal",verifyJWT,createMeal);

export default router