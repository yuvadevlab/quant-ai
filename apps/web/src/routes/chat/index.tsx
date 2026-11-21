/**
 * @file src/routes/chat/index.tsx
 * @description Root fresh session route for AI Financial Copilot.
 * @author yuva.devlab@gmail.com
 */

import { createFileRoute } from "@tanstack/react-router";
import { ChatPage, getChatData } from "@/features/chat";

export const Route = createFileRoute("/chat/")({
  head: () => ({
    meta: [
      { title: "AI Financial Copilot — QuantAI" },
      {
        name: "description",
        content:
          "Conversational quantitative assistant for Indian market analysis, options open-interest, and setup evaluation.",
      },
      { property: "og:title", content: "AI Financial Copilot — QuantAI" },
      { property: "og:type", content: "website" },
    ],
  }),
  loader: async () => await getChatData(),
  component: function ChatIndexRoute() {
    const data = Route.useLoaderData();
    return <ChatPage initialData={data} />;
  },
});
