import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/constants";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ACCESS_TOKEN)?.value;

    const isAuthenticated = Boolean(token);

    const response = NextResponse.json({
      isAuthenticated,
    });

    response.headers.set("Cache-Control", "no-store");

    return response;
  } catch (error) {
    console.error("Auth status check error:", error);
    return NextResponse.json(
      { isAuthenticated: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
