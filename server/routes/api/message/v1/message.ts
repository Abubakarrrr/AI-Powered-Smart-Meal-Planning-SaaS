import { getMessages, getUsersForSidebar, sendMessages } from "@controllers/message.controller";
import { verifyJWT } from "@middlewares/auth";
import express from "express";
const router = express.Router();

router.get("/users",verifyJWT,getUsersForSidebar);
router.get("/getMessages/:id",verifyJWT,getMessages);
router.post("/send/:id",verifyJWT,sendMessages)

export default router