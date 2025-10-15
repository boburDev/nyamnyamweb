"use client";
import { OrderAccordion } from "@/components/accordion";
import { Container } from "@/components/container";
import { useState } from "react";
import { useGetOrder } from "@/hooks";

export default function OrderPage() {
  const [open, setOpen] = useState(false);
  const { data } = useGetOrder();
  console.log(data);

  return (
    <Container>
      {data?.length > 0 && (
        <div className="pt-[150px]">
          <h1 className=" font-medium text-4xl mb-4">Buyurtmalarim</h1>
          <OrderAccordion open={open} setOpen={setOpen} orders={data} />
        </div>
      )}
    </Container>
  );
}
