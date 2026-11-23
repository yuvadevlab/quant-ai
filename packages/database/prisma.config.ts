/**
 * @file packages/database/prisma.config.ts
 * @description Prisma 7 configuration file for database migrations and schema tooling.
 * @author yuva.devlab@gmail.com
 */

import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "prisma/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Single Source of Truth: load from candidate .env paths
const candidatePaths = [
  path.resolve(__dirname, "../../apps/api/.env"),
  path.resolve(__dirname, "../../.env"),
  path.resolve(__dirname, ".env"),
];

for (const envPath of candidatePaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: false });
    break;
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/quantai",
  },
});
