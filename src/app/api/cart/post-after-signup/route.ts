import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN, POST_CART } from "@/constants";
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
console.log("TOKEN HERE:", ACCESS_TOKEN);

// POST - Post cart items after successful signup
export async function POST(req: Request) {
    try {
        const { isAuthenticated, token } = await checkAuth();

        if (!isAuthenticated) {
            return NextResponse.json(
                { success: false, message: "Unauthorized: No access token" },
                { status: 401 }
            );
        }
        console.log("Body here: ", req);

        const body = await req.json();
        console.log("API received cart data:", body); // Debug log
        const { items } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { success: false, message: "No cart items to post" },
                { status: 400 }
            );
        }

        // Map frontend CartItem format to backend format - only send id and quantity
        // Backend mappingni shunday qiling:
        const mappedItems = items.map((item: CartItem) => ({
            surprise_bag: item.surprise_bag ?? item.id, // agar frontenddan surprise_bag kelsa uni ishlatadi
            quantity: item.quantity,
        }));


        console.log("Mapped items for backend:", mappedItems); // Debug log

        const requestBody = {
            items: mappedItems,
        };

        console.log("Sending to backend:", JSON.stringify(requestBody, null, 2)); // Debug log    

        const response = await fetch(
            POST_CART,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            }
        );
        console.log("Post cart", POST_CART);

        console.log("Response here: ", response);


        if (!response.ok) {
            const errorData = await response.text();
            console.error("Cart POST error:", errorData);
            return NextResponse.json(
                { success: false, message: "Failed to post cart items" },
                { status: response.status }
            );
        }

        const result = await response.json();

        return NextResponse.json({
            success: true,
            message: "Cart items posted successfully",
            data: result,
        });

    } catch (error) {
        console.error("Cart POST after signup error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
