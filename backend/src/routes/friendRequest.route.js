import express from "express";
import { sendFriendRequest } from "../controllers/friendRequest.controller.js";
import { acceptFriendRequest } from "../controllers/friendRequest.controller.js";
import { deleteFriend } from "../controllers/friendRequest.controller.js";
import { rejectFriendRequest } from "../controllers/friendRequest.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { check } from "../controllers/friendRequest.controller.js";

const router = express.Router();

router.post("/send", protectRoute, sendFriendRequest);
router.patch("/accept", protectRoute, acceptFriendRequest);
router.delete("/reject", protectRoute, rejectFriendRequest);
router.delete("/delete", protectRoute, deleteFriend);
router.get("/check", protectRoute, check);
export default router;
