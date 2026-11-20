/**
 * @file vite.config.ts
 * @description Master Vite configuration for QuantAI Workstation. */

import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    tanstackStart({
      server: { entry: "server" },
    }),
    viteReact(),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  server: {
    host: "::",
    port: 3005,
    proxy: {
      "/api": {
        target: "http://localhost:4005",
        changeOrigin: true,
      },
      "/socket.io": {
        target: "http://localhost:4006",
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
