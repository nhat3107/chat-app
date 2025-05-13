import { blockUserService } from "../services/blockUser.service.js";

export const blockUser = async (req, res) => {
  try {
    const userId = req.user.id; // hoặc req.user.id nếu có auth
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({ message: "Missing ID of person to block" });
    }

    await blockUserService(userId, targetUserId);

    res.status(200).json({ message: "User blocked successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

