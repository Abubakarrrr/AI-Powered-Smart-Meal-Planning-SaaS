import { getReceiverSocketId, io } from "@lib/socket";
import Message from "@models/Message";
import User, { IUser } from "@models/User";
import { Response, Request } from "express";
import cloudinary from "lib/cloudinary";

interface RequestWithUser extends Request {
  user?: IUser;
}
export const getUsersForSidebar = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    if (!req.user) {
      res.status(400).json({ success: false, message: "No such user" });
      return;
    }
    const userId = req.user._id;
    // in filter add role = nutritionist so user can chat with nutritionist only
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "_id name email role avatar"
    );

    res.status(201).json({
      success: true,
      message: "users fetched successfully",
      users:filteredUsers,
    });
    return;
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getMessages = async (req: RequestWithUser, res: Response) => {
  try {
    if (!req.user) {
      res.status(400).json({ success: false, message: "No such user" });
      return;
    }
    const myId = req.user._id;
    const { id: userToChatId } = req.params;
    const messages = await Message.find({
      $or: [
        {
          senderId: myId,
          receiverId: userToChatId,
        },
        {
          senderId: userToChatId,
          receiverId: myId,
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "messages fetched successfully",
      messages,
    });
    return;
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const sendMessages = async (req: RequestWithUser, res: Response) => {
  try {
    if (!req.user) {
      res.status(400).json({ success: false, message: "No such user" });
      return;
    }
    const senderId = req.user._id;
    const { id: receiverId } = req.params;
    const { text, image } = req.body;
    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image:imageUrl
    })
    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }


    res.status(201).json({
      success: true,
      message: "messages send successfully",
      data:newMessage
    });
    return;
  } catch (error) {
    console.error("Error in sending message:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
