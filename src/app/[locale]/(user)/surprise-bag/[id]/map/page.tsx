"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getSurpriseBagSingle } from "@/api";
import { Container } from "@/components/container";

const YandexMap = dynamic(() => import("@/components/map/YandexMap"), {
  ssr: false,
});

interface Props {
  params: { id: string; locale: string };
}

const SurpriseBagMapPage = ({ params }: Props) => {
  const { id, locale } = params;
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSurpriseBagSingle({ id, locale });
        setProduct(data);
      } catch (err) {
        console.error("SurpriseBagMapPage error:", err);
      }
    };
    fetchData();
  }, [id, locale]);

  if (!product) {
    return (
      <Container className=" ">
        <p className="text-center text-lg text-dolphin">Mahsulot topilmadi 😕</p>
      </Container>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-5 left-5 z-50">
        <Link href={`/${locale}/surprise-bag/${product.id}`}>
          <Button
            variant="secondary"
            className="flex items-center gap-2 bg-white/90 hover:bg-white text-textColor shadow-md"
          >
            <ArrowLeft size={18} />
            Orqaga
          </Button>
        </Link>
      </div>

      <YandexMap
        products={[product]}
        hoveredId={product.id}
        activeId={product.id}
        mapRef={{ current: null }}
        handlePlacemarkClick={() => {}}
      />
    </div>
  );
};

export default SurpriseBagMapPage;
