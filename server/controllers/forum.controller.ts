import { Request, Response } from "express";
import { ParsedQs } from "qs";
import { Comment, Post } from "@models/Forum";
import { IUser } from "@models/User";

interface RequestWithUser<T = ParsedQs> extends Request<{}, {}, {}, T> {
  user?: IUser;
}
interface ForumQuery {
  category?: string;
  tag?: string;
  sort?: string;
}
export const getForumPosts = async (
  req: RequestWithUser<ForumQuery>,
  res: Response
) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { category, tag, sort = "newest" } = req.query;
    let sortOption = {};
    if (sort === "newest") sortOption = { createdAt: -1 };
    if (sort === "popular") sortOption = { "likes.length": -1 };

    let query: Record<string, any> = {};
    if (category) query.category = category;
    if (tag) query.tags = tag;

    const posts = await Post.find(query)
      .sort(sortOption)
      .populate("author", "name avatar")
      .lean();

    // Add currentUser flag to likes for frontend
    const userId = req.user?._id;
    const postsWithUserLikes = posts.map((post) => ({
      ...post,
      likes: post.likes.map((like) =>
        like.toString() === userId?.toString()
          ? "current-user"
          : like.toString()
      ),
    }));
    console.log(postsWithUserLikes);

    res.status(200).json({
      success: true,
      message: "Fetched all posts",
      posts: postsWithUserLikes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};




export const getSinglePost = async (req: RequestWithUsers, res: Response) => {
  try {
    if (!req.user) {
       res.status(401).json({ success: false, message: "Unauthorized" });
       return;
    }

    const post = await Post.findById(req.params.id).populate("author", "name avatar");

    if (!post) {
       res.status(404).json({ success: false, message: "Post not found" });
       return;
    }

    const comments = await Comment.find({ post: req.params.id })
      .populate("author", "name avatar")
      .sort({ createdAt: -1 })
      .lean();

    const userId = req.user?._id;
    const postResponse = {
      ...post.toObject(),
      likes: post.likes.map((like) =>
        like.toString() === userId?.toString()
          ? "current-user"
          : like.toString()
      ),
      comments, 
    };
    console.log(postResponse)

    res.json({ post: postResponse });

  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
    

interface RequestWithUsers extends Request {
  user?: IUser;
}

export const createNewPost = async (req: RequestWithUsers, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const { title, content, category, tags } = req.body;

    const newPost = new Post({
      title,
      content,
      author: req.user.id,
      category,
      tags,
    });

    await newPost.save();
    const populatedPost = await Post.findById(newPost._id).populate(
      "author",
      "name avatar"
    );

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addCommentToPost = async (
  req: RequestWithUsers,
  res: Response
) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const { content } = req.body;
    const newComment = new Comment({
      content,
      author: req.user.id,
      post: req.params.id,
    });

    await newComment.save();

    const populatedComment = await Comment.findById(newComment._id).populate(
      "author",
      "name avatar"
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleLike = async (req: RequestWithUsers, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const userLikedIndex = post.likes.indexOf(req.user.id);

    if (userLikedIndex > -1) {
      // Unlike
      post.likes.splice(userLikedIndex, 1);
    } else {
      // Like
      post.likes.push(req.user.id);
    }

    await post.save();

    res.json({ likes: post.likes.length, userLiked: userLikedIndex === -1 });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
