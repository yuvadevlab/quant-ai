/**
 * @file src/routes/chat/$id.tsx
 * @description Deep-linked session conversation thread route for AI Financial Copilot.
 * @author yuva.devlab@gmail.com
 */

import { createFileRoute } from "@tanstack/react-router";
import { ChatPage, getChatData } from "@/features/chat";

export const Route = createFileRoute("/chat/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Chat Thread ${params.id} — QuantAI Copilot` },
      {
        name: "description",
        content:
          "Conversational quantitative assistant for Indian market analysis, options open-interest, and setup evaluation.",
      },
      { property: "og:title", content: `Chat Thread ${params.id} — QuantAI Copilot` },
      { property: "og:type", content: "website" },
    ],
  }),
  loader: async () => await getChatData(),
  component: function ChatThreadRoute() {
    const { id } = Route.useParams();
    const data = Route.useLoaderData();
    return <ChatPage initialData={data} conversationId={id} />;
  },
});
