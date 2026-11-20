/**
 * @file packages/ui/src/index.ts
 * @description Entry point for @quant-ai/ui design system package.
 * Exports domain-specific quantitative components, layout widgets, and DevLab UI primitives.
 * @author yuva.devlab@gmail.com
 */

import "./styles.css";

// ─── Domain-Specific Quantitative Components ─────────────────────────────────
export * from "./components";
export * from "./constants/ui-copy.constants";

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
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ScrollArea,
} from "@yuva-devlab/ui";
