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
            let backendData: unknown;
            try {
                backendData = await response.json();
            } catch (_error) {
                backendData = undefined;
            }
            const error_message =
                (backendData as { error_message?: string; message?: string })?.error_message ||
                (backendData as { error_message?: string; message?: string })?.message ||
                "Failed to fetch favourites";
            return NextResponse.json(
                { success: false, message: error_message },
                { status: response.status }
            );
        }

        const backend = await response.json();
        const list = Array.isArray(backend)
            ? backend
            : Array.isArray(backend?.data)
                ? backend.data
                : Array.isArray(backend?.items)
                    ? backend.items
                    : [];

        return NextResponse.json({
            success: true,
            data: list,
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
            let backendData: unknown;
            try {
                backendData = await response.json();
            } catch (_error) {
                backendData = undefined;
            }
            const error_message =
                (backendData as { error_message?: string; message?: string })?.error_message ||
                (backendData as { error_message?: string; message?: string })?.message ||
                "Failed to update favourites";
            return NextResponse.json(
                { success: false, message: error_message },
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
        const ids = searchParams.getAll("id"); 

        const response = await (async () => {
            if (ids.length === 1) {
                // Delete a single favourite by id
                return await fetch(
                    `${FAVORITE}${encodeURIComponent(ids[0])}/`,
                    {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }
            // Delete multiple or all favourites
            const query = ids.length ? `?${ids.map((id) => `id=${encodeURIComponent(id)}`).join("&")}` : "";
            return await fetch(
                DELETE_FAVORITE + query,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        })();

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
                "Failed to remove favourites";
            return NextResponse.json(
                { success: false, message: error_message },
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


