// components/ProductCard.tsx
"use client";

import Image from "next/image";
import React from "react";

interface Item {
  id: string;
  cover_image: string;
  title: string;
  business_name: string;
  branch_name: string;
  price_in_app: number;
  currency: string;
  start_time: string;
  end_time: string;
}

interface ProductCardProps {
  item: Item;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  return (
    <div className="border rounded-lg shadow-sm p-4 flex flex-col gap-2">
      <Image
        src={item.cover_image}
        alt={item.title}
        width={400}
        height={300}
        className="w-full h-48 object-cover rounded-lg"
      />
      <h3 className="text-lg font-semibold">{item.title}</h3>
      <p className="text-sm text-gray-500">
        {item.business_name} — {item.branch_name}
      </p>
      <p className="text-sm">
        {item.price_in_app.toLocaleString()} {item.currency}
      </p>
      <p className="text-xs text-gray-400">
        🕐 {item.start_time} — {item.end_time}
      </p>
    </div>
  );
};
