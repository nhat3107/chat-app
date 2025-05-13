import Notification from "../models/notification.model.js";

export const createNotification = async (userId, content) => {
  const notification = await Notification.create({
    data: {
      userId,
      content,
      timeStamp: new Date(),
      status: false, // false = chưa đọc
    },
  });

  return notification;
};

export const markAllSeen = async (userId) => {
  const notification = await Notification.updateMany({
    where: { userId },
    data: { status: true },
  });
  return notification;
};

export const getSeenNotificationByUserId = async (userId) => {
  const notification = await Notification.findMany({
    where: { userId, status: true },
  });
  return notification;
};

export const getUnseenNotificationByUserId = async (userId) => {
  const notification = await Notification.findMany({
    where: { userId, status: false },
  });
  return notification;
};

export const turnOnNotificationToBeSeen = async (notificationId) => {
  const notification = await Notification.update({
    where: { id: notificationId },
    data: { status: true },
  });
  return notification;
};
