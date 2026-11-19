/**
 * @file src/features/chat/components/ChatComposer.tsx
 * @description Trader prompt input form with submit action and keyboard hints.
 */

import { Send } from "lucide-react";
import type { FormEvent } from "react";

export interface ChatComposerProps {
  readonly prompt: string;
  readonly onPromptChange: (val: string) => void;
  readonly onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export function ChatComposer({ prompt, onPromptChange, onSubmit }: ChatComposerProps) {
  return (
    <form className="chat-input-bar" onSubmit={onSubmit}>
      <div className="input-field-wrap">
        <input
          type="text"
          placeholder="Ask QuantAI about a symbol, pattern, options setup, or risk condition..."
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          className="chat-prompt-input"
        />
        <span className="kbd-shortcut">Enter to send</span>
      </div>
      <button type="submit" className="btn-chat-send" title="Send query to Copilot">
        <Send size={16} />
        <span>Send</span>
      </button>
    </form>
  );
}
