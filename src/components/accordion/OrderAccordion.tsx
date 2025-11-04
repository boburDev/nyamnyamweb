"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CalendarDays, Clock, ScanQrCode } from "lucide-react";
import { Button } from "../ui/button";
import { QrCodeModal } from "../modal";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface OrderItem {
  status: string;
  title: string;
  price: number;
  original_price: number;
  count: number;
  business_branch_name: string;
  overall_rating: number;
  surprise_bag_img: string;
  start_time: string;
  end_time: string;
  qr_code_img: string;
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

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  orders: Order[];
}

export const OrderAccordion = ({ open, setOpen, orders = [] }: Props) => {
  const [qrCode, setQrCode] = useState<string>("");
  const t = useTranslations("my-orders.cards");
  
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full space-y-2"
      defaultValue="item-1"
    >
      {orders.map((item, index) => (
        <AccordionItem
          key={item.id}
          value={`item-${index + 1}`}
          className="w-full rounded-[15px] md:rounded-[20px] xl:rounded-[30px] border-b-0 bg-white"
        >
          <AccordionTrigger className="px-[15px] py-[15px] md:!px-5 md:!py-5 xl:px-[30px] xl:!py-[24px] flex items-center hover:no-underline [&>svg]:size-6 xl:[&>svg]:size-8">
            <p className="flex flex-col font-semibold sm:text-lg">
              {t("title")} №{item.order_number} ({item.order_items.length} {t("ta")})
              <span className="!font-normal text-xs md:text-base text-dolphin flex items-center gap-[6px]">
                <CalendarDays className="size-3 md:size-4" />
                {item.order_items[0]?.pickup_date}
                <Clock className="size-3 md:size-4" />
                {item.order_items[0]?.start_time}
              </span>
            </p>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground px-[15px] md:px-5">
            <div>
              <div className="hidden xl:block w-full h-[1px] bg-plasterColor mt-[25px]"></div>
              {item.order_items.map((product, idx) => {
                // const startDateTime = product.pickup_date
                //   ? new Date(`${product.pickup_date}T${product.start_time}`)
                //   : null;
                // const endDateTime = product.pickup_date
                //   ? new Date(`${product.pickup_date}T${product.end_time}`)
                //   : null;

                return (
                  <div
                    key={idx}
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
                        <p>
                          {
                            item.payment_status === 'success' && (
                              <span className="bg-statusBg text-mainColor px-1.5 2xs:px-2.5 md:px-[15px] py-1.5 xl:py-[4.5px] rounded-[10px] md:rounded-[12px] w-fit text-[10px] 2xs:text-xs md:text-base">
                                {t("taken-away-badge")}
                              </span>
                            )
                          }
                          {
                            item.payment_status === 'cancel' && (
                              <span className="bg-statusRed text-red-600 px-1.5 2xs:px-2.5 md:px-[15px] py-1.5 xl:py-[4.5px] rounded-[10px] md:rounded-[12px] w-fit text-[10px] 2xs:text-xs md:text-base">
                                {t("canceled-badge")}
                              </span>
                            )
                          }
                          {
                            item.payment_status === 'waiting' && (
                              <span className="bg-accordionText/10 text-accordionText px-1.5 2xs:px-2.5 md:px-[15px] py-1.5 xl:py-[4.5px] rounded-[10px] md:rounded-[12px] w-fit text-[10px] 2xs:text-xs md:text-base">
                                {t("waiting-badge")}
                              </span>
                            )
                          }
                        </p>
                      </div>
                      <h4 className="text-xs md:text-sm xl:text-lg text-dolphin mt-[5px] xl:mt-2">
                        {product.business_branch_name}
                      </h4>
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-1 md:gap-0 mt-3 xl:mt-[25px]">
                        <h5 className="text-xs md:text-sm xl:text-base text-dolphin">
                          {t("order-quantity")}  {product.count} {t("ta")}
                        </h5>
                        <p className="font-medium text-xs 2xs:text-sm xl:text-base text-dolphin">
                          <span className="text-mainColor"> {t("order-time")}</span>  {product.start_time} - {product.end_time}
                        </p>
                      </div>
                      <div className="flex justify-between items-center pt-3 xl:pt-[25px]">
                        <div className="md:flex-row-reverse xl:flex-row flex items-center gap-1 2xs:gap-2.5">
                          <h4 className="font-semibold text-base 2xs:text-lg md:text-[20px] xl:text-[22px] text-mainColor">
                            {product.price?.toLocaleString()} so‘m
                          </h4>
                          <p className="flex gap-1 text-xs md:text-sm xl:text-[15px] line-through text-dolphin mt-1 md:mt-0 xl:mt-1">
                            {product.original_price?.toLocaleString()} <span className="hidden xl:block">so‘m</span>
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            setQrCode(product.qr_code_img);
                            setOpen(true);
                          }}
                          className="xl:!bg-plasterColor rounded-[10px] xl:rounded-xl text-xs md:text-sm"
                          variant={"outline"}
                        >
                          <ScanQrCode size={20} />
                          QR kod
                        </Button>
                      </div>
                    </div>
                    {/* <div className="flex flex-col justify-between">
                      <div className="bg-hoverColor rounded-[15px] flex px-5 py-[9px] gap-[10px]">
                        <div className="flex gap-[5px]">
                          <CalendarDays size={16} />
                          {item.order_items[0]?.pickup_date}
                        </div>
                        <h4 className="">
                          {startDateTime && !isNaN(startDateTime.getTime())
                            ? format(startDateTime, "HH:mm")
                            : "--:--"}{" "}
                          -{" "}
                          {endDateTime && !isNaN(endDateTime.getTime())
                            ? format(endDateTime, "HH:mm")
                            : "--:--"}
                        </h4>
                      </div>
                    </div> */}
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
      <QrCodeModal open={open} setOpen={setOpen} qrCode={qrCode} />
    </Accordion>
  );
};

export default OrderAccordion;
