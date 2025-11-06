import { ACCESS_TOKEN, REFRESH_TOKEN, SIGNIN } from "@/constants";
import { LoginForm } from "@/types";
import { normalizePhone } from "@/utils";
import axios from "axios";
import { NextResponse } from "next/server";



export async function POST(req: Request) {

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

  // Remove spaces from phone number before processing
  const cleanId = id.replace(/\s/g, "");
  const identifier = cleanId.includes("@")
    ? { email: cleanId }
    : { phone: normalizePhone(cleanId) };

  const payload = {
    ...identifier,
    password: body.password,
  };

  try {
    const res = await axios.post(SIGNIN, payload);

    const { access_token, refresh_token } = res.data?.data?.tokens || {};
    const response = NextResponse.json({ success: true });

    response.cookies.set(ACCESS_TOKEN, access_token, {
      path: "/",
      sameSite: "lax",
      secure: true,
    });
    response.cookies.set(REFRESH_TOKEN, refresh_token, {
      path: "/",
      sameSite: "lax",
      secure: true,
    });

    return response;
  } catch (e: unknown) {
    let status = 500;
    let msg = "Login Failed";
    if (axios.isAxiosError(e) && e.response) {
      status = e.response.status ?? 500;
      const data = e.response.data;
      msg =
        data?.error_message || data?.message || data?.detail || "Login Failed";
    }
    return NextResponse.json({ error: msg }, { status });
  }
}
