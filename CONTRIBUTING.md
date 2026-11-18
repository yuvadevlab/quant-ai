# Contributing to QuantAI

**Author & Maintainer:** `yuva.devlab@gmail.com`

---

## 1. Branching & Commit Conventions

- **Branch Naming**: Must conform strictly to `^(feat|fix|refactor|perf|chore|docs|test|ci|hotfix)/[a-z0-9-]+$`
  - _Example_: `feat/prediction-lab-evaluation-engine`, `fix/sparkline-svg-bounds`
- **Conventional Commits**: All commit messages must follow the standard:
  ```
  <type>(<scope>): <subject>
  ```
  - _Allowed Scopes_: `workspace`, `layout`, `shell`, `overview`, `predictions`, `monitor`, `screener`, `portfolio`, `chat`, `settings`, `services`, `tokens`, `ui`, `deps`, `docs`, `ci`.
  - Verified automatically by `commitlint.config.ts`.
- **Git Attribution**: All commits must use `yuva.devlab@gmail.com`.
- **Commit Invariant**: Never commit or push without explicit user instruction.

---

## 2. Code Quality & Architectural Standards

1. **Modularity**: Every source file (`.ts`, `.tsx`, `.css`) in `src/` must remain under **250 lines of code**. Deconstruct at 200 lines.
2. **JSDoc**: 100% of exported symbols must be documented with comprehensive JSDoc.
3. **Pure Platform CSS**: Use W3C Cascade Layers (`@layer dl-*`) and `@yuva-devlab/tokens`. Utility CSS frameworks are prohibited.
4. **Zero Hardcoded Strings**: All UI copy must be defined in `src/lib/ui-copy/`.
5. **Enums Over Raw String Unions**: Define state and route constants in `src/constants/`.

---

## 3. Pre-PR Verification Checklist

Before opening a pull request, run:

```bash
pnpm lint          # ESLint 0 errors, 0 warnings
pnpm format:check  # Prettier 100% formatted
pnpm typecheck     # TypeScript 0 errors
pnpm test          # Vitest suite passing
pnpm build         # Client & SSR bundles compiled
```
