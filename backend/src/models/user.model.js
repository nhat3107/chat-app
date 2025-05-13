import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();
const User = prisma.user;

export default User;
