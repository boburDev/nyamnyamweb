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

interface QrCodeModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  qrCode: string;
}

export const QrCodeModal = ({ open, setOpen, qrCode }: QrCodeModalProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-2xl bg-white border-none !pt-[30px] md:!px-[130px] flex flex-col items-center gap-5 [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="font-semibold text-2xl md:text-4xl">QR Kod</DialogTitle>
        </DialogHeader>
        <Image
          src={qrCode}
          alt="qr-code image"
          width={200}
          height={200}
          className="w-[210px] h-[210px]"
        />
        <p className="text-[20px] text-mainColor py-[8.5px] px-[11px] bg-completedColor rounded-[20px]">
          515515
        </p>
        <DialogFooter className="grid grid-cols-1 w-full sm:w-auto">
          <DialogClose asChild>
            <Button
              className="w-full sm:w-[194px] h-12 bg-transparent font-semibold text-[16px]"
              variant={"outline"}
            >
              Yopish
            </Button>
          </DialogClose>
          <Button className="w-full sm:w-[194px] h-12 font-semibold text-[16px]">
            Ulashish <Share size={19} />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QrCodeModal;
