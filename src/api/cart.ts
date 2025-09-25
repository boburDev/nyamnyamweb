export async function getCart() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/cart`);
  if (!res.ok) throw new Error("Cart olishda xatolik");
  return res.json();
}
import axios from "axios";

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
    const res = await axios.patch(`${process.env.NEXT_PUBLIC_APP_URL}/api/cart`, {
      id,
      surprise_bag,
      quantity,
    });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // Agar server bizning Next.js API yoki bevosita backenddan custom backend message qaytgan bo'lsa shu maydonlarni tekshiramiz
      const data = error.response.data;
      const errorMessage =
        data?.backend || data?.message || data?.error_message || error.message || "Xato yuz berdi";
      throw new Error(errorMessage);
    }
    throw new Error((error as Error)?.message || "Xato yuz berdi");
  }
};