import axios from "axios";

export async function getCart() {
  try {
    const res = await fetch(`/api/proxy/cart`, {
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Cart olishda xatolik");

    const raw = await res.json();
    return raw?.data ?? raw;
  } catch (error) {
    console.log(error);
    return [];
  }
}
export async function getCartLatLon({
  lat,
  lon,
}: {
  lat?: number;
  lon?: number;
}) {
  try {
    const params = { lat, lon };
    const res = await axios(`/api/proxy/cart`, {
      withCredentials: true,
      params,
    });
    const raw = await res.data;
    return raw?.data ?? raw;
  } catch (error) {
    console.log(error);
    return [];
  }
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

export const deleteCartItem = async (id: string) => {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/cart/${id}`
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
