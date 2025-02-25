import { createUser, getAllUsers,updateUser,deleteUser } from "@controllers/admin.controller";
import express from "express";
// import {verifyJWT} from "@middlewares/auth"
const router = express.Router();

router.get("/get-all-users",getAllUsers);
router.post("/create-user",createUser);
router.delete("/delete-user/:userId",deleteUser);
router.put("/update-user/:userId",updateUser);

export default router