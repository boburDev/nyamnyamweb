import { ACCESS_TOKEN, DOMAIN, UPDATE_OTP_USER } from "@/constants";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value;
  let body: { email?: string; phone_number?: string; code: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if ((!body.email && !body.phone_number) || !body.code) {
    return NextResponse.json(
      { error: "email/phone_number va code majburiy" },
      { status: 400 }
    );
  }

  try {
    const res = await axios.post(`${DOMAIN}${UPDATE_OTP_USER}`, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json({ success: true, data: res.data });
  } catch (e: unknown) {
    let status = 500;
    let msg = "OTP tasdiqlashda xatolik";

    if (axios.isAxiosError(e) && e.response) {
      status = e.response.status ?? 500;
      const data = e.response.data;
      msg = data?.error_message || data?.message || data?.detail || msg;
    }

    return NextResponse.json({ error: msg }, { status });
  }
}
