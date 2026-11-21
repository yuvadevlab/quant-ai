import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { OverviewPage, overviewQueryOptions } from "@/features/overview";

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
  loader: async ({ context: { queryClient } }) => {
    return await queryClient.query({ ...overviewQueryOptions(), staleTime: "static" });
  },
  component: function HomePage() {
    const { data } = useSuspenseQuery(overviewQueryOptions());
    return <OverviewPage initialData={data} />;
  },
});
