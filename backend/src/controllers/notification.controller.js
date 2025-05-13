import {
  getSeenNotificationByUserId,
  getUnseenNotificationByUserId,
  markAllSeen,
  turnOnNotificationToBeSeen,
} from "../services/notification.service.js";

export const seenOneNotification = async (req, res) => {
  const id = req.user.id;
  const notificationId = req.params.id;
  const notification = await turnOnNotificationToBeSeen(notificationId);  
  res.status(200).json(notification);
};
export const seenNotification = async (req, res) => {
  const id = req.user.id;
    const notification = await getSeenNotificationByUserId(id);
    res.status(200).json(notification);
};

export const unseenNotification = async (req, res) => {
  const id = req.user.id;
  const notification = await getUnseenNotificationByUserId(id);
  res.status(200).json(notification);
};

export const markAllAsRead = async (req, res) => {
  const id = req.user.id;
  const notification = await markAllSeen(id);
  res.status(200).json(notification);
};
