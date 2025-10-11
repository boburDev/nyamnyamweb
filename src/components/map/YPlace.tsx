import { Placemark } from "@pbe/react-yandex-maps";
import { memo, useMemo } from "react";
import { createCustomMarkerSVG } from "./MapSvg";
import { ProductData } from "@/types";

// tolerant coordinate parser
const parseCoord = (val: unknown): number => {
  if (val === null || val === undefined) return NaN;
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    // replace comma with dot, remove non-numeric except . and -
    const cleaned = val.trim().replace(",", ".").replace(/[^\d.-]/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : NaN;
  }
  return NaN;
};

const toLatin = (input?: string) => {
  if (!input) return "";
  const map: Record<string, string> = {
    // ... (sizin oldingi translit xaritasi shu yerda bo'lsa yetarli)
    // For brevity reuse previous map or keep as-is
  };
  // keep simple: if not provided, return original
  return input
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("");
};

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
    // support different possible keys
    // helper to safely access nested properties on unknown objects without using `any`
    const getNested = (obj: unknown, path: string[]) =>
      path.reduce<unknown | undefined>((acc, key) => {
        if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
          return (acc as Record<string, unknown>)[key];
        }
        return undefined;
      }, obj);

    const latNum = useMemo(() => {
      const val =
        product.lat ??
        getNested(product, ["coords", "lat"]) ??
        getNested(product, ["latitude"]);
      return parseCoord(val);
    }, [product]);

    const lonNum = useMemo(() => {
      const val =
        product.lon ??
        getNested(product, ["coords", "lon"]) ??
        getNested(product, ["longitude"]);
      return parseCoord(val);
    }, [product]);

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
        hintContent: toLatin(product.title ?? ""),
        balloonContentBody: `
          <div style="width:360px;">
            <div style="display:flex;gap:12px;align-items:center;">
              <img src="${product.cover_image ?? "/placeholder.svg"}" style="width:108px;height:107px;object-fit:cover;border-radius:8px;"/>
              <div style="flex:1;">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:15px;">
                  <h3 style="font-weight:500;font-size:20px;color:#2F2F2F;margin:0;">${toLatin(product.title ?? "")}</h3>
                  <span style="color:#6A6E78;font-size:14px;">⭐ ${product.overall_rating ?? 0}</span>
                </div>
                <p style="margin:4px 0;color:#6A6E78;font-size:14px;">${toLatin(product.business_name ?? "")} • ${product.distance ?? 0} km</p>
                <div style="display:flex;align-items:center;gap:8px;margin-top:15px;">
                  <span style="text-decoration:line-through;color:#9CA3AF;font-size:14px;">${product.price ?? ""}</span>
                  <span style="font-weight:600;color:#4FB477;font-size:18px;">${product.price_in_app ?? 0}</span>
                </div>
              </div>
            </div>
          </div>
        `,
      }),
      [product]
    );

    if (!Number.isFinite(latNum) || !Number.isFinite(lonNum)) {
      // helpful debug when coordinates missing/invalid
      // console.warn(`Placemark skipped for ${product.id} — invalid coords:`, product.lat, product.lon);
      return null;
    }

    return (
      <Placemark
        key={product.id}
        geometry={[latNum, lonNum]}
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
