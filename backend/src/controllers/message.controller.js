import { getAllFriends } from "../services/user.service.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { FindChatLogByUsers } from "../services/chatLog.service.js";
import { createMessage } from "../services/message.service.js";
import { createChatLog } from "../services/chatLog.service.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const friends = await getAllFriends(loggedInUserId);

    // Since getAllFriends now returns an array of user objects,
    // we can return it directly or with additional metadata
    res.status(200).json({
      users: friends,
    });
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from request parameters
    const loggedInUserId = req.user.id; // Get the logged-in user's ID from the request object

    // Find the chat log between the logged-in user and the specified user
    let chatLog = await FindChatLogByUsers(loggedInUserId, userId);
    let newChatLog;
    if (!chatLog) {
      newChatLog = await createChatLog(loggedInUserId, userId);
      chatLog = newChatLog;
    }

    res.status(200).json(chatLog);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const sendMessage = async (req, res) => {
  try {
    const { content, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.id;
    const chatLog = await FindChatLogByUsers(senderId, receiverId);
    if (!chatLog) {
      return res.status(404).json({ error: "Chat log not found" });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const messageData = {
      content: content || "",
      image: imageUrl || "",
      senderId: senderId,
      timeStamp: new Date(),
      chatLogId: chatLog.id,
    };
    const newMessage = await createMessage(messageData);
    if (!newMessage) {
      return res.status(500).json({ error: "Failed to create message" });
    }

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
