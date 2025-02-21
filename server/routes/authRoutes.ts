import express from "express";
import { signup,login,logout,uploadAvatar,deleteAvatar } from "@controllers/authControllers";
import {verifyJWT} from "@middlewares/authMiddleware"
import { loginWithGoogle } from "@controllers/loginWithGoogle";
const router = express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",verifyJWT,logout);
router.post("/upload-avatar",uploadAvatar);
router.post("/delete-avatar",deleteAvatar);
router.post("/google",loginWithGoogle);


export default router