# QuantAI Workstation — AI Agent Guidelines & Architecture Index

> **FOR ALL AI ASSISTANTS (Antigravity, GitHub Copilot, Claude Code):**
> This repository enforces the **Yuva DevLab Big Tech Standard**. Master invariants, architecture boundaries, and code standards are defined below. Adherence is mandatory with zero exceptions.

---

## 1. Universal Core Invariants (Zero Exceptions)

0. **Zero Commits Without Explicit Confirmation (CRITICAL)**:
   - **NEVER** execute `git commit`, `git push`, or open pull requests in ANY repository unless the user explicitly commands it in the current turn (e.g. "commit these changes", "commit and push").
   - Directives like "start", "proceed", "fix this", "implement", "build", or "test" authorize implementation, building, and running tests ONLY.
   - Always leave changes staged or in the working tree, present verification results, and wait for explicit confirmation.

1. **Organization Standards & Attribution**:
   - Standardize all author and committer attribution to `yuva.devlab@gmail.com`.
   - Branch naming must strictly follow: `^(feat|fix|refactor|perf|chore|docs|test|ci|hotfix)/[a-z0-9-]+$`.
   - Commits must conform to Conventional Commits: `<type>(<scope>): <subject>` verified by Commitlint.

2. **Strict Utility Framework Prohibition**:
   - Do **NOT** mention or reference legacy utility-first CSS frameworks anywhere in code, comments, documentation, commit messages, or responses.
   - All styling must be written using pure platform CSS, W3C Cascade Layers (`@layer dl-tokens`, `@layer dl-components`, `@layer dl-utilities`), and `@yuva-devlab/tokens`.

3. **Hard 250-Line Maximum Rule**:
   - **NO** file across `src/` may exceed **250 lines of code**.
   - Whenever a file approaches or reaches **200 lines**, decompose it immediately into focused sub-components or services.

4. **100% Comprehensive JSDoc Documentation**:
   - Comprehensive JSDoc comments are **mandatory** for 100% of exported symbols (functions, components, interfaces, types, and constants).

5. **Zero Hardcoded Strings & Centralized UI Copy**:
   - Zero hardcoded user-facing strings in UI components.
   - All labels, tooltips, error banners, placeholders, column titles, and disclaimer text must be centralized in `src/lib/ui-copy/`.

6. **Enums Over Raw String Unions (Change-Resilience)**:
   - Avoid declaring types as raw string literal unions (e.g., `type Status = "Active" | "Target hit"`).
   - Always declare TypeScript `enum`s in `src/constants/` (e.g., `SignalStatus.ACTIVE`, `SignalDirection.LONG`, `MarketIndex.NIFTY_50`).

7. **Centralized Route Paths & Query Parameter Keys**:
   - Raw route strings (`"/predictions"`) and query parameter keys (`"horizon"`) are strictly prohibited in application logic.
   - All route paths and query parameter keys must be declared in `src/constants/routes.constants.ts` (`AppRoute`, `QueryParamKey`).

8. **Semantic Component Architecture & 90/10 Hybrid Styling**:
   - All UI components must declare purpose-revealing semantic classes (e.g. `.quant-card`, `.trajectory-cone`, `.deliberation-grid`) defined in domain-scoped modular stylesheets under `@layer dl-components`.
   - Constructing UI components via long chains of atomic utility classes in JSX is strictly prohibited.

---

## 2. Directory Architecture & Layer Boundaries

```
src/
├── features/          # Vertical domain slices (overview, predictions, monitor, screener, portfolio, copilot)
│   ├── <domain>/components/ # Visual presentation blocks (< 150 lines each)
│   └── <domain>/api/        # Colocated React Query hooks & streaming adapters
│
├── components/        # Workstation layout & shared primitives
│   ├── layout/        # QuantShell, QuantSidebar, QuantTopbar, MarketTickerStrip, ComplianceFooter
│   └── ui/            # MetricCard, Sparkline, StatusBadge, ConfidenceMeter
│
├── services/          # Decoupled mock & live WebSocket market data adapters
├── lib/
│   ├── ui-copy/       # Centralized UI Copy (Zero Hardcoded Strings)
│   └── utils.ts       # Platform CSS class name helpers (clsx)
│
├── constants/         # Domain Enums (MarketIndex, SignalStatus) and AppRoute
└── routes/            # Thin TanStack Router endpoints (< 35 lines each)
```

---

## 3. Pre-Commit Quality Verification

Before presenting completed work to the user:

1. Run typecheck: `pnpm typecheck` (`tsc --noEmit` must pass with 0 errors).
2. Run linter: `pnpm lint` (`eslint .` must pass with 0 errors).
3. Run format check: `pnpm format:check`.
4. Run production build: `pnpm build` (both Client and SSR builds must succeed).
5. Verify file line counts: `wc -l` must confirm all files are strictly `< 250 lines`.
