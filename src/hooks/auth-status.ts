"use client";

import { getAuthStatusClient } from "@/lib/status";
import { useQuery } from "@tanstack/react-query";

export function useAuthStatus() {
  const { data, isLoading } = useQuery({
    queryKey: ["authStatus"],
    queryFn: getAuthStatusClient,

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const isAuthenticated = data?.isAuthenticated || false;

  return { isAuthenticated, isLoading };
}
