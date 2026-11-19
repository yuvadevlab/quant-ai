# QuantAI — GitHub Copilot & VS Code Agent Instructions

**Author:** `yuva.devlab@gmail.com`  
**Master Standards:** [AGENTS.md](../AGENTS.md) | [docs/INDEX.md](../docs/INDEX.md)

---

## Workspace Rules & Style Constraints

1. **Pure Platform CSS**: Do NOT generate utility-first CSS classes or import third-party CSS frameworks. Use `@layer dl-components` and semantic class names (`.quant-card`, `.signal-badge`, `.sparkline-container`) mapped to CSS custom properties from `@yuva-devlab/tokens`.
2. **Centralized Copy**: Never insert raw user-facing strings in JSX. Import from `src/lib/ui-copy/`.
3. **Canonical Enums**: Use enums from `src/constants/` (e.g. `SignalStatus`, `SignalDirection`, `MarketIndex`, `AppRoute`).
4. **File Length Limit**: Strictly `< 250 lines of code` per file. Extract child components early.
5. **JSDoc**: Document all exported types, interfaces, functions, and components.
6. **Git Safety**: Never suggest or run `git commit` or `git push` without direct user confirmation.
