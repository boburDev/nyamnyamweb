"use client"

import { qrCode } from "@/assets/images"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Share } from "lucide-react"
import { Button } from "../ui/button"
import { DialogClose } from "@radix-ui/react-dialog"
import Image from "next/image"

interface QrCodeModalProps {
    open: boolean
    setOpen: (open: boolean) => void
  }

export const QrCodeModal = ({open, setOpen}:QrCodeModalProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="rounded-2xl bg-white border-none !pt-[30px] !px-[130px] flex flex-col items-center gap-5 [&>button]:hidden">
      <DialogHeader>
        <DialogTitle className="font-semibold text-4xl">QR Kod</DialogTitle>
      </DialogHeader>
      <Image src={qrCode.src} alt="" />
      <p className="text-[20px] text-mainColor py-[8.5px] px-[11px] bg-completedColor rounded-[20px]">515515</p>
    <DialogFooter>
       <DialogClose asChild>
       <Button className="w-[194px] h-12 bg-transparent font-semibold text-[16px]" variant={'outline'}>Yopish</Button>
       </DialogClose>
        <Button className="w-[194px] h-12 font-semibold text-[16px]">Ulashish <Share size={19} /></Button>
    </DialogFooter>
    </DialogContent>
  </Dialog>
  )
}

export default QrCodeModal