"use client";

import { ReactNode, useState } from "react";
import { HydrationBoundary, QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/react-query";

export function Providers({
  children,
  dehydratedState,
}: {
  children: ReactNode;
  dehydratedState?: unknown;
}) {
  const [queryClient] = useState(() => getQueryClient());

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
