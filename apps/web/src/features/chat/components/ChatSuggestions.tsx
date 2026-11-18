/**
 * @file src/features/chat/components/ChatSuggestions.tsx
 * @description Quick prompt starters bar for trader inquiries.
 */

import { ArrowUpRight, ShieldCheck, Target, Zap } from "lucide-react";

export interface ChatSuggestionsProps {
  readonly onSelectPrompt: (promptText: string) => void;
}

const quickPrompts = [
  { icon: Zap, label: "Scan Nifty 50 expiry momentum" },
  { icon: Target, label: "BankNifty 51,200 CE options structure" },
  { icon: ArrowUpRight, label: "Analyze Reliance 15m breakout" },
  { icon: ShieldCheck, label: "Explain automated invalidation rules" },
];

export function ChatSuggestions({ onSelectPrompt }: ChatSuggestionsProps) {
  return (
    <div className="quick-prompts-bar">
      <span className="prompts-label">QUICK PROMPTS:</span>
      <div className="prompts-scroll">
        {quickPrompts.map(({ icon: Icon, label }) => (
          <button
            key={label}
            type="button"
            className="quick-prompt-btn"
            onClick={() => onSelectPrompt(label)}
          >
            <Icon size={13} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
