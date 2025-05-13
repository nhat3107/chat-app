import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

const UserProfile = prisma.userProfile;

export default UserProfile;
