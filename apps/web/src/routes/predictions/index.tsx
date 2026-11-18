import { createFileRoute } from "@tanstack/react-router";
import { PredictionsWorkspace } from "@/components/quantai/predictions";

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
  component: PredictionsPage,
});

function PredictionsPage() {
  return <PredictionsWorkspace />;
}
