import { ACCESS_TOKEN, REFRESH_TOKEN, SIGNIN } from "@/constants";
import { LoginForm } from "@/types";
import { normalizePhone } from "@/utils";
import axios from "axios";
import { NextResponse } from "next/server";

function normalizeLang(raw: string) {
  return (raw || "uz").toLowerCase().split(",")[0].split("-")[0];
}

export async function POST(req: Request) {
  const lang = normalizeLang(req.headers.get("accept-language") || "uz");

  let body: LoginForm;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const id = (body.emailOrPhone || "").trim();
  if (!id || !body.password) {
    return NextResponse.json(
      { error: "emailOrPhone va password majburiy" },
      { status: 400 }
    );
  }

  const identifier = id.includes("@")
    ? { email: id }
    : { phone_number: normalizePhone(id) };

  const payload = {
    ...identifier, 
    password: body.password,
  };

  try {
    const res = await axios.post(SIGNIN, payload, {
      headers: {
        "Accept-Language": lang, 
        "Content-Type": "application/json",
      },
    });
    console.log("TOKENLAR", res.data);

    const { access_token, refresh_token } = res.data?.data?.tokens || {};
    const response = NextResponse.json({ success: true });

    response.cookies.set(ACCESS_TOKEN, access_token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: true,
    });
    response.cookies.set(REFRESH_TOKEN, refresh_token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: true,
    });

    return response;
  } catch (e: any) {
    const status = e?.response?.status ?? 500;
    const data = e?.response?.data;
    const msg =
      data?.error_message || data?.message || data?.detail || "Login Failed";
    return NextResponse.json({ error: msg }, { status });
  }
}
