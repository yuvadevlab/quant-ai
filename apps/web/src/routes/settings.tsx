import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage, getSettingsData } from "@/features/settings";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Platform Configuration & Risk Governance — QuantAI" },
      {
        name: "description",
        content:
          "Configure AI model providers, risk limits, DevLab Portal SSO, and quantitative parameters.",
      },
      { property: "og:title", content: "Platform Configuration — QuantAI" },
      { property: "og:type", content: "website" },
    ],
  }),
  loader: async () => await getSettingsData(),
  component: function SettingsRoute() {
    const data = Route.useLoaderData();
    return <SettingsPage initialData={data} />;
  },
});
