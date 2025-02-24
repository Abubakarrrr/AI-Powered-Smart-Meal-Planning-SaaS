import express from "express";
import { signup,login,logout,uploadAvatar,deleteAvatar,loginWithGoogle, verifyEmail, forgotPassword, resetPassword } from "@controllers/auth.controller";
import {verifyJWT} from "@middlewares/auth"
const router = express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",verifyJWT,logout);
router.post("/upload-avatar",uploadAvatar);
router.post("/delete-avatar",deleteAvatar);
router.post("/google",loginWithGoogle);
router.post("/verify-email",verifyEmail);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password",resetPassword);


export default router