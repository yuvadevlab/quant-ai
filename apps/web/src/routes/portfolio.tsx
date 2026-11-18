import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage, getPortfolioData } from "@/features/portfolio";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Paper Portfolio & Execution Desk — QuantAI" },
      {
        name: "description",
        content: "Simulated paper trading, algorithmic positions, P&L, and margin tracking.",
      },
      { property: "og:title", content: "Paper Portfolio & Execution Desk — QuantAI" },
      { property: "og:type", content: "website" },
    ],
  }),
  loader: async () => await getPortfolioData(),
  component: function PortfolioRoute() {
    const data = Route.useLoaderData();
    return <PortfolioPage initialData={data} />;
  },
});
