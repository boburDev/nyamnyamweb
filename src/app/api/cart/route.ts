import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN, GET_CART, POST_CART } from "@/constants";
import { CartItem } from "@/context/cartStore";

// Helper function to check authentication
async function checkAuth() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN)?.value;

    if (!accessToken) {
        return { isAuthenticated: false, token: null };
    }

    return { isAuthenticated: true, token: accessToken };
}

// GET - Retrieve user's cart
export async function GET() {
    try {
        const { isAuthenticated, token } = await checkAuth();

        if (!isAuthenticated) {
            return NextResponse.json(
                { success: false, message: "Unauthorized: No access token" },
                { status: 401 }
            );
        }

        // Fetch user's cart from backend API
        const response = await fetch(
            GET_CART,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { success: false, message: "Failed to fetch cart" },
                { status: response.status }
            );
        }

        const cartData = await response.json();

        // Map the backend cart data to frontend CartItem format
        const mappedCartItems: CartItem[] = cartData.items?.map((item: {
            product?: {
                id: string;
                name: string;
                image: string;
                restaurant: string;
                distance: number;
                original_price: number;
                current_price: number;
                stock?: number;
            };
            id: string;
            name: string;
            image: string;
            restaurant: string;
            distance: number;
            original_price: number;
            current_price: number;
            stock?: number;
            quantity: number;
        }) => ({
            id: item.product?.id || item.id,
            name: item.product?.name || item.name,
            image: item.product?.image || item.image,
            restaurant: item.product?.restaurant || item.restaurant,
            distance: item.product?.distance || item.distance,
            originalPrice: item.product?.original_price || item.original_price,
            currentPrice: item.product?.current_price || item.current_price,
            stock: item.product?.stock || item.stock,
            quantity: item.quantity,
            // Add any other fields that might be needed
            ...item.product,
        })) || [];

        return NextResponse.json({
            success: true,
            items: mappedCartItems,
            total: cartData.total || 0,
        });

    } catch (error) {
        console.error("Cart GET error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST - Add/Update cart items
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

        // Map frontend CartItem format to backend format - only send id and quantity
        const mappedItems = items.map((item: CartItem) => ({
            surprise_bag: item.id,
            quantity: item.quantity,
        }));

        const response = await fetch(
            POST_CART,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    items: mappedItems,
                }),
            }
        );

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

// PUT - Update specific cart item
export async function PUT(req: Request) {
    try {
        const { isAuthenticated, token } = await checkAuth();

        if (!isAuthenticated) {
            return NextResponse.json(
                { success: false, message: "Unauthorized: No access token" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { productId, quantity } = body;

        if (!productId || quantity === undefined) {
            return NextResponse.json(
                { success: false, message: "Product ID and quantity are required" },
                { status: 400 }
            );
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/cart/item/${productId}/`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ quantity }),
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { success: false, message: "Failed to update cart item" },
                { status: response.status }
            );
        }

        const result = await response.json();

        return NextResponse.json({
            success: true,
            message: "Cart item updated successfully",
            data: result,
        });

    } catch (error) {
        console.error("Cart PUT error:", error);
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
            `${process.env.NEXT_PUBLIC_API_URL}/cart/item/${productId}/`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { success: false, message: "Failed to remove cart item" },
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
