import { PrismaClient } from "@prisma/client";

// Reaproveita o client em dev para não esgotar conexões no hot reload.
const g = globalThis as unknown as { prisma?: PrismaClient };
export const db = g.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") g.prisma = db;

export const temBanco = () => !!process.env.DATABASE_URL;
