import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN, FAVORITE, POST_FAVORITE, DELETE_FAVORITE } from "@/constants";

// Helper function to check authentication
async function checkAuth() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN)?.value;

    if (!accessToken) {
        return { isAuthenticated: false, token: null };
    }

    return { isAuthenticated: true, token: accessToken };
}

// GET - Retrieve user's favourites
export async function GET() {
    try {
        const { isAuthenticated, token } = await checkAuth();

        if (!isAuthenticated) {
            return NextResponse.json(
                { success: false, message: "Unauthorized: No access token" },
                { status: 401 }
            );
        }

        const response = await fetch(
            FAVORITE,
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
                { success: false, message: "Failed to fetch favourites" },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json({
            success: true,
            data,
        });

    } catch (error) {
        console.error("Favourites GET error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST - Bulk create favourites
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
        const { items } = body || {};

        if (!items || !Array.isArray(items)) {
            return NextResponse.json(
                { success: false, message: "Invalid favourite items" },
                { status: 400 }
            );
        }

        type FavouriteItemInput = string | number | { id?: string | number; surprise_bag?: string | number };
        const mappedItems = (items as FavouriteItemInput[]).map((item) => ({
            surprise_bag: typeof item === "string" || typeof item === "number" ? item : (item.surprise_bag ?? item.id),
        }));

        const response = await fetch(
            POST_FAVORITE,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ items: mappedItems }),
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { success: false, message: "Failed to update favourites" },
                { status: response.status }
            );
        }

        const result = await response.json();

        return NextResponse.json({
            success: true,
            message: "Favourites updated successfully",
            data: result,
        });

    } catch (error) {
        console.error("Favourites POST error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE - Remove all or specific favourites
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
        const ids = searchParams.getAll("id"); // /api/favourite?id=123&id=456

        const response = await fetch(
            DELETE_FAVORITE + (ids.length ? `?${ids.map((id) => `id=${encodeURIComponent(id)}`).join("&")}` : ""),
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
                { success: false, message: "Failed to remove favourites" },
                { status: response.status }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Favourites removed successfully",
        });

    } catch (error) {
        console.error("Favourites DELETE error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}


