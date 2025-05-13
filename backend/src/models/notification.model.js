import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

const Notification = prisma.notification;

export default Notification;