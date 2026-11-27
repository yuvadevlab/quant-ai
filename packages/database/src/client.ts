/**
 * @file packages/database/src/client.ts
 * @description Prisma client factory using PostgreSQL driver adapter or Accelerate URL.
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

/**
 * Options for initializing the Prisma client.
 */
export interface CreatePrismaClientOptions {
  /** Database connection string for driver adapter */
  readonly databaseUrl?: string;
  /** Optional Accelerate connection URL */
  readonly accelerateUrl?: string;
}

/**
 * Creates an isolated, type-safe PrismaClient connected via driver adapter or accelerateUrl.
 * Adheres strictly to the NPM Package Environment Isolation rule (never reads process.env directly).
 *
 * @param connection Target connection string or configuration options
 * @returns Initialized PrismaClient instance
 */
export function createPrismaClient(connection: string | CreatePrismaClientOptions): PrismaClient {
  if (typeof connection === "object" && connection.accelerateUrl) {
    return new PrismaClient({
      accelerateUrl: connection.accelerateUrl,
      log: ["warn", "error"],
    });
  }

  const databaseUrl = typeof connection === "string" ? connection : connection.databaseUrl;

  const pool = new pg.Pool({ connectionString: databaseUrl });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: ["warn", "error"],
  });
}

export type { PrismaClient };
