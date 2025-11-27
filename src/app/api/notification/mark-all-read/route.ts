import { ACCESS_TOKEN, MARK_ALL_READ } from "@/constants";
import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value;

  if (!accessToken) {
    console.warn("⚠️ Access token topilmadi");
    return NextResponse.json(
      { success: false, message: "Unauthorized: No access token" },
      { status: 401 }
    );
  }

  const body = {};

  // Extract locale from query parameters
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale");

  interface ErrorResponse {
    error_message?: string;
    message?: string;
    [key: string]: unknown;
  }

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    // Add locale header if provided
    if (locale) {
      headers["Accept-Language"] = locale;
    }

    const response = await axios.post(MARK_ALL_READ, body, { headers });

    const result = response.data;

    return NextResponse.json({
      success: true,
      message: result.error_message || "Notification marked as read successfully",
      data: result,
    });
  } catch (error) {
    const err = error as AxiosError;

    console.error("❌ Notification mark-all-read POST xatosi:", err);
    console.error("🔍 Error detail:", err.response?.data);

    const errorData = err.response?.data as ErrorResponse | undefined;

    const backendMessage =
      errorData?.error_message ||
      errorData?.message ||
      "Internal server error";

    return NextResponse.json(
      { success: false, message: backendMessage },
      { status: err.response?.status || 500 }
    );
  }
}
