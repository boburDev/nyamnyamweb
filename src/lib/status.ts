export async function getAuthStatusClient(): Promise<{
  isAuthenticated: boolean;
}> {
  const res = await fetch("/api/auth/status", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    return { isAuthenticated: false };
  }

  const data = await res.json();
  return { isAuthenticated: data?.isAuthenticated || false };
}
