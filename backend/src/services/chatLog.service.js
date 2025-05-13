import ChatLog from "../models/chatLog.model.js";

export const FindChatLogByUsers = async (userId1, userId2) => {
  try {
    const chatLog = await ChatLog.findFirst({
      where: {
        userIds: {
          hasEvery: [userId1, userId2], // Ensure both user IDs are present
        },
      },
      include: {
        messages: true,
      },
    });

    return chatLog;
  } catch (error) {
    console.error("Error fetching chat log:", error);
    throw new Error("Could not fetch chat log");
  }
};

export const createChatLog = async (userId1, userId2) => {
  try {
    const chatLog = await ChatLog.create({
      data: {
        userIds: [userId1, userId2],
        users: {
          connect: [{ id: userId1 }, { id: userId2 }],
        },
      },
    });
    return chatLog;
  } catch (error) {
    console.error("Error creating chat log:", error);
    throw new Error("Could not create chat log");
  }
};
