import { ACCESS_TOKEN } from "@/constants";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE() {
  const cookieStore = await cookies();
  const accesToken = cookieStore.get(ACCESS_TOKEN)?.value;
  try {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/cart/delete_all/`,
      {
        headers: {
          Authorization: `Bearer ${accesToken}`,
        },
      }
    );
    const response = NextResponse.json({ status: 200 });
    console.log("Cart deleted successfully xasxsadasdas123" );
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
