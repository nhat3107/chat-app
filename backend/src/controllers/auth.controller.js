import { createUser } from "../services/user.service.js";
import { getUserProfileByEmail } from "../services/userprofile.service.js";
import {
  findUserByEmailAndPassword,
  getUserById,
} from "../services/user.service.js";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/utils.js";
import { uploadProfileImage } from "../services/userprofile.service.js";

export const signup = async (req, res) => {
  let {
    email,
    password,
    phoneNumber,
    firstName,
    lastName,
    username,
    gender,
    dateOfBirth,
    imageUrl,
  } = req.body;
  password = await bcrypt.hash(password, 10);
  try {
    const userProfile = await getUserProfileByEmail(email);
    if (userProfile) {
      return res.status(400).json({ message: "Email is already existed" });
    }
    const userWithOutProfile = await createUser({
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
    if (!userWithOutProfile) {
      return res.status(400).json({ message: "Failed to create user" });
    }
    const user = await getUserById(userWithOutProfile.id);
    const token = generateToken(user.id, res);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmailAndPassword(email, password);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = generateToken(user.id, res);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const uploadUserImage = async (req, res) => {
  const { image } = req.body;
  const imageUrl = await uploadProfileImage(image);
  res.status(200).json({ imageUrl });
};
