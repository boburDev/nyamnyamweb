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
import { format } from "date-fns";
import { useState } from "react";

interface OrderItem {
  status: string;
  title: string;
  price: number;
  original_price: number;
  count: number;
  business_branch: string;
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
  console.log(qrCode);

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full space-y-2 mt-4"
      defaultValue="item-1"
    >
      {orders.map((item, index) => (
        <AccordionItem
          key={item.id}
          value={`item-${index + 1}`}
          className="w-full rounded-[30px] border-b-0 bg-white"
        >
          <AccordionTrigger className="px-[30px] !py-[24px] flex items-center hover:no-underline [&>svg]:size-6 xl:[&>svg]:size-8">
            <p className="flex flex-col font-semibold text-lg">
              Buyurtma №{item.order_number} ({item.order_items.length} ta)
              <span className="!font-normal text-[16px] text-dolphin flex items-center gap-[6px]">
                <CalendarDays size={16} />
                {item.order_items[0]?.pickup_date}
                <Clock size={16} />
                {item.order_items[0]?.start_time}
              </span>
            </p>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground px-5">
            <div>
              <div className="w-full h-[1px] bg-plasterColor mt-[25px]"></div>
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
                    className="flex justify-between pt-5 border border-plasterColor mt-3 rounded-[30px] p-[30px]"
                  >
                    <div className="flex gap-[30px]">
                      <Image
                        src={product.qr_code_img}
                        width={220}
                        height={180}
                        className="w-[253px] h-[183px] rounded-[20px] object-cover"
                        alt={product.title}
                      />
                      <div>
                        <div className="flex jus">
                          <h3 className="font-medium text-[22px] text-textColor">
                            {product.title}
                          </h3>
                          {
                            product.status === 'pending' && (
                              <span className="bg-accordionText/10 text-accordionText px-[15px] py-[4.5px] rounded-[12px] w-fit">
                                To'lov kutmoqda
                              </span>
                            )
                          }
                          {
                            product.status === 'success' && (
                              <span className="bg-statusBg text-mainColor px-[15px] py-[4.5px] rounded-[12px] w-fit">
                                Olib ketish mumkin
                              </span>
                            )
                          }
                          {
                            product.status === 'expired' && (
                              <span className="bg-statusRed text-red-600 px-[15px] py-[4.5px] rounded-[12px] w-fit">
                                Buyurtma muddati o'tgan
                              </span>
                            )
                          }
                        </div>
                        <h4 className="text-lg text-dolphin mt-[11px]">
                          {product.business_branch}
                        </h4>
                        <h5 className="text-[16px] text-dolphin">
                          Buyurtma miqdori: {product.count} ta
                        </h5>
                        <div className="flex items-center gap-[10px] pt-[20px]">
                          <p className="text-[15px] line-through text-dolphin">
                            {product.original_price?.toLocaleString()} so‘m
                          </p>
                          <h4 className="font-semibold text-[22px] text-mainColor">
                            {product.price?.toLocaleString()} so‘m
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between">
                      {/* <div className="bg-hoverColor rounded-[15px] flex px-5 py-[9px] gap-[10px]">
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
                      </div> */}
                      <Button
                        onClick={() => {
                          setQrCode(product.qr_code_img);
                          setOpen(true);
                        }}
                        className="!bg-plasterColor"
                        variant={"outline"}
                      >
                        <ScanQrCode size={20} />
                        QR kod
                      </Button>
                    </div>
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
