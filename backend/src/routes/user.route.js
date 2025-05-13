import express from "express";
import {
  searchUserByUsername,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const UserRouter = express.Router();


UserRouter.get("/search/:username", protectRoute, searchUserByUsername);

export default UserRouter;
