# 13 — Development Workflows & Quality Gates

**Author:** `yuva.devlab@gmail.com`  
**Parent Index:** [docs/INDEX.md](../INDEX.md)

---

## 1. Local Development Setup

### Prerequisites

- Node.js >= 20.x
- pnpm >= 10.x

### Quickstart

```bash
# Clone the repository
git clone https://github.com/yuvadevlab/quant-ai.git
cd quant-ai

# Install dependencies
pnpm install

# Start local workstation dev server on port 3005
pnpm dev --port 3005
```

Navigate to `http://localhost:3005`.

---

## 2. Mandatory Verification Pipeline

Before opening a pull request or submitting code:

```bash
# 1. Code style & formatting check
pnpm format:check

# 2. Strict ESLint validation
pnpm lint

# 3. TypeScript compilation & typecheck
pnpm typecheck

# 4. Vitest test suite execution
pnpm test

# 5. Production Client & SSR bundle build
pnpm build
```

---

## 3. Git Invariants Reminder

- Never run `git commit` or `git push` without explicit user instruction.
- All author attribution must use `yuva.devlab@gmail.com`.
- Conventional commit messages required: `<type>(<scope>): <subject>`.
