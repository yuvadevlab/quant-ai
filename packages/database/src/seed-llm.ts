/**
 * @file packages/database/src/seed-llm.ts
 * @description Database seeder function registering AI model providers and LLM models with deprecation history.
 */

import type { PrismaClient } from "@prisma/client";
import { PROVIDER_SEEDS } from "./seed-llm-data.js";

/**
 * Seeds or updates registered LLM providers and models idempotently.
 * Preserves audit history by tracking deprecations in the database rather than deleting.
 *
 * @param prisma - Active PrismaClient instance.
 */
export async function seedLlmProvidersAndModels(prisma: PrismaClient): Promise<void> {
  for (const providerDef of PROVIDER_SEEDS) {
    const provider = await prisma.llmProvider.upsert({
      where: { slug: providerDef.slug },
      update: {
        name: providerDef.name,
        providerType: providerDef.providerType,
        description: providerDef.description,
        baseUrl: providerDef.baseUrl ?? null,
        isEnabled: providerDef.isEnabled,
        sortOrder: providerDef.sortOrder,
      },
      create: {
        name: providerDef.name,
        slug: providerDef.slug,
        providerType: providerDef.providerType,
        description: providerDef.description,
        baseUrl: providerDef.baseUrl ?? null,
        isEnabled: providerDef.isEnabled,
        sortOrder: providerDef.sortOrder,
      },
    });

    for (const modelDef of providerDef.models) {
      await prisma.llmModel.upsert({
        where: {
          providerId_modelIdentifier: {
            providerId: provider.id,
            modelIdentifier: modelDef.modelIdentifier,
          },
        },
        update: {
          name: modelDef.name,
          description: modelDef.description,
          contextWindow: modelDef.contextWindow,
          isDefault: modelDef.isDefault,
          isEnabled: modelDef.isEnabled,
          isDeprecated: modelDef.isDeprecated,
          deprecatedAt: modelDef.deprecatedAt ?? null,
          deprecationNote: modelDef.deprecationNote ?? null,
          sortOrder: modelDef.sortOrder,
          capabilities: modelDef.capabilities as never,
        },
        create: {
          providerId: provider.id,
          name: modelDef.name,
          modelIdentifier: modelDef.modelIdentifier,
          description: modelDef.description,
          contextWindow: modelDef.contextWindow,
          isDefault: modelDef.isDefault,
          isEnabled: modelDef.isEnabled,
          isDeprecated: modelDef.isDeprecated,
          deprecatedAt: modelDef.deprecatedAt ?? null,
          deprecationNote: modelDef.deprecationNote ?? null,
          sortOrder: modelDef.sortOrder,
          capabilities: modelDef.capabilities as never,
        },
      });
    }
  }
}
