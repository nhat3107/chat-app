import Message from "../models/message.model.js";

export const createMessage = async ({
  content,
  image,
  senderId,
  chatLogId,
}) => {
  try {
    return await Message.create({
      data: {
        content: content || "",
        image: image || "",
        senderID: senderId,
        timeStamp: new Date(),
        chatLog: {
          connect: {
            id: chatLogId,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error creating message:", error.message);
    throw error;
  }
};
