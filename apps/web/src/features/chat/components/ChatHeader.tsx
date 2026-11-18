/**
 * @file src/features/chat/components/ChatHeader.tsx
 * @description Header banner for the AI Financial Copilot.
 */

import { Bot, ChevronRight } from "lucide-react";
import { CHAT_COPY } from "@/lib/ui-copy/chat.copy";

export function ChatHeader() {
  return (
    <div className="desk-header">
      <div>
        <div className="desk-breadcrumb">
          <span>INTELLIGENCE</span>
          <ChevronRight size={14} />
          <span className="current">{CHAT_COPY.HEADER.TITLE.toUpperCase()}</span>
        </div>
        <h1 className="desk-title">{CHAT_COPY.HEADER.TITLE}</h1>
        <p className="desk-subtitle">{CHAT_COPY.HEADER.SUBTITLE}</p>
      </div>
      <div className="desk-actions">
        <span className="paper-trading-tag">
          <Bot size={15} />
          <span>MULTI-AGENT CONSENSUS MODE</span>
        </span>
      </div>
    </div>
  );
}
