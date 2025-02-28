import { createUserProfile } from "@controllers/user.controller";
import { verifyJWT } from "@middlewares/auth";
import express from "express";
const router = express.Router();

router.post("/create-user-profile",verifyJWT,createUserProfile);


export default router