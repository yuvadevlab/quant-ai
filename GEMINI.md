# QuantAI — Google Antigravity & Gemini Agent Instructions

**Author:** `yuva.devlab@gmail.com`  
**Master Standards:** See [AGENTS.md](./AGENTS.md) and [docs/INDEX.md](./docs/INDEX.md)

---

## 1. Antigravity Invariants & Safe Execution

1. **Mandatory Git Invariant**:
   - **NEVER** run `git commit`, `git push`, or open a pull request without explicit user instruction in the current turn.
   - Always leave changes in the working tree/staged and present verification outcomes.

2. **Styling & Design System**:
   - Strictly platform CSS with W3C Cascade Layers (`@layer dl-tokens`, `@layer dl-components`, `@layer dl-utilities`) and `@yuva-devlab/tokens`.
   - Never reference or introduce utility-first CSS frameworks.

3. **Modularity & 250-Line Limit**:
   - All source files (`.ts`, `.tsx`, `.css`) in `src/` must remain under **250 lines of code**. Deconstruct at 200 lines.
   - 100% comprehensive JSDoc coverage on all exported functions, components, interfaces, and enums.

4. **Zero Hardcoded Strings**:
   - All user-visible strings must be imported from `src/lib/ui-copy/*.copy.ts`.
   - All state codes, routes, and identifiers must use TypeScript enums in `src/constants/`.

---

## 2. Verification Protocol

After creating or modifying code, execute in sequence:

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm build
```

When UI layout changes occur, verify live using the `browser` subagent on `http://localhost:3005`.
