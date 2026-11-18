import { createFileRoute } from "@tanstack/react-router";
import { MonitorPage, getMonitorData } from "@/features/monitor";

export const Route = createFileRoute("/predictions/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Call ${params.id} Monitor — QuantAI` },
      {
        name: "description",
        content:
          "Inspect an illustrative QuantAI price trajectory, trade levels, and setup evidence.",
      },
      { property: "og:title", content: `Live Call Monitor — QuantAI` },
      {
        property: "og:description",
        content: "An illustrative price-path monitor with sample trade levels and audit events.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async ({ params }) => await getMonitorData(params.id),
  component: function PredictionMonitorPage() {
    const data = Route.useLoaderData();
    if (!data) {
      return null;
    }
    return <MonitorPage initialData={data} />;
  },
});
