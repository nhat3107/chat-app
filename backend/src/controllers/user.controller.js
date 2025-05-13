import { getUserByUsername } from "../services/user.service.js";

export const searchUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await getUserByUsername(username);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error search user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
