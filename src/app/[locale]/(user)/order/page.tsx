"use client";
import { OrderAccordion } from "@/components/accordion";
import { Container } from "@/components/container";
import { EmptyOrder } from "@/components/order";
import { useState } from "react";
import { useGetOrder } from "@/hooks";
import { useLocale } from "next-intl";

export default function OrderPage() {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const { data } = useGetOrder(locale);
  console.log(data);

  return (
    <Container>
      <div className="pt-[150px]">
        {data?.length > 0 ? (
          <>
            <h1 className="font-medium text-4xl mb-4">Buyurtmalarim</h1>
            <OrderAccordion open={open} setOpen={setOpen} orders={data} />
          </>
        ) : (
          <EmptyOrder />
        )}
      </div>
    </Container>
  );
}
