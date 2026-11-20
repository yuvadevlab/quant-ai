/**
 * @file src/features/chat/components/ChatComposer.tsx
 * @description Trader prompt input form with submit action and keyboard hints.
 * @author yuva.devlab@gmail.com
 */

import { Send } from "lucide-react";
import type { FormEvent } from "react";
import { Button } from "@quant-ai/ui";
import { CHAT_COPY } from "@/lib/ui-copy/chat.copy";

export interface ChatComposerProps {
  readonly prompt: string;
  readonly onPromptChange: (val: string) => void;
  readonly onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export function ChatComposer({ prompt, onPromptChange, onSubmit }: ChatComposerProps) {
  const copy = CHAT_COPY.COMPOSER;

  return (
    <form className="chat-input-bar" onSubmit={onSubmit}>
      <div className="input-field-wrap">
        <input
          type="text"
          placeholder={copy.PLACEHOLDER}
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          className="chat-prompt-input"
        />
        <span className="kbd-shortcut">{copy.SHORTCUT_HINT}</span>
      </div>
      <Button type="submit" className="btn-chat-send" title={copy.SEND_TOOLTIP}>
        <Send size={16} />
        <span>{copy.SEND_BUTTON}</span>
      </Button>
    </form>
  );
}
