import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  senderId: Schema.Types.ObjectId;
  receiverId: Schema.Types.ObjectId;
  text?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Message = mongoose.model<IMessage>("Message", MessageSchema);
export default Message;
