/**
 * @file packages/ui/src/components/ChatComposer.tsx
 * @description Trader prompt input form with submit action and keyboard hints.
 * @author yuva.devlab@gmail.com
 */

import type { SyntheticEvent } from "react";
import { Send } from "lucide-react";
import { Button, Input, Kbd } from "@yuva-devlab/ui";

/**
 * Props for the ChatComposer presentation component.
 */
export interface ChatComposerProps {
  /** Current prompt text */
  readonly prompt: string;
  /** Callback when prompt text changes */
  readonly onPromptChange: (val: string) => void;
  /** Form submission handler */
  readonly onSubmit: (e: SyntheticEvent<HTMLFormElement>) => void;
  /** Input placeholder string */
  readonly placeholder?: string;
  /** Keyboard shortcut hint text */
  readonly shortcutHint?: string;
  /** Send button label */
  readonly sendButtonLabel?: string;
}

/**
 * Institutional prompt input bar with keyboard shortcuts and submit button.
 *
 * @param props - ChatComposerProps containing prompt state and submit handler.
 * @returns Rendered JSX ChatComposer element.
 */
export function ChatComposer({
  prompt,
  onPromptChange,
  onSubmit,
  placeholder = "Ask about Indian market regimes, NIFTY levels, stock setups, options OI...",
  shortcutHint = "Press ↵ to send",
  sendButtonLabel = "SEND",
}: ChatComposerProps) {
  return (
    <form className="chat-input-bar" onSubmit={onSubmit}>
      <div className="input-field-wrap">
        <Input
          type="text"
          placeholder={placeholder}
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          className="chat-prompt-input"
        />
        <Kbd className="kbd-shortcut">{shortcutHint}</Kbd>
      </div>
      <Button type="submit" className="btn-chat-send" title="Send message to Copilot">
        <Send size={16} />
        <span>{sendButtonLabel}</span>
      </Button>
    </form>
  );
}
