import { ProductData } from "@/types";

export const isProductInList = (
  list: ProductData[] = [],
  product?: ProductData
) => {
  if (!product) return false;
  return list?.some((item) => String(item?.id) === String(product?.id));
};

