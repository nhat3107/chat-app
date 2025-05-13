import { sendFriendRequestService } from "../services/friendRequest.service.js";
import { createNotification } from "../services/notification.service.js";
import { acceptFriendRequestService } from "../services/friendRequest.service.js";
import { deleteFriendService } from "../services/friendRequest.service.js";
import { getUserProfileByUserId } from "../services/user.service.js";
import {
  rejectFriendRequestService,
  findFriendRequest,
  beingFriend,
} from "../services/friendRequest.service.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId } = req.body;

    const { friendRequest, senderUserName } = await sendFriendRequestService(
      senderId,
      receiverId
    );
    const content = `${senderUserName} sent you a friend request.`;
    await createNotification(receiverId, content); //gọi notification service để tạo thông báo

    res.status(200).json({
      message: "Friend request sent",
      data: friendRequest,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const receiverId = req.user.id; // giả định là user đã login
    const { senderId } = req.body;

    if (!senderId)
      return res.status(400).json({ message: "Missing sender ID" });

    await acceptFriendRequestService(receiverId, senderId);

    // Lấy tên người nhận để tạo thông báo
    const receiverProfile = await getUserProfileByUserId(receiverId);
    const receiverUserName = "@" + receiverProfile?.username || "Someone";

    const content = `${receiverUserName} accepted your friend request.`;

    // Gửi thông báo cho người gửi
    await createNotification(senderId, content);

    res.status(200).json({ message: "Accept friend request successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const receiverId = req.user.id; // giả định là user đã login
    const { senderId } = req.query;

    if (!senderId) {
      return res.status(400).json({ message: "Missing sender ID" });
    }

    await rejectFriendRequestService(receiverId, senderId);

    res.status(200).json({ message: " Rejected friend request" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteFriend = async (req, res) => {
  try {
    const userId = req.user.id; // hoặc lấy từ req.user.id nếu có auth
    const { targetId } = req.query;

    if (!targetId) {
      return res
        .status(400)
        .json({ message: "Missing ID of person to delete" });
    }

    await deleteFriendService(userId, targetId);

    res.status(200).json({ message: "Deleted friend successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const check = async (req, res) => {
  try {
    const userId = req.user.id;
    const { userId: checkUserId } = req.query;
    let isFriend = false;
    let isReceiver = false;
    let status = null;
    let isSender = false;
    const receivedRequest = await findFriendRequest(checkUserId, userId);
    if (receivedRequest) {
      isReceiver = true;
      status = receivedRequest.status;
    }
    const sentRequest = await findFriendRequest(userId, checkUserId);
    if (sentRequest) {
      isSender = true;
      status = sentRequest.status;
    }
    isFriend = await beingFriend(checkUserId, userId);
    res.status(200).json({ isFriend, isReceiver, isSender, status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
