"use client";
import { Container } from "@/components/container";
import { EmptyOrder } from "@/components/order";
import { useGetOrderHistory } from "@/hooks";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionTrigger, AccordionItem, AccordionContent } from "@/components/ui/accordion";
import Image from "next/image";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface OrderItem {
  status: string;
  title: string;
  price: number;
  original_price: number;
  count: number;
  business_branch_name: string;
  business_name: string;
  overall_rating: number | null;
  surprise_bag_img: string;
  start_time: string;
  pickup_date: string;
}

interface Order {
  id: string;
  order_number: string;
  payment_status: string;
  payment_method: string;
  total_price: number;
  order_items: OrderItem[];
  updated_at?: string;
}

export function OrderHistoryClient() {
  const locale = useLocale();
  const t = useTranslations("orders-history");
  const { data: orders } = useGetOrderHistory(locale);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);

  const filtered = (orders || [])
    .filter((order: Order) => {
      const first = order.order_items[0];

      // status filter
      if (statusFilter !== "all") {
        if (first.status !== statusFilter) return false;
      }

      // date filter
      if (dateFilter && first.pickup_date) {
        const orderDate = new Date(first.pickup_date);
        return (
          orderDate.getFullYear() === dateFilter.getFullYear() &&
          orderDate.getMonth() === dateFilter.getMonth() &&
          orderDate.getDate() === dateFilter.getDate()
        );
      }

      return true;
    });

  return (
    <Container>
      <div className="pt-[40px] pb-10">

        <h1 className="font-medium text-4xl mb-6 hidden md:block">
          {t("title")}
        </h1>

        {/* FILTERS */}
        <div className="flex-col sm:flex-row gap-4 mb-6 hidden md:flex">

          {/* Status filter */}
          <div className="flex flex-col gap-2">
            <label className="text-textColor font-medium">{t("select.title")}</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white! border-borderColor2! rounded-[13px]! h-12! w-full sm:w-[200px] shadow-none!">
                <SelectValue placeholder={t("select.placeholder")}>
                  {statusFilter === "all"
                    ? t("select.element-1")
                    : statusFilter === "resolve"
                      ? t("select.element-2")
                      : t("select.element-3")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="border-none!">
                <SelectItem value="all">{t("select.element-1")}</SelectItem>
                <SelectItem value="resolve">{t("select.element-2")}</SelectItem>
                <SelectItem value="reject">{t("select.element-3")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date filter */}
          <div className="flex flex-col gap-2">
            <label className="text-textColor font-medium">{t("date.title")}</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="!border-borderColor2 rounded-[13px]! h-12 w-[200px] flex justify-start">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {dateFilter ? format(dateFilter, "yyyy.MM.dd") : t("date.placeholder")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dateFilter} onSelect={setDateFilter} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* ACCORDION */}
        {filtered.length > 0 ? (
          <Accordion type="single" defaultValue="order-0" collapsible className="w-full space-y-2">

            {filtered.map((order: Order, index: number) => {
              const first = order.order_items[0];

              return (
                <AccordionItem
                  key={order.id}
                  value={`order-${index}`}
                  className="w-full rounded-[15px] md:rounded-[20px] xl:rounded-[30px] border-b-0 bg-white"
                >
                  <AccordionTrigger className="px-[15px] py-[15px] md:!px-5 md:!py-5 xl:px-[30px] xl:!py-[24px] flex items-center hover:no-underline [&>svg]:size-6 xl:[&>svg]:size-8">
                    <div className="text-left">
                      <p className="flex flex-col font-semibold sm:text-lg">
                        {t("order")} №{order.order_number} ({order.order_items.length} {t("pcs")})
                      </p>
                      <span className="!font-normal text-xs md:text-base text-dolphin flex items-center gap-[6px]">
                        <CalendarDays size={16} /> {first.pickup_date}
                        <Clock size={16} /> {first.start_time}
                      </span>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-4 pb-4 space-y-4">
                    <div className="hidden xl:block w-full h-[1px] bg-plasterColor mt-[15px]"></div>
                    {order.order_items.map((product, i) => (
                      <div key={i} className="flex flex-col 3xs:flex-row gap-4 border border-plasterColor rounded-[12px] md:rounded-[15px] xl:rounded-[30px] p-4 md:p-[15px] xl:p-5 2xl:p-[30px]">

                        <Image
                          src={product.surprise_bag_img}
                          width={220}
                          height={180}
                          alt={product.title}
                          className="rounded-lg object-cover w-full 3xs:w-[180px] sm:w-[220px]  "
                        />

                        <div className="flex flex-col justify-between w-full">

                          <div>
                            <h3 className="text-lg font-medium">{product.title}</h3>
                            <p className="text-sm text-dolphin mt-1">
                              {product.business_name} • {product.business_branch_name}
                            </p>
                          </div>

                          <div className="flex flex-col 2sm:flex-row justify-between 2sm:items-center mt-2">
                            <p className="font-semibold text-green-600 text-xl">
                              {product.price.toLocaleString()} UZS
                            </p>
                            <span
                              className={cn(
                                "px-3 py-1.5 rounded-lg text-sm font-medium capitalize text-center mt-2 sm:w-max",
                                product.status === "pending"
                                  ? "bg-orange-50 text-orange-400"
                                  : product.status === "reject"
                                    ? "bg-red-50 text-red-600"
                                    : "bg-green-50 text-green-600"
                              )}
                            >
                              {t(`status.${product.status}`)}
                            </span>
                          </div>

                        </div>

                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <EmptyOrder />
        )}
      </div>
    </Container>
  );
}
