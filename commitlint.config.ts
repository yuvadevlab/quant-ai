import type { UserConfig } from "@commitlint/types";

/**
 * Commitlint Configuration — Yuva DevLab - QuantAI
 *
 * Enforces Conventional Commits specification:
 * https://www.conventionalcommits.org
 *
 * Format:
 *   <type>(<scope>): <subject>
 */

const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],

  rules: {
    // ─── Type ────────────────────────────────────────────────────────────────
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "perf",
        "refactor",
        "style",
        "test",
        "docs",
        "build",
        "ci",
        "chore",
        "revert",
      ],
    ],

    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],

    // ─── Scope ────────────────────────────────────────────────────────────────
    "scope-empty": [2, "never"],
    "scope-case": [2, "always", "kebab-case"],
    "scope-enum": [
      1,
      "always",
      [
        // Feature Domains
        "overview",
        "predictions",
        "monitor",
        "screener",
        "portfolio",
        "copilot",
        "settings",

        // Systems & Presentation
        "layout",
        "tokens",
        "ui",
        "copy",
        "services",
        "constants",

        // Tooling & Infra
        "deps",
        "eslint",
        "prettier",
        "commitlint",
        "tsconfig",
        "vite",
        "nitro",
      ],
    ],

    // ─── Subject ─────────────────────────────────────────────────────────────
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "subject-min-length": [2, "always", 8],
    "subject-max-length": [2, "always", 100],

    // ─── Header ──────────────────────────────────────────────────────────────
    "header-max-length": [2, "always", 100],

    // ─── Body & Footer ───────────────────────────────────────────────────────
    "body-leading-blank": [2, "always"],
    "body-max-line-length": [2, "always", 100],
    "footer-leading-blank": [2, "always"],
    "footer-max-line-length": [2, "always", 100],
  },
};

export default config;
