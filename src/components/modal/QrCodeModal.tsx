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
      <img src={qrCode.src} alt="" />
      <p className="font-medium text-[31px] text-mainColor pt-[10px]">515-515</p>
    <DialogFooter>
        <Button className="w-[194px] h-12 bg-transparent font-semibold text-[16px]" variant={'outline'}>Yopish</Button>
        <Button className="w-[194px] h-12 font-semibold text-[16px]">Share <Share size={19} /></Button>
    </DialogFooter>
    </DialogContent>
  </Dialog>
  )
}

export default QrCodeModal