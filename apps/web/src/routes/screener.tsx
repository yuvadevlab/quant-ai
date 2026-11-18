import { createFileRoute } from "@tanstack/react-router";
import { ScreenerPage, getScreenerData } from "@/features/screener";

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
  loader: async () => await getScreenerData(),
  component: function ScreenerRoute() {
    const data = Route.useLoaderData();
    return <ScreenerPage initialData={data} />;
  },
});
