import { createFileRoute } from "@tanstack/react-router";
import { OverviewPage, getOverviewData } from "@/features/overview";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Market Intelligence Desk — QuantAI" },
      {
        name: "description",
        content:
          "Institutional-style AI quantitative intelligence and market overview workstation for Indian markets (NSE & BSE).",
      },
      { property: "og:title", content: "Market Intelligence Desk — QuantAI" },
      {
        property: "og:description",
        content:
          "Institutional-style AI quantitative intelligence and market overview workstation for Indian markets.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async () => await getOverviewData(),
  component: function HomePage() {
    const data = Route.useLoaderData();
    return <OverviewPage initialData={data} />;
  },
});
