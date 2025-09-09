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

  const identifier = id.includes("@")
    ? { email: id }
    : { phone_number: normalizePhone(id) };

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    const status = e?.response?.status ?? 500;
    const data = e?.response?.data;
    const msg =
      data?.error_message || data?.message || data?.detail || "Login Failed";
    return NextResponse.json({ error: msg }, { status });
  }
}
