import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";
import { CompletePayload } from "@/types";
import axios from "axios";
import { NextResponse } from "next/server";

function normalizeLang(raw: string) {
  return (raw || "uz").toLowerCase().split(",")[0].split("-")[0];
}

export async function PATCH(req: Request) {
  const lang = normalizeLang(req.headers.get("accept-language") || "uz");

  let body: CompletePayload & { authId: string };
  try {
    body = await req.json();
  } catch (err) {
    console.error("❌ JSON parse error:", err);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { authId, ...payload } = body;

  if (!authId || !payload.first_name || !payload.password) {
    console.error("❌ Missing required fields:", { authId, ...payload });
    return NextResponse.json(
      { error: "authId, first_name va password majburiy" },
      { status: 400 }
    );
  }

  try {
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/${authId}/update_detail/`,
      payload,
      {
        headers: {
          "Accept-Language": lang,
          "Content-Type": "application/json",
        },
      }
    );


    const { access_token, refresh_token } = res.data?.data?.tokens || {};

    const response = NextResponse.json({ success: true });

    if (access_token) {
      response.cookies.set(ACCESS_TOKEN, access_token, {
        path: "/",
        sameSite: "lax",
        secure: true,
      });
    }
    if (refresh_token) {
      response.cookies.set(REFRESH_TOKEN, refresh_token, {
        path: "/",
        sameSite: "lax",
        secure: true,
      });
    }

    return response;
  } catch (e: unknown) {
    console.error("❌ Axios request failed:", e);

    if (axios.isAxiosError(e)) {
      console.error("❌ Axios Error Response:", e.response?.data);
      return NextResponse.json(
        {
          error:
            e.response?.data?.error_message ||
            e.response?.data?.message ||
            e.response?.data?.detail ||
            "Signup Complete Failed",
          details: e.response?.data,
        },
        { status: e.response?.status ?? 500 }
      );
    }

    return NextResponse.json(
      { error: "Unknown server error", details: String(e) },
      { status: 500 }
    );
  }
}
