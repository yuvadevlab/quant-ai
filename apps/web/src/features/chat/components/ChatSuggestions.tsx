/**
 * @file src/features/chat/components/ChatSuggestions.tsx
 * @description Quick prompt starters bar for trader inquiries.
 * @author yuva.devlab@gmail.com
 */

import { ArrowUpRight, ShieldCheck, Target, Zap } from "lucide-react";
import { Button } from "@quant-ai/ui";
import { CHAT_COPY } from "@/lib/ui-copy/chat.copy";

export interface ChatSuggestionsProps {
  readonly onSelectPrompt: (promptText: string) => void;
}

export function ChatSuggestions({ onSelectPrompt }: ChatSuggestionsProps) {
  const copy = CHAT_COPY.SUGGESTIONS;

  const quickPrompts = [
    { icon: Zap, label: copy.PROMPT_NIFTY },
    { icon: Target, label: copy.PROMPT_BANKNIFTY },
    { icon: ArrowUpRight, label: copy.PROMPT_RELIANCE },
    { icon: ShieldCheck, label: copy.PROMPT_RULES },
  ];

  return (
    <div className="quick-prompts-bar">
      <span className="prompts-label">{copy.LABEL}</span>
      <div className="prompts-scroll">
        {quickPrompts.map(({ icon: Icon, label }) => (
          <Button
            key={label}
            type="button"
            className="quick-prompt-btn"
            onClick={() => onSelectPrompt(label)}
          >
            <Icon size={13} />
            <span>{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
