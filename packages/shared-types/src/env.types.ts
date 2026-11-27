/**
 * @fileoverview Type definitions for validated environment configurations.
 */

import type { z } from "zod";
import type {
  ApiEnvironmentSchema,
  WebEnvironmentSchema,
  QuantEngineEnvironmentSchema,
} from "./env.schema";

/**
 * Validated API Gateway environment configuration.
 */
export type ApiEnvironment = z.infer<typeof ApiEnvironmentSchema>;

/**
 * Validated Next.js / Vite web workstation environment configuration.
 */
export type WebEnvironment = z.infer<typeof WebEnvironmentSchema>;

/**
 * Validated Python quantitative analytics engine environment configuration.
 */
export type QuantEngineEnvironment = z.infer<typeof QuantEngineEnvironmentSchema>;
