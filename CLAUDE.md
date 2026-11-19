# QuantAI — Claude Code Agent Instructions

**Author:** `yuva.devlab@gmail.com`  
**Master Specification:** [AGENTS.md](./AGENTS.md) | [docs/INDEX.md](./docs/INDEX.md)

---

## 1. Commands

- **Development Server**: `pnpm dev --port 3005`
- **Type Checking**: `pnpm typecheck` (`tsc --noEmit`)
- **Linting**: `pnpm lint` (`eslint .`)
- **Formatting**: `pnpm format` / `pnpm format:check`
- **Unit & Integration Tests**: `pnpm test` (`vitest run`)
- **Production Build**: `pnpm build` (Client + SSR bundles)

---

## 2. Strict Invariants

1. **No Commits/Pushes**: Do not execute `git commit` or `git push` unless the user explicitly asks.
2. **Platform CSS Only**: Use `@yuva-devlab/tokens` and CSS layers (`@layer dl-*`). No utility CSS frameworks.
3. **Line Limit**: Every file must be `< 250 lines`. Break into sub-components at 200 lines.
4. **JSDoc**: 100% of exported symbols must have JSDoc comments.
5. **No Hardcoded Strings**: All UI copy lives in `src/lib/ui-copy/`.
6. **Enums First**: Use TypeScript `enum`s for statuses, routes, and query parameters (`src/constants/`).
