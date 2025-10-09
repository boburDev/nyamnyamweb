"use client";

import { getQueryClient } from "@/lib/react-query";
import {
  HydrationBoundary,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactNode } from "react";

export function Providers({
  children,
  dehydratedState,
}: {
  children: ReactNode;
  dehydratedState?: unknown;
}) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary
        state={
          dehydratedState as import("@tanstack/react-query").DehydratedState
        }
      >
        {children}
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
export default Providers;