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
