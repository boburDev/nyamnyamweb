"use client";
import { Container } from "@/components/container";
import { EmptyOrder } from "@/components/order";
import { useGetOrderHistory } from "@/hooks";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, Clock, ScanQrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionTrigger, AccordionItem, AccordionContent } from "@/components/ui/accordion";
import Image from "next/image";
import { format } from "date-fns";
import { QrCodeModal } from "../modal";
import { cn } from "@/lib/utils";

interface OrderItem {
  status: string;
  title: string;
  price: number;
  original_price: number;
  count: number;
  business_branch_name: string;
  business_name: string;
  overall_rating: number;
  surprise_bag_img: string;
  start_time: string;
  end_time: string;
  qr_code_img: string;
  pickup_date: string;
  order_item_number: string;
}

interface Order {
  id: string;
  order_number: string;
  payment_status: string;
  payment_method: string;
  total_price: number;
  order_items: OrderItem[];
  updated_at?: string;
  created_at?: string;
}
export function OrderHistoryClient() {
  const locale = useLocale();
  const t = useTranslations("orders-history");
  const { data: orders } = useGetOrderHistory(locale);
  const [qrCode, setQrCode] = useState<string>("");
  const [order_item_number, setOrderItemNumber] = useState<string>("");
  const [orderId, setOrderId] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
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
          <Accordion
            type="single"
            defaultValue="order-0"
            collapsible
            className="w-full space-y-2"
          >
            {filtered.map((order: Order, index: number) => {

              return (
                <AccordionItem
                  key={order.id}
                  value={`order-${index}`}
                  className="w-full rounded-[15px] md:rounded-[20px] xl:rounded-[30px] border-b-0 bg-white"
                >
                  <AccordionTrigger className="px-[15px] py-[15px] md:!px-5 md:!py-5 xl:px-[30px] xl:!py-[24px] flex items-center hover:no-underline [&>svg]:size-6 xl:[&>svg]:size-8">
                    <p className="flex flex-col font-semibold sm:text-lg">
                      {t("order")} №{order.order_number} ({order.order_items.length} {t("pcs")})
                      <span className="!font-normal text-xs md:text-base text-dolphin flex items-center gap-[6px]">
                        <CalendarDays className="size-3 md:size-4" />
                        {order.created_at?.slice(0, 10)}
                        <Clock className="size-3 md:size-4" />
                        {order.created_at?.slice(11, 16)}
                      </span>
                    </p>
                  </AccordionTrigger>

                  <AccordionContent className="text-muted-foreground px-[15px] md:px-5">
                    <div>
                      <div className="hidden xl:block w-full h-[1px] bg-plasterColor mt-[25px]"></div>

                      {order.order_items.map((product, i) => (
                        <div
                          key={i}
                          className="flex border border-plasterColor mb-3 last:mb-0 xl:mb-0 xl:mt-3 rounded-[12px] md:rounded-[15px] xl:rounded-[30px] p-4 md:p-[15px] xl:p-5 2xl:p-[30px]"
                        >
                          <Image
                            src={product.surprise_bag_img}
                            width={220}
                            height={180}
                            className="hidden md:block w-[160px] h-[141px] xl:w-[253px] xl:h-[183px] rounded-[12px] xl:rounded-[20px] object-cover"
                            alt={product.title}
                          />

                          <div className="w-full md:ml-[15px] xl:ml-5">
                            <div className="flex justify-between w-full items-center">
                              <h3 className="font-medium md:text-lg xl:text-[22px] text-textColor">
                                {product.title}
                              </h3>

                              {/* STATUS BADGE */}
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

                            <h4 className="text-xs md:text-sm xl:text-lg text-dolphin mt-[5px] xl:mt-2">
                              {product.business_name} • {product.business_branch_name}
                            </h4>

                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-1 md:gap-0 mt-3 xl:mt-[25px]">
                              <h5 className="text-xs md:text-sm xl:text-base text-dolphin flex flex-col gap-2">
                                {t("order-quantity")} {product.count} {t("pcs")}
                                 <span className="flex gap-1"><CalendarDays size={16} className="mt-[3px]"/> {product.pickup_date}</span>
                              </h5>

                              <p className="font-medium text-xs 2xs:text-sm xl:text-base text-dolphin">
                                <span className="text-mainColor">{t("order-time")}</span>{" "}
                                {product.start_time.slice(0, 5)} - {product.end_time.slice(0, 5)}
                              </p>
                            </div>

                            <div className="flex flex-col 3xs:flex-row justify-between sm:items-center pt-3 xl:pt-[25px]">
                              <div className="md:flex-row-reverse xl:flex-row flex items-center gap-1 2xs:gap-2.5">
                                <h4 className="font-semibold text-base 2xs:text-lg md:text-[20px] xl:text-[22px] text-mainColor">
                                  {product.price?.toLocaleString()} so‘m
                                </h4>

                                <p className="flex gap-1 text-xs md:text-sm xl:text-[15px] line-through text-dolphin mt-1 md:mt-0 xl:mt-1">
                                  {product.original_price?.toLocaleString()}
                                  <span className="hidden xl:block">so‘m</span>
                                </p>
                              </div>

                              <div className="flex flex-col 3xs:flex-row items-center gap-2 mt-2 3xs:mt-0">
                                {/* QR BUTTON (waiting) */}
                                {product.status === "pending" && (
                                  <Button
                                    onClick={() => {
                                      setQrCode(product.qr_code_img);
                                      setOrderItemNumber(product.order_item_number);
                                      setOrderId(order.id);
                                      setOpen(true);
                                    }}
                                    className="xl:!bg-plasterColor rounded-[10px] xl:rounded-xl text-xs md:text-sm w-full 3xs:w-max"
                                    variant="outline"
                                  >
                                    <ScanQrCode size={20} /> ({t("qr-code")})
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
            <QrCodeModal open={open} setOpen={setOpen} qrCode={qrCode} order_item_number={order_item_number} orderId={orderId} />
          </Accordion>

        ) : (
          <EmptyOrder />
        )}
      </div>
    </Container>
  );
}
