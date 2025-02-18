import express from "express";
import { signup,login } from "@controllers/authControllers";
const router = express.Router();

router.post("/signup",signup);
router.post("/login",login);

// router.get("/check-auth", verifyToken, checkAuth);

export default router