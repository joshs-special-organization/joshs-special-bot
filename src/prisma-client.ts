import { PrismaClient } from '@prisma/client';

/**
 * The below code is taken from:
 *
 * https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections#prismaclient-in-long-running-applications
 *
 * This ensures only ONE instance of prisma exists, even across hot-reloads
 * from tsx.
 */

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma