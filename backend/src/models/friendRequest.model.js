import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

const FriendRepuest = prisma.friendRequest;

export default FriendRepuest;