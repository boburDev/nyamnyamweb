import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN, GET_CART, POST_CART } from "@/constants";
import { CartData } from "@/types";

async function checkAuth() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value;

  if (!accessToken) {
    return { isAuthenticated: false, token: null };
  }

  return { isAuthenticated: true, token: accessToken };
}
// PUT - Update specific cart item
// pages/api/cart.ts (yoki shunga o'xshash yo'l)
// ... (boshqa importlar)

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

    // ... (boshqa tekshiruvlar)

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

    // Backenddan kelgan javobni o'qib olamiz
    const backendData = await response.json();

    if (!response.ok) {
      // Backenddan kelgan xato matnini to'g'ridan-to'g'ri qaytaramiz
      return NextResponse.json(
        {
          success: false,
          // Backenddan kelgan error_message ni ishlatamiz
          error_message:
            backendData?.error_message || "Failed to update cart item",
        },
        { status: response.status }
      );
    }

    // Muvaffaqiyatli javobni qaytarish
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

export async function GET() {
  try {
    const { isAuthenticated, token } = await checkAuth();

    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No access token" },
        { status: 401 }
      );
    }

    const response = await fetch(GET_CART, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch cart" },
        { status: response.status }
      );
    }

    const cartData = await response.json();

    const cartItems = cartData?.data?.cart_items || [];
    const cartTotal = cartData?.data?.cart_total || 0;

    const mappedCartItems: CartData[] = cartItems.map((item: CartData) => ({
      id: item.id,
      name: item.title,
      image: item.surprise_bag_image,
      restaurant: item.branch_name,
      distance: item.distance_km,
      originalPrice: item.price,
      currentPrice: item.subtotal,
      quantity: item.quantity,
      count: item.count,
      start_time: item.start_time,
      end_time: item.end_time,
      surprise_bag: item.surprise_bag,
    }));

    return NextResponse.json({
      success: true,
      items: mappedCartItems,
      total: cartTotal,
    });
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
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

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to update cart" },
        { status: response.status }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: "Cart updated successfully",
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

// DELETE - Remove item from cart
export async function DELETE(req: Request) {
  try {
    const { isAuthenticated, token } = await checkAuth();

    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No access token" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/cart/${productId}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      let backendData: unknown;
      try {
        backendData = await response.json();
      } catch (_error) {
        backendData = undefined;
      }
      const error_message =
        (backendData as { error_message?: string; message?: string })?.error_message ||
        (backendData as { error_message?: string; message?: string })?.message ||
        "Failed to remove cart item";
      return NextResponse.json(
        { success: false, message: error_message },
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
