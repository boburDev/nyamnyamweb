import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/constants";

async function checkAuth() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value ?? null;
  if (!accessToken) return { isAuthenticated: false, token: null };
  return { isAuthenticated: true, token: accessToken };
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { isAuthenticated, token } = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No access token" },
        { status: 401 }
      );
    }

    const id = params.id;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Cart item ID is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/cart/${id}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const raw = await response.text();
    type BackendResponse = { error_message?: string; message?: string } | string;
    let backendData: BackendResponse;
    try {
      backendData = JSON.parse(raw);
    } catch {
      backendData = raw;
    }

    if (!response.ok) {
      let errorMessage = "Failed to delete cart item";
      if (typeof backendData === "object" && backendData !== null) {
        const obj = backendData as { error_message?: string; message?: string };
        errorMessage =
          obj.error_message || obj.message || JSON.stringify(backendData) || errorMessage;
      } else if (typeof backendData === "string" && backendData) {
        errorMessage = backendData;
      }

      return NextResponse.json(
        {
          success: false,
          error_message: errorMessage,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Cart item deleted successfully",
      data: backendData,
    });
  } catch (error) {
    console.error("Cart DELETE error:", error);
    return NextResponse.json(
      { success: false, error_message: "Internal server error" },
      { status: 500 }
    );
  }
}
