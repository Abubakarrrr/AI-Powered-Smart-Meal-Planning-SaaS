import { createMeal } from "@controllers/meal.controller";
import { verifyJWT } from "@middlewares/auth";
import express from "express";
const router = express.Router();

router.post("/create-meal",verifyJWT,createMeal);

export default router