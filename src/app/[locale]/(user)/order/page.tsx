"use client";
import { OrderAccordion } from "@/components/accordion";
import { Container } from "@/components/container";
import { EmptyOrder } from "@/components/order";
import { useState } from "react";
import { useGetOrder } from "@/hooks";
import { useLocale, useTranslations } from "next-intl";
import { PageHeader } from "@/components/header/PageHeader";

export default function OrderPage() {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const { data } = useGetOrder(locale);
  const t = useTranslations("UserMenu");

  return (
    <Container>
      <PageHeader title={t("order")} />
      <div className="sm:pt-6.5 2xl:pt-[150px] h-full">
        {data?.length > 0 ? (
          <>
            <h1 className="hidden md:block font-medium text-[28px] xl:text-4xl mb-5 2xl:mb-4">{t("order")}</h1>
            <OrderAccordion open={open} setOpen={setOpen} orders={data} />
          </>
        ) : (
          <EmptyOrder />
        )}
      </div>
    </Container>
  );
}
