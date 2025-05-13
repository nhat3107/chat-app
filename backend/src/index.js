import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userProfileRoutes from "./routes/userProfile.route.js";
import friendRequestRoutes from "./routes/friendRequest.route.js";
import blockRoutes from "./routes/block.route.js";
import notificationRoutes from "./routes/notification.route.js";
import userRoutes from "./routes/user.route.js";
import { app, server } from "./lib/socket.js";
import path from "path";
dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/userProfile", userProfileRoutes);
app.use("/api/friendRequest", friendRequestRoutes);
app.use("/api/blockOtherUser", blockRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/user", userRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
});
