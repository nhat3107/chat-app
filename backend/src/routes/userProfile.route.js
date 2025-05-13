import express from "express";
import {
  updateUserprofile,
  getUserProfile,
  countFriend,
} from "../controllers/userProfile.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.put("/updateProfile", protectRoute, updateUserprofile);
router.get("/:id", protectRoute, getUserProfile);
router.get("/countFriend/:id", protectRoute, countFriend);
export default router;
