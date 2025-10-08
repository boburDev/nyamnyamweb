import { Placemark } from "@pbe/react-yandex-maps";
import { memo, useMemo } from "react";
import { createCustomMarkerSVG } from "./MapSvg";
import { ProductData } from "@/types";

const MemoizedPlacemark = memo(
  ({
    product,
    isHighlighted,
    isActive,
    setHoveredId,
    handlePlacemarkClick,
  }: {
    product: ProductData;
    isHighlighted: boolean;
    isActive: boolean;
    setHoveredId?: (id: string | null) => void;
    handlePlacemarkClick: (id: string) => void;
  }) => {
    const options = useMemo(
      () => ({
        iconLayout: "default#image",
        iconImageHref: createCustomMarkerSVG(product, isHighlighted, isActive),
        iconImageSize: [120, 80],
        iconImageOffset: [-60, -80],
        openBalloonOnClick: true,
        balloonOffset: [0, -20],
        balloonPanelMaxMapArea: 0,
        zIndexHover: isActive ? 3000 : isHighlighted ? 2000 : 1000,
      }),
      [product, isHighlighted, isActive]
    );

    const properties = useMemo(
      () => ({
        hintContent: product.title ?? product.title,
        balloonContentBody: `
          <div style="width:360px;">
            <div style="display:flex;gap:12px;align-items:center;">
              <img src="${product.cover_image ?? product.cover_image ?? "/placeholder.svg"}" style="width:108px;height:107px;object-fit:cover;border-radius:8px;"/>
              <div style="flex:1;">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:15px;">
                  <h3 style="font-weight:500;font-size:20px;color:#2F2F2F;margin:0;">${product.title ?? product.title}</h3>
                  <span style="color:#6A6E78;font-size:14px;">⭐ ${product.overall_rating ?? 0}</span>
                </div>
                <p style="margin:4px 0;color:#6A6E78;font-size:14px;">${product.business_name ?? product.business_name} • ${product.distance_km ?? 0} km</p>
                <div style="display:flex;align-items:center;gap:8px;margin-top:15px;">
                  <span style="text-decoration:line-through;color:#9CA3AF;font-size:14px;">${product.price ?? product.price ?? ""}</span>
                  <span style="font-weight:600;color:#4FB477;font-size:18px;">${product.price_in_app ?? product.price_in_app ?? 0}</span>
                </div>
              </div>
            </div>
          </div>
        `,
      }),
      [product]
    );

    return (
      <Placemark
        key={product.id}
        geometry={product.lat && product.lon ? [product.lat, product.lon] : [0, 0]}
        options={options}
        properties={properties}
        onMouseEnter={() => setHoveredId?.(product.id)}
        onMouseLeave={() => setHoveredId?.(null)}
        onClick={() => handlePlacemarkClick(product.id)}
      />
    );
  },
  (prev, next) =>
    prev.isHighlighted === next.isHighlighted &&
    prev.isActive === next.isActive &&
    prev.product.id === next.product.id
);

MemoizedPlacemark.displayName = "MemoizedPlacemark";
export default MemoizedPlacemark;
