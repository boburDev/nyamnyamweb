/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/constants";
import axios from "axios";

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

  const { locale, email, phone_number, ...rest } = body;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/update-me/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Accept-Language": locale,
        },
        body: JSON.stringify(rest),
      }
    );

    const text = await response.text();

    return NextResponse.json(JSON.parse(text), { status: response.status });
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
