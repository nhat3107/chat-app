import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import {
  createUserProfile,
  getUserProfileByEmail,
} from "./userprofile.service.js";
export const getAllFriends = async (userId) => {
  try {
    const user = await User.findUnique({
      where: { id: userId },
      select: { friendIds: true },
    });

    if (!user || !user.friendIds || user.friendIds.length === 0) {
      return [];
    }

    // Get the complete user objects for all friends
    const friends = await User.findMany({
      where: {
        id: {
          in: user.friendIds,
        },
      },
      include: {
        profile: {
          select: {
            username: true,
            imageUrl: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return friends;
  } catch (error) {
    console.error("Error fetching friends:", error);
    throw new Error("Could not fetch friends");
  }
};

export const getUserById = async (id) => {
  const user = await User.findUnique({
    where: { id },
    include: { profile: true },
  });

  if (!user) {
    throw new Error("User không tồn tại");
  }

  return user;
};

export const getProfileIdByUserId = async (userId) => {
  const user = await User.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!user || !user.profile) {
    throw new Error("Không tìm thấy hồ sơ người dùng");
  }

  return user.profile.id;
};

export const getUserProfileByUserId = async (userId) => {
  const user = await User.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  return user?.profile;
};

export const createUser = async ({
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
  const userProfile = await createUserProfile({
    email,
    password,
    phoneNumber,
    firstName,
    lastName,
    username,
    gender,
    dateOfBirth,
    imageUrl,
  });
  const user = await User.create({
    data: {
      profile: {
        connect: { id: userProfile.id },
      },
    },
  });
  return user;
};

export const findUserByEmailAndPassword = async (email, password) => {
  const userProfile = await getUserProfileByEmail(email);
  const isPasswordValid = await bcrypt.compare(password, userProfile.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }
  const user = await User.findUnique({
    where: { profileId: userProfile.id },
    include: { profile: true },
  });
  return user;
};

export const getUserByUsername = async (username) => {
  const user = await User.findFirst({
    where: { profile: { username } },
    include: { profile: true },
  });
  return user;
};
