"use client";

import useStore from "@/context/store";

export const useAuth = (): boolean => {
  const auth = useStore((s) => s.auth);
  const isHydrated = useStore((s) => s.isHydrated);

  const isAuthenticated = isHydrated ? auth : false;
  return isAuthenticated;
};
