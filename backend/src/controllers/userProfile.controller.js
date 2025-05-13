import { updateUserProfileService } from "../services/userprofile.service.js";
import { getUserProfileByUserId } from "../services/user.service.js";
import { deleteProfileImage } from "../services/userprofile.service.js";
import { countFriendService } from "../services/friendRequest.service.js";

export const updateUserprofile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await getUserProfileByUserId(userId);

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      imageUrl,
      dateOfBirth,
    } = req.body;

    const imageOldUrl = req.user.profile.imageUrl;
    if (imageUrl === "") {
      imageUrl = imageOldUrl;
    }
    if (imageOldUrl) {
      if (imageOldUrl !== imageUrl) {
        const result = await deleteProfileImage(imageOldUrl);
        console.log("result", result);
      }
    }

    const updateData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      imageUrl,
      dateOfBirth,
    };
    const updatedProfile = await updateUserProfileService(
      profile.id,
      updateData
    );

    res.status(200).json({
      message: "Update profile successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Error update profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUserProfile = async (req, res) => {
  const userId = req.params.id;
  const profile = await getUserProfileByUserId(userId);
  res.status(200).json(profile);
};
export const countFriend = async (req, res) => {
  const userId = req.params.id;
  const count = await countFriendService(userId);
  res.status(200).json(count);
};
