import FriendRequest from "../models/friendRequest.model.js";
import UserProfile from "../models/userProfile.model.js";
import User from "../models/user.model.js";

export const sendFriendRequestService = async (senderId, receiverId) => {
  if (senderId === receiverId) {
    throw new Error("Cannot send friend request to yourself");
  }

  const sender = await User.findUnique({ where: { id: senderId } });

  if (sender.friendIds.includes(receiverId)) {
    throw new Error("You are already friends");
  }

  const existingRequest = await FriendRequest.findFirst({
    where: {
      OR: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    },
  });

  if (existingRequest) {
    throw new Error("Friend request already exists");
  }

  const senderProfile = await UserProfile.findUnique({
    where: { id: sender.profileId },
  });

  const senderUserName = "@" + senderProfile?.username || "Someone";

  const friendRequest = await FriendRequest.create({
    data: {
      senderId,
      receiverId,
      status: false,
      timeStamp: new Date(),
    },
  });

  return { friendRequest, senderUserName };
};

export const acceptFriendRequestService = async (receiverId, senderId) => {
  const request = await FriendRequest.findFirst({
    where: {
      senderId,
      receiverId,
      status: false,
    },
  });

  if (!request) throw new Error("Cannot find friend request");

  // Xóa friendRequest trong db
  await FriendRequest.delete({
    where: { id: request.id },
  });

  // Cập nhật friendIds cho cả 2
  const sender = await User.findUnique({ where: { id: senderId } });
  const receiver = await User.findUnique({ where: { id: receiverId } });

  await User.update({
    where: { id: senderId },
    data: {
      friendIds: {
        set: [...new Set([...sender.friendIds, receiverId])],
      },
    },
  });

  await User.update({
    where: { id: receiverId },
    data: {
      friendIds: {
        set: [...new Set([...receiver.friendIds, senderId])],
      },
    },
  });

  return true;
};

export const rejectFriendRequestService = async (receiverId, senderId) => {
  if (receiverId === senderId) {
    throw new Error("Cannot reject friend request from yourself");
  }

  // Tìm lời mời kết bạn đang chờ
  const request = await FriendRequest.findFirst({
    where: {
      senderId,
      receiverId,
      status: false,
    },
  });

  if (!request) {
    throw new Error("Cannot find friend request");
  }

  // Xoá lời mời
  await FriendRequest.delete({
    where: { id: request.id },
  });

  return true;
};

export const deleteFriendService = async (userId1, userId2) => {
  // Kiểm tra xem userId1 và userId2 có giống nhau không
  if (userId1 === userId2) {
    throw new Error("Không thể xoá chính mình");
  }

  // 1. Lấy user hiện tại
  const user1 = await User.findUnique({ where: { id: userId1 } });
  const user2 = await User.findUnique({ where: { id: userId2 } });

  if (!user1 || !user2) {
    throw new Error("Không tìm thấy người dùng");
  }

  // 2. Kiểm tra có là bạn bè không
  const areFriends =
    user1.friendIds.includes(userId2) && user2.friendIds.includes(userId1);

  if (!areFriends) {
    throw new Error("Hai người này không phải bạn bè");
  }

  // 3. Cập nhật lại friendIds: gỡ ID của nhau ra
  await User.update({
    where: { id: userId1 },
    data: {
      friendIds: {
        set: user1.friendIds.filter((id) => id !== userId2),
      },
    },
  });

  await User.update({
    where: { id: userId2 },
    data: {
      friendIds: {
        set: user2.friendIds.filter((id) => id !== userId1),
      },
    },
  });

  return true;
};
export const beingFriend = async (senderId, receiverId) => {
  const user1 = await User.findUnique({ where: { id: senderId } });
  const user2 = await User.findUnique({ where: { id: receiverId } });
  return (
    user1.friendIds.includes(receiverId) && user2.friendIds.includes(senderId)
  );
};
export const findFriendRequest = async (senderId, receiverId) => {
  const request = await FriendRequest.findFirst({
    where: { senderId, receiverId, status: false },
  });
  return request;
};

export const countFriendService = async (userId) => {
  const user = await User.findUnique({ where: { id: userId } });
  return user.friendIds.length;
};
