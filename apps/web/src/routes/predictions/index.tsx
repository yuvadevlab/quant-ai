import { createFileRoute } from "@tanstack/react-router";
import { PredictionsPage, getPredictionsData } from "@/features/predictions";

export const Route = createFileRoute("/predictions/")({
  head: () => ({
    meta: [
      { title: "Prediction Lab & Signal Audit Ledger — QuantAI" },
      {
        name: "description",
        content:
          "Review automated NSE and BSE trade recommendations, outcomes, win-rates, and performance metrics.",
      },
      { property: "og:title", content: "Prediction Lab & Signal Audit Ledger — QuantAI" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async () => await getPredictionsData(),
  component: function PredictionsRoute() {
    const data = Route.useLoaderData();
    return <PredictionsPage initialData={data} />;
  },
});
