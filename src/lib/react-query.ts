// lib/react-query.ts
import { QueryClient } from "@tanstack/react-query";

let queryClient: QueryClient | null = null;

export function getQueryClient() {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          refetchOnWindowFocus: false,
          refetchOnReconnect: true,
          refetchOnMount: true,
          staleTime: 0,
        },
        mutations: {
          retry: false,
        },
      },
    });
  }

  return queryClient;
}
