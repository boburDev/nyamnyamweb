import { UserData } from "@/types";

export async function getUsers() {
  const res = await fetch("/api/proxy/auth/profile", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    const message =
      errorData?.error ||
      errorData?.message ||
      `Failed to fetch user (status ${res.status})`;
    throw new Error(message);
  }

  const data = await res.json();
  return data.data;
}

export async function updateUser(data: UserData, locale: string) {
  const res = await fetch("/api/update-profile", {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": locale,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to update user");
  }

  return res.json();
}
