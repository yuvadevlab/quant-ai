/**
 * @file packages/ui/src/index.ts
 * @description Entry point for @quant-ai/ui design system package.
 * Exports domain-specific quantitative components, layout widgets, and primitives.
 */

import "./styles.css";

// ─── Domain-Specific Quantitative Components ─────────────────────────────────
export * from "./components";

// ─── Shared UI Primitives & Utilities (from @yuva-devlab/ui) ──────────────────
export {
  cn,
  Button,
  buttonVariants,
  Badge,
  badgeVariants,
  Input,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@yuva-devlab/ui";
