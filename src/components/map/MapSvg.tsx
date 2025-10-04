import { Product } from "@/api/product";

export const createCustomMarkerSVG = (
  product: Product,
  isHighlighted: boolean,
  isActive: boolean
) => {
  let topBgColor = "#fff";
  let bottomBgColor = "#000";
  let textColor = "#000";

  if (isActive || isHighlighted) {
    topBgColor = "#4FB477";
    bottomBgColor = "#000";
    textColor = "#fff";
  }

  const formattedRating =
    typeof product.rating === "number" ? product.rating.toFixed(1) : "0.0";

  const parsePrice = (price?: string | number): number => {
    if (typeof price === "number") return price;
    if (typeof price === "string")
      return parseFloat(price.replace(/[^\d]/g, "")) || 0;
    return 0;
  };

  const originalPrice = parsePrice(product.originalPrice ?? product.original_price);
  const currentPrice = parsePrice(product.currentPrice ?? product.price_in_app);

  const discountPercent =
    originalPrice > 0
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;
  const formattedDiscount = `-${discountPercent}%`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg width="30" height="45" viewBox="0 0 30 45" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.4)"/>
        </filter>
      </defs>
      <g>
        <rect x="0" y="0" width="30" height="24" fill="${topBgColor}" filter="url(#shadow)" />
        <rect x="0" y="23" width="30" height="18" fill="${bottomBgColor}" filter="url(#shadow)" />
      </g>
      <text x="15" y="13" font-family="Arial" font-size="8px" font-weight="bold" fill="${textColor}" text-anchor="middle">
        ${formattedRating}
      </text>
      <text x="15" y="33" font-family="Arial" font-size="6px" fill="#fff" text-anchor="middle">
        ${formattedDiscount}
      </text>
    </svg>
  `)}`;
};
