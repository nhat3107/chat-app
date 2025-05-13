import express from "express";
import {
  login,
  signup,
  logout,
  checkAuth,
  uploadUserImage,
} from "../controllers/auth.controller.js";

const authRouters = express.Router();
authRouters.post("/signup", signup);
authRouters.post("/login", login);
authRouters.post("/logout", logout);
authRouters.get("/check", checkAuth);
authRouters.post("/uploadUserImage", uploadUserImage);
export default authRouters;
