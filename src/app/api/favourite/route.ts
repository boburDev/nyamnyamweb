import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN, DOMAIN } from "@/constants";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: No access token" },
      { status: 401 }
    );
  }
  const body = await req.json();
  console.log("API received favourite data:", body);

  const response = await fetch(`${DOMAIN}/favourites/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ surprise_bag: body.id }),
  });

  const text = await response.text();
  console.log("API response:", text);

  try {
    return NextResponse.json(JSON.parse(text), { status: response.status });
  } catch {
    return new NextResponse(text, { status: response.status });
  }
}
