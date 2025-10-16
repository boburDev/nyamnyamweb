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
    const err = new Error(message) as Error & { status: number };
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  return data.data;
}

export async function updateUser(data: UserData, locale: string) {
  try {
    const payload = {
      ...data,
      locale,
    };
    const res = await fetch("/api/update-profile", {
      method: "PATCH",
      credentials: "include",

      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorResponse = await res.json();
      const errorMessage =
        errorResponse?.error_message || errorResponse?.message;
      throw new Error(errorMessage);
    }
    return res.json();
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}
