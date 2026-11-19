# 03 — Engineering Standards & Code Quality

**Author:** `yuva.devlab@gmail.com`  
**Parent Index:** [docs/INDEX.md](../INDEX.md)

---

## 1. Hard Modularity Rule (< 250 Lines)

- **Strict Limit**: No file in `src/` may exceed **250 lines of code**.
- **Early Decomposition**: When a component or service reaches **200 lines**, deconstruct it into child components or utility helpers.

---

## 2. 100% Comprehensive JSDoc

- Every exported class, function, interface, type alias, component, and constant must have a JSDoc block explaining:
  - Purpose and domain rationale.
  - Parameters (`@param`) with expected formats.
  - Return values (`@returns`).
  - Example usage where helpful.

---

## 3. Zero Hardcoded Strings

- User-facing text must **never** be hardcoded in JSX markup or business logic.
- All copy must be defined in domain catalogs in `src/lib/ui-copy/`:
  - `common.copy.ts`
  - `overview.copy.ts`
  - `predictions.copy.ts`
  - `monitor.copy.ts`
  - `screener.copy.ts`
  - `portfolio.copy.ts`
  - `chat.copy.ts`
  - `settings.copy.ts`

---

## 4. Enums Over Raw String Unions

- Never use string literal unions for entity states (e.g. avoid `status: "ACTIVE" | "EXPIRED"`).
- Always declare TypeScript `enum`s in `src/constants/`:
  ```typescript
  export enum SignalStatus {
    ACTIVE = "Active",
    TARGET_HIT = "Target hit",
    STOP_HIT = "Stop hit",
    EXPIRED = "Expired",
    INVALIDATED = "Invalidated",
  }
  ```
- **Rationale**: Changing string representations requires modifying only the enum definition rather than performing dangerous find-and-replace across the entire codebase.
