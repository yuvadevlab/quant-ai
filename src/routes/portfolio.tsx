import { createFileRoute } from "@tanstack/react-router";
import { PortfolioDesk } from "@/components/quantai/portfolio";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Paper Portfolio & Execution — QuantAI" },
      {
        name: "description",
        content:
          "Simulated paper trading, risk exposure metrics, and algorithmic execution audit ledger.",
      },
      { property: "og:title", content: "Paper Portfolio & Execution — QuantAI" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  return <PortfolioDesk />;
}
