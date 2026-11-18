import { createFileRoute } from "@tanstack/react-router";
import { ScreenerDesk } from "@/components/quantai/screener";

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
  component: ScreenerPage,
});

function ScreenerPage() {
  return <ScreenerDesk />;
}
