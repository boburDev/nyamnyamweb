import axios from "axios";

export async function getCart() {
  const res = await fetch(`/api/proxy/cart`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Cart olishda xatolik");
  const raw = await res.json();
  const data = raw?.data ?? raw;
  const cartItems = data?.cart_items || [];
  const cartTotal = data?.cart_total || 0;
  const mappedCartItems = cartItems.map((item: any) => ({
    id: item.id,
    name: item.title,
    image: item.surprise_bag_image,
    restaurant: item.branch_name,
    distance: item.distance_km,
    originalPrice: item.price,
    currentPrice: item.price_in_app,
    quantity: item.quantity,
    count: item.count,
    start_time: item.start_time,
    end_time: item.end_time,
    surprise_bag: item.surprise_bag,
  }));
  return { success: true, items: mappedCartItems, total: cartTotal };
}

export const addToCart = async (
  items: Array<{ id: string; quantity: number }>
) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/cart`,
      {
        items,
      }
    );
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data as
        | { backend?: string; message?: string; error_message?: string }
        | undefined;
      const errorMessage =
        data?.backend ||
        data?.message ||
        data?.error_message ||
        error.message ||
        "Xato yuz berdi";
      throw new Error(errorMessage);
    }
    throw new Error((error as Error)?.message || "Xato yuz berdi");
  }
};

export const deleteCartAll = async () => {
  try {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/cart/delete-all`
    );
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response.data?.error_message ||
        error.response.data?.message ||
        "Xato yuz berdi";
      throw new Error(errorMessage);
    }
  }
};
export const updateCart = async ({
  surprise_bag,
  quantity,
  id,
}: {
  surprise_bag: string;
  quantity: number;
  id: string;
}) => {
  try {
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/cart`,
      {
        id,
        surprise_bag,
        quantity,
      }
    );
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data;
      const errorMessage =
        data?.backend ||
        data?.message ||
        data?.error_message ||
        error.message ||
        "Xato yuz berdi";
      throw new Error(errorMessage);
    }
    throw new Error((error as Error)?.message || "Xato yuz berdi");
  }
};

export const deleteCartItem = async ({ id }: { id: string }) => {
  try {
    const res = await axios.delete(`/api/proxy/cart/${id}`);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data as
        | { backend?: string; message?: string; error_message?: string }
        | undefined;
      const errorMessage =
        data?.backend ||
        data?.message ||
        data?.error_message ||
        error.message ||
        "Xato yuz berdi";
      throw new Error(errorMessage);
    }
    throw new Error((error as Error)?.message || "Xato yuz berdi");
  }
};
