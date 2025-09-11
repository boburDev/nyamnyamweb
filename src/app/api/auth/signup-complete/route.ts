import { ACCESS_TOKEN, REFRESH_TOKEN, SIGNUP_COMPLETE } from "@/constants";
import { CompletePayload } from "@/types";
import axios from "axios";
import { NextResponse } from "next/server";

function normalizeLang(raw: string) {
    return (raw || "uz").toLowerCase().split(",")[0].split("-")[0];
}

export async function POST(req: Request) {
    const lang = normalizeLang(req.headers.get("accept-language") || "uz");

    let body: CompletePayload & { authId: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { authId, ...payload } = body;

    if (!authId || !payload.first_name || !payload.password) {
        return NextResponse.json(
            { error: "authId, first_name va password majburiy" },
            { status: 400 }
        );
    }

    try {
        const res = await axios.post(
            `${SIGNUP_COMPLETE}${authId}/`,
            payload,
            {
                headers: {
                    "Accept-Language": lang,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("SIGNUP COMPLETE TOKENLAR", res.data);

        const { access_token, refresh_token } = res.data?.data?.tokens || {};
        const response = NextResponse.json({ success: true });

        response.cookies.set(ACCESS_TOKEN, access_token, {
            httpOnly: true,
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
            data?.error_message || data?.message || data?.detail || "Signup Complete Failed";
        return NextResponse.json({ error: msg }, { status });
    }
}
