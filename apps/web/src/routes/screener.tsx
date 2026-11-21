import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ScreenerPage, screenerQueryOptions } from "@/features/screener";

export const Route = createFileRoute("/screener")({
  head: () => ({
    meta: [
      { title: "Quantitative Screener — QuantAI" },
      {
        name: "description",
        content:
          "High-performance quantitative and options screener for Indian equities and derivatives.",
      },
      { property: "og:title", content: "Quantitative Screener — QuantAI" },
      { property: "og:type", content: "website" },
    ],
  }),
  loader: async ({ context: { queryClient } }) => {
    return await queryClient.query({
      ...screenerQueryOptions(),
      staleTime: "static",
    });
  },
  component: function ScreenerRoute() {
    const { data } = useSuspenseQuery(screenerQueryOptions());
    return <ScreenerPage initialData={data} />;
  },
});
