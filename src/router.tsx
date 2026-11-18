/**
 * @file src/router.tsx
 * @description Master TanStack Router factory configured with TanStack Query context.
 * @author yuva.devlab@gmail.com
 */

import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

/**
 * Creates an isolated router instance per request to prevent cross-request SSR cache pollution.
 *
 * @returns Configured TanStack Router instance
 */
export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 30, // 30 seconds
        refetchOnWindowFocus: false,
      },
    },
  });

  return createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });
};
