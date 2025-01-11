import { PrismaClient } from "@prisma/client";
const prismaSingleton = () => new PrismaClient();

const globalPrisma = global as unknown as { prisma: PrismaClient | undefined };
const prisma = globalPrisma.prisma ?? prismaSingleton();
export default prisma;


