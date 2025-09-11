import CartComponent from "@/components/cart/CartComponent";
import { getAuthStatus } from "@/lib/auth";

export default async function CartPage() {
  const isAuth = await getAuthStatus();
  
  return <CartComponent isAuth={isAuth} />;
}
