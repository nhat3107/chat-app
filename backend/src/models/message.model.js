import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

const Message = prisma.message;

export default Message;
