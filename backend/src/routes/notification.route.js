import { Router } from "express";
import {
  seenNotification,
  unseenNotification,
  markAllAsRead,
  seenOneNotification,
} from "../controllers/notification.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const notificationRouter = Router();

notificationRouter.get("/seen", protectRoute, seenNotification);
notificationRouter.get("/unseen", protectRoute, unseenNotification);
notificationRouter.put("/seen/:id", protectRoute, seenOneNotification);
notificationRouter.put("/markAllSeen", protectRoute, markAllAsRead);

export default notificationRouter;
