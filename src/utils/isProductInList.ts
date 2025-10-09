import { CartItem } from "@/context/cartStore";
import { ProductData } from "@/types";

export const isProductInList = (list: CartItem[] = [], product?: ProductData) => {
  if (!product) return false;
  return list?.some((item) => String(item?.id) === String(product?.id));
};
