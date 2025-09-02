"use client";

import { useEffect } from "react";
import useStore from "@/context/store";
import { useRouter } from "@/i18n/navigation";

export function RootProviders({ children }: { children: React.ReactNode }) {
  const { login, auth } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (auth) return;

    const url = new URL(window.location.href);

    const accessToken = url.searchParams.get("access");
    const hash = window.location.hash.replace(/^#/, "");
    const refreshToken = hash || null;

    if (accessToken && refreshToken) {
      login(accessToken, refreshToken);

      url.searchParams.delete("access");
      window.location.hash = "";

      window.history.replaceState({}, "", url.pathname + url.search);
      router.refresh();
    }
  }, [auth, login,router]);

  return <>{children}</>;
}

RootProviders.displayName = "RootProviders";
