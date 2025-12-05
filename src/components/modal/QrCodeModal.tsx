"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Share } from "lucide-react";
import { Button } from "../ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { isTelegramEnv } from "@/hooks/istelegram";
interface QrCodeModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  qrCode: string;
  order_item_number: string;
  orderId: string;
}

export const QrCodeModal = ({ open, setOpen, qrCode, order_item_number, orderId }: QrCodeModalProps) => {
  const t = useTranslations("my-orders.qr-code-modal");


  const handleDownload = async () => {
    try {
      const res = await fetch(`/api/proxy/order/${orderId}/download-qr/?item_number=${order_item_number}`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Failed to download QR code: ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      
      if (isTelegramEnv()) {
        window.open(url)
      } else {
        const link = document.createElement("a");
        link.href = url;
        link.download = `qr-code-${order_item_number}.png`;
        link.click();

        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error("Download error:", e);
    }
  };




  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-2xl bg-white border-none !pt-[30px] md:!px-[130px] flex flex-col items-center gap-5 [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="font-semibold text-2xl md:text-4xl">{t("title")}</DialogTitle>
        </DialogHeader>
        <Image
          src={qrCode}
          alt="qr-code image"
          width={200}
          height={200}
          className="w-[210px] h-[210px]"
          loading="lazy"
        />
        <p className="text-[20px] text-mainColor py-[8.5px] px-[11px] bg-completedColor rounded-[20px]">
          {order_item_number}
        </p>
        <DialogFooter className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
          <DialogClose asChild>
            <Button
              className="w-full sm:w-[194px] h-12 bg-transparent font-semibold text-[16px]"
              variant={"outline"}
            >
              {t("cancel-button")}
            </Button>
          </DialogClose>
          <Button
            onClick={handleDownload}
            className="w-full sm:w-[194px] h-12 font-semibold text-[16px] flex items-center justify-center gap-2"
          >
            {t("share-button")} <Share size={19} />
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
};

export default QrCodeModal;
