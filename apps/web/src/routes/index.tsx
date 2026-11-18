import { createFileRoute } from "@tanstack/react-router";
import { OverviewDesk } from "@/components/quantai/overview";

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
  component: HomePage,
});

function HomePage() {
  return <OverviewDesk />;
}
