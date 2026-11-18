import { createFileRoute } from "@tanstack/react-router";
import { ChatWorkspace } from "@/components/quantai/chat";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Copilot — QuantAI Financial Intelligence" },
      {
        name: "description",
        content: "Dedicated AI Financial Copilot and market intelligence assistant.",
      },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  return <ChatWorkspace />;
}
