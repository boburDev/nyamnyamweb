import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN, POST_CART } from "@/constants";
import { CartData } from "@/types";
import { revalidatePath } from "next/cache";

async function checkAuth() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value;

  if (!accessToken) {
    return { isAuthenticated: false, token: null };
  }

  return { isAuthenticated: true, token: accessToken };
}

export async function PATCH(req: Request) {
  try {
    const { isAuthenticated, token } = await checkAuth();

    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No access token" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { surprise_bag, quantity, id } = body;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/cart/${id}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity, surprise_bag }),
      }
    );

    const backendData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error_message:
            backendData?.error_message || "Failed to update cart item",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Cart item updated successfully",
      data: backendData,
    });
  } catch (error) {
    console.error("Cart PATCH error:", error);
    return NextResponse.json(
      { success: false, error_message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { isAuthenticated, token } = await checkAuth();

    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No access token" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { items } = body;

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { success: false, message: "Invalid cart items" },
        { status: 400 }
      );
    }

    const mappedItems = items.map((item: CartData) => ({
      surprise_bag: item.id,
      quantity: item.quantity,
    }));

    const response = await fetch(POST_CART, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: mappedItems,
      }),
    });
    revalidatePath("/");

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to update cart" },
        { status: response.status }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: result.error_message,
      data: result,
    });
  } catch (error) {
    console.error("Cart POST error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { isAuthenticated, token } = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No access token" },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Request body is missing or invalid" },
        { status: 400 }
      );
    }

    const { id } = body;
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

    let backendData;
    try {
      backendData = await response.json();
    } catch {
      backendData = await response.text();
    }

    if (!response.ok) {
      console.error("Backend error:", backendData);
      return NextResponse.json(
        {
          success: false,
          error_message:
            backendData?.error_message ||
            backendData?.message ||
            backendData ||
            "Failed to delete cart item",
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
