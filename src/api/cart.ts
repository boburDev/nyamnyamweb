export async function getCart() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/cart`);
  if (!res.ok) throw new Error("Cart olishda xatolik");
  return res.json();
}
