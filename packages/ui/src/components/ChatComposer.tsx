/**
 * @file packages/ui/src/components/ChatComposer.tsx
 * @description Sticky auto-expanding textarea composer aligned with FinAI AdvisorComposer.
 */

import { useEffect, useRef, useState, type KeyboardEvent, type SyntheticEvent } from "react";
import { Send, Square } from "lucide-react";
import { Button, Textarea, cn } from "@yuva-devlab/ui";

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
  /** Whether an AI reply is currently generating */
  readonly isSubmitting?: boolean;
  /** Input placeholder string */
  readonly placeholder?: string;
  /** Keyboard shortcut hint text */
  readonly shortcutHint?: string;
  /** Send button label */
  readonly sendButtonLabel?: string;
  /** Optional handler to abort an active streaming response */
  readonly onStop?: () => void;
  /** Stop button label */
  readonly stopButtonLabel?: string;
}

/**
 * Sticky bottom prompt composer with auto-expanding textarea, Enter-to-send,
 * and clean single focus ring.
 */
export function ChatComposer({
  prompt,
  onPromptChange,
  onSubmit,
  isSubmitting = false,
  placeholder = "Ask about Indian market regimes, NIFTY levels, stock setups, options OI...",
  shortcutHint = "Enter to send · Shift+Enter for new line",
  sendButtonLabel = "Send message",
  onStop,
  stopButtonLabel = "Stop generating",
}: ChatComposerProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current && prompt === "") {
      inputRef.current.style.height = "auto";
    }
  }, [prompt]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim() && !isSubmitting) {
        onSubmit(e as unknown as SyntheticEvent<HTMLFormElement>);
      }
    }
  };

  return (
    <div className="advisor-composer">
      <form onSubmit={onSubmit} className={cn("advisor-composer-form", isFocused && "is-focused")}>
        <Textarea
          ref={inputRef}
          rows={1}
          placeholder={placeholder}
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isSubmitting}
          className="advisor-composer-textarea"
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
          }}
        />
        {isSubmitting && onStop ? (
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="advisor-composer-btn"
            onClick={onStop}
            aria-label={stopButtonLabel}
            title={stopButtonLabel}
          >
            <Square size={14} />
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon"
            className="advisor-composer-btn"
            disabled={!prompt.trim() || isSubmitting}
            aria-label={sendButtonLabel}
            title={sendButtonLabel}
          >
            <Send size={16} />
          </Button>
        )}
      </form>
      <p className="advisor-composer-hint">{shortcutHint}</p>
    </div>
  );
}
