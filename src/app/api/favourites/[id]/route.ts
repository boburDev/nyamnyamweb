import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN, FAVORITE } from "@/constants";
import axios from "axios";

interface Props {
  params: Promise<{ id: string }>;
}
export async function DELETE(req: Request, { params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value;

  if (!accessToken) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }
  const url = `${FAVORITE}${id}/`;
  console.log("DELETE", url);

  try {
    const resp = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return NextResponse.json(resp.data, { status: resp.status });
  } catch (err: unknown) {
    let status = 500;
    let msg = "Delete failed";
    if (axios.isAxiosError(err) && err.response) {
      status = err.response.status ?? 500;
      interface ErrorResponseData {
        error_message?: string;
        message?: string;
        detail?: string;
      }
      const d = err.response.data as ErrorResponseData;
      msg = d?.error_message || d?.message || d?.detail || "Delete failed";
    }
    return NextResponse.json({ error: msg }, { status });
  }
}
