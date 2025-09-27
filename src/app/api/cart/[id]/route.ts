// app/api/cart/[id]/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/constants";

async function checkAuth() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value;

  if (!accessToken) {
    return { isAuthenticated: false, token: null };
  }
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

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/cart/${params.id}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const backendData = await response.json().catch(() => undefined);
      return NextResponse.json(
        {
          success: false,
          message:
            backendData?.error_message ||
            backendData?.message ||
            "Failed to remove cart item",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Cart item removed successfully",
    });
  } catch (error) {
    console.error("Cart DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
