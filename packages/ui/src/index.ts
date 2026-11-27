/**
 * @file packages/ui/src/index.ts
 * @description Entry point for @quant-ai/ui design system package.
 * Exports domain-specific quantitative components, layout widgets, and DevLab UI primitives.
 */

import "./styles.css";

// ─── Domain-Specific Quantitative Components ─────────────────────────────────
export * from "./types";
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
  SearchInput,
  PasswordInput,
  Textarea,
  Label,
  Switch,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  // Layout Primitives
  Box,
  Flex,
  Grid,
  Stack,
  Container,
  // Select Primitives
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  // Dialog Primitives
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  // Popover & Dropdown
  Popover,
  PopoverTrigger,
  PopoverContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  // Table Primitives
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  // Card Primitives
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  // Tab & Navigation Primitives
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ScrollArea,
  Separator,
  Skeleton,
  Progress,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Kbd,
  PromptInput,
  EmptyState,
  LoadingState,
  Alert,
  AlertTitle,
  AlertDescription,
  Shimmer,
  Terminal,
  TerminalEntryLevel,
  TerminalHeight,
  type TerminalEntry,
} from "@yuva-devlab/ui";
