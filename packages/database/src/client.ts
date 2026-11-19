/**
 * @fileoverview Prisma client factory decoupled from runtime process.env.
 * @author yuva.devlab@gmail.com
 */

import { PrismaClient } from "@prisma/client";

/**
 * Creates an isolated, type-safe PrismaClient connected to the provided database URL.
 * Adheres strictly to the NPM Package Environment Isolation rule (never reads process.env directly).
 *
 * @param databaseUrl Validated PostgreSQL connection string
 * @returns Initialized PrismaClient instance
 */
export function createPrismaClient(databaseUrl: string): PrismaClient {
  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: ["warn", "error"],
  });
}

export type { PrismaClient };
