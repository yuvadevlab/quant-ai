/**
 * @file apps/web/src/components/quantai/chat.tsx
 * @description Chat copilot workspace adapter re-exporting from @/features/chat.
 */

import { ChatPage, getChatData, type ChatInitialData } from "@/features/chat";
import { useEffect, useState } from "react";

export function ChatWorkspace() {
  const [data, setData] = useState<ChatInitialData | null>(null);

  useEffect(() => {
    void getChatData().then(setData);
  }, []);

  if (!data) return null;
  return <ChatPage initialData={data} />;
}
