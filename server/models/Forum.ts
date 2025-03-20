import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  author: Types.ObjectId;
  category: "recipe" | "tip" | "question";
  tags: string[];
  likes: Types.ObjectId[];
  images: string[];
}

// Mongoose Schema for Post
const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: {
      type: String,
      enum: ["recipe", "tip", "question"],
      required: true,
    },
    tags: [{ type: String }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    images:[{type: String}]
  },
  { timestamps: true }
);

export const Post = mongoose.model<IPost>("Post", postSchema);


export interface IComment extends Document {
    content: string;
    author: Types.ObjectId; 
    post: Types.ObjectId; 
    likes: Types.ObjectId[]; 
    createdAt: Date;
  }
  
  const commentSchema = new Schema<IComment>({
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
  });
  
  export const Comment = mongoose.model<IComment>("Comment", commentSchema);
