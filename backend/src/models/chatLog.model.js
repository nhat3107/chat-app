import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

const ChatLog = prisma.chatLog;

export default ChatLog;
