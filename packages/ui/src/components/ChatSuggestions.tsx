/**
 * @file packages/ui/src/components/ChatSuggestions.tsx
 * @description Quick prompt starters bar for trader inquiries.
 * @author yuva.devlab@gmail.com
 */

import type { ComponentType } from "react";
import { ArrowUpRight, ShieldCheck, Target, Zap } from "lucide-react";
import { Button } from "@yuva-devlab/ui";

/**
 * Quick prompt item contract.
 */
export interface QuickPromptItem {
  readonly label: string;
  readonly icon?: ComponentType<{ size?: number }>;
}

/**
 * Props for the ChatSuggestions presentation component.
 */
export interface ChatSuggestionsProps {
  /** Callback when user selects a prompt chip */
  readonly onSelectPrompt: (promptText: string) => void;
  /** Custom list of quick prompts */
  readonly prompts?: readonly QuickPromptItem[];
  /** Bar label */
  readonly label?: string;
}

const DEFAULT_PROMPTS: readonly QuickPromptItem[] = [
  { icon: Zap, label: "What is the consensus regime for NIFTY 50 today?" },
  { icon: Target, label: "Show high conviction BANKNIFTY options strategies" },
  { icon: ArrowUpRight, label: "Analyze RELIANCE breakout potential and volume" },
  { icon: ShieldCheck, label: "Explain the automated trade invalidation rules" },
];

/**
 * Horizontal quick starter prompt pills for instant market Copilot queries.
 *
 * @param props - ChatSuggestionsProps containing prompt click callback.
 * @returns Rendered JSX ChatSuggestions element.
 */
export function ChatSuggestions({
  onSelectPrompt,
  prompts = DEFAULT_PROMPTS,
  label = "QUICK QUERIES:",
}: ChatSuggestionsProps) {
  return (
    <div className="quick-prompts-bar">
      <span className="prompts-label">{label}</span>
      <div className="prompts-scroll">
        {prompts.map(({ icon: Icon, label: promptText }) => (
          <Button
            key={promptText}
            type="button"
            className="quick-prompt-btn"
            onClick={() => onSelectPrompt(promptText)}
          >
            {Icon && <Icon size={13} />}
            <span>{promptText}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
