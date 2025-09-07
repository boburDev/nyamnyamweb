// app/api/update-profile/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/constants";

export async function PATCH(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: No access token" },
      { status: 401 }
    );
  }

  let body = await req.json();

  Object.keys(body).forEach((key) => {
    if (body[key] === "" || body[key] === undefined) {
      delete body[key];
    }
  });

  console.log("➡️ PATCH /update-me body:", body);

  const response = await fetch(
    "https://api.shaxriyorbek.uz/api/users/auth/update-me/",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    }
  );

  const text = await response.text();
  console.log("⬅️ Response status:", response.status);
  console.log("⬅️ Response body:", text);

  try {
    return NextResponse.json(JSON.parse(text), { status: response.status });
  } catch {
    return new NextResponse(text, { status: response.status });
  }
}
