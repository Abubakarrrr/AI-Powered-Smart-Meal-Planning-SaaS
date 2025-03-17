import { getForumPosts, getSingleForum } from "@controllers/forum.controller";
import { verifyJWT } from "@middlewares/auth";
import express from "express";
const router = express.Router();

router.get("/",verifyJWT,getForumPosts);
router.get("/:id",verifyJWT,getSingleForum);
export default router 