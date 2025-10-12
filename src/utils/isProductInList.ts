import { ProductData } from "@/types";

export const isProductInList = (
  list: ProductData[] = [],
  product?: ProductData
) => {
  if (!product) return false;
  return list?.some((item) => String(item?.id) === String(product?.id));
};

export const isFavouriteInList = (
  list: ProductData[] = [],
  product?: ProductData,
  saved?: boolean
) => {
  if (!product) return false;
  if (saved) return true;
  return list?.some(
    (item) => String(item?.surprise_bag) === String(product?.id)
  );
};
