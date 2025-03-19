import { addCommentToPost, createNewPost, getForumPosts, getSinglePost, toggleLike } from "@controllers/forum.controller";
import { verifyJWT } from "@middlewares/auth";
import express from "express";
const router = express.Router();

//get all post
router.get("/posts",verifyJWT,getForumPosts);
//get single post with comments
router.get("/post/:id",verifyJWT,getSinglePost);
//create new post
router.post('/create-post',verifyJWT,createNewPost)
//add comment to post 
router.post("/comment/:id",verifyJWT,addCommentToPost)
//toggle like
router.post("/toggle-like/:id",verifyJWT,toggleLike)

export default router 