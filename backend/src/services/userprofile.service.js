import UserProfile from "../models/userProfile.model.js";
import { v2 as cloudinary } from "cloudinary";

/**
 * Cập nhật thông tin hồ sơ người dùng
 * @param {String} id
 * @param {Object} updateData
 */

export const updateUserProfileService = async (id, updateData) => {
  const updatedProfile = await UserProfile.update({
    where: { id },
    data: {
      ...updateData,
      dateOfBirth: updateData.dateOfBirth
        ? new Date(updateData.dateOfBirth)
        : undefined,
    },
  });

  return updatedProfile;
};

export const createUserProfile = async ({
  email,
  password,
  phoneNumber,
  firstName,
  lastName,
  username,
  gender,
  dateOfBirth,
  imageUrl,
}) => {
  const userProfile = await UserProfile.create({
    data: {
      email,
      password,
      phoneNumber,
      firstName,
      lastName,
      username,
      gender,
      dateOfBirth: new Date(dateOfBirth),
      imageUrl,
      dateRegistered: new Date(),
    },
  });
  return userProfile;
};

export const getUserProfileByEmail = async (email) => {
  const userProfile = await UserProfile.findUnique({
    where: { email },
  });
  return userProfile;
};

export const uploadProfileImage = async (image) => {
  const result = await cloudinary.uploader.upload(image, {
    folder: "profile",
  });
  return result.secure_url;
};

function extractPublicId(url) {
  const parts = url.split("/upload/")[1].split("/");
  const versionAndPath = parts.slice(1); // skip version
  const filename = versionAndPath.pop().split(".")[0]; // remove extension
  return [...versionAndPath, filename].join("/");
}
export const deleteProfileImage = async (imageUrl) => {
  const result = await cloudinary.uploader.destroy(extractPublicId(imageUrl));
  return result;
};
