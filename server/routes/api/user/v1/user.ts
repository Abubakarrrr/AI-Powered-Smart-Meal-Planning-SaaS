import { createUserProfile,getUserProfile } from "@controllers/user.controller";
import { verifyJWT } from "@middlewares/auth";
import express from "express";
const router = express.Router();

router.post("/create-user-profile",verifyJWT,createUserProfile);
router.get("/get-user-profile",verifyJWT,getUserProfile);


export default router