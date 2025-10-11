import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN, DOMAIN, FAVORITE } from "@/constants";

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
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: No access token" },
      { status: 401 }
    );
  }
  const body = await req.json();

  const response = await fetch(`${DOMAIN}/favourites/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ surprise_bag: body.id }),
  });

  const text = await response.text();
  console.log("API response:", text);

  try {
    return NextResponse.json(JSON.parse(text), { status: response.status });
  } catch {
    return new NextResponse(text, { status: response.status });
  }
}

// DELETE - Remove all or specific favourites
// export async function DELETE(req: Request) {
//     try {
//         const { isAuthenticated, token } = await checkAuth();

//         if (!isAuthenticated) {
//             return NextResponse.json(
//                 { success: false, message: "Unauthorized: No access token" },
//                 { status: 401 }
//             );
//         }

//         const { searchParams } = new URL(req.url);
//         const ids = searchParams.getAll("id");

//         const response = await (async () => {
//             if (ids.length === 1) {
//                 // Delete a single favourite by id
//                 return await fetch(
//                     `${FAVORITE}${encodeURIComponent(ids[0])}/`,
//                     {
//                         method: "DELETE",
//                         headers: {
//                             "Content-Type": "application/json",
//                             Authorization: `Bearer ${token}`,
//                         },
//                     }
//                 );
//             }
//             // Delete multiple or all favourites
//             const query = ids.length ? `?${ids.map((id) => `id=${encodeURIComponent(id)}`).join("&")}` : "";
//             return await fetch(
//                 process.env.NEXT_PUBLIC_API_URL + FAVORITE + query,
//                 {
//                     method: "DELETE",
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );
//         })();

//         if (!response.ok) {
//             let backendData: unknown;
//             try {
//                 backendData = await response.json();
//             } catch (_error) {
//                 backendData = undefined;
//             }
//             const error_message =
//                 (backendData as { error_message?: string; message?: string })?.error_message ||
//                 (backendData as { error_message?: string; message?: string })?.message ||
//                 "Failed to remove favourites";
//             return NextResponse.json(
//                 { success: false, message: error_message },
//                 { status: response.status }
//             );
//         }

//         return NextResponse.json({
//             success: true,
//             message: "Favourites removed successfully",
//         });

//     } catch (error) {
//         console.error("Favourites DELETE error:", error);
//         return NextResponse.json(
//             { success: false, message: "Internal server error" },
//             { status: 500 }
//         );
//     }
// }

export async function DELETE(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: No access token" },
      { status: 401 }
    );
  }
  const body = await req.json();

  const response = await fetch(`${FAVORITE}${body.id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const text = await response.text();
  console.log("API response:", text);

  try {
    return NextResponse.json(JSON.parse(text), { status: response.status });
  } catch {
    return new NextResponse(text, { status: response.status });
  }
}



