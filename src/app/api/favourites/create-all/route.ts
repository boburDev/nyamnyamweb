import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN, POST_FAVORITE } from "@/constants";
import axios from "axios";

async function checkAuth() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value;


  if (!accessToken) {
    return { isAuthenticated: false, token: null };
  }

  return { isAuthenticated: true, token: accessToken };
}

export async function POST(req: Request) {

  try {
    const { isAuthenticated, token } = await checkAuth();

    if (!isAuthenticated) {
      console.warn("⚠️ No access token in cookies");
      return NextResponse.json(
        { success: false, message: "Unauthorized: No access token" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const { items } = body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.warn("⚠️ Empty or invalid favourites list");
      return NextResponse.json(
        { success: false, message: "No favourite items to post" },
        { status: 400 }
      );
    }

    const requestBody = { items };

    // ✅ axios config to‘g‘rilandi
    const response = await axios.post(POST_FAVORITE, requestBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });


    return NextResponse.json({
      success: true,
      message: "Favourite items posted successfully",
      data: response.data,
    });
  } catch (e: unknown) {
    console.error("❌ Error posting favourites:", e);

    let status = 500;
    let msg = "Login Failed";

    if (axios.isAxiosError(e) && e.response) {
      status = e.response.status ?? 500;
      const data = e.response.data;
      msg = data?.error_message || data?.message || data?.detail || "Login Failed";

      console.error("🔍 Backend error:", msg);
      console.error("📄 Full response:", data);
    }

    return NextResponse.json({ error: msg }, { status });
  }
}
