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

  const body = await req.json();

  Object.keys(body).forEach((key) => {
    if (body[key] === "" || body[key] === undefined) {
      delete body[key];
    }
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/update-me/`,
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

  try {
    return NextResponse.json(JSON.parse(text), { status: response.status });
  } catch {
    return new NextResponse(text, { status: response.status });
  }
}
