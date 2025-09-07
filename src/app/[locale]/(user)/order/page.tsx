'use client'
import { OrderAccordion } from "@/components/accordion";
import { Container } from "@/components/container";
import { QrCodeModal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { ScanQrCode } from "lucide-react";
import { useState } from "react";


export default function OrderPage() {
    const [open, setOpen] = useState(false)
    return (
        <Container>
            <div className="pt-[150px]">
                <h1 className=" font-medium text-4xl mb-4">Buyurtmalarim</h1>

                <div className="w-full bg-white rounded-[30px] px-[30px] pb-[30px] pt-[25px]">
                    <div className="flex items-center justify-between">
                        <h4 className="text-lg text-textColor">2024-07-26 14:30</h4>
                        <p className="text-[16px] text-accordionText">In progress</p>

                    </div>
                    <div className="w-full h-[1px] bg-plasterColor mt-[25px]"></div>
                    <div className="flex justify-between pt-5">
                        <div className="flex gap-[30px]">
                            <img src="/nonkabob.jpg" className="w-[253px] h-[183px] rounded-[20px]" alt="" />
                            <div>
                                <h3 className="font-medium text-[22px] text-textColor">Suprise bag</h3>
                                <h4 className="text-lg text-dolphin">Yunusobod filiali</h4>
                                <h5 className="text-[16px] text-dolphin">Buyurtma miqdori:  2 ta</h5>
                                <div className="flex items-center gap-[10px] pt-[52px]">
                                    <p className="text-[15px] line-through text-dolphin">18.000</p>
                                    <h4 className="font-semibold text-[22px] text-mainColor">12 000 UZS</h4>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between">
                            <h4 className="text-lg text-dolphin">17:00 - 18:00</h4>
                            <Button onClick={() => setOpen(true)} className="!bg-plasterColor" variant={"outline"}><ScanQrCode size={20} />QR kod</Button>
                        </div>
                    </div>
                </div>
                <OrderAccordion open={open} setOpen={setOpen} />
            </div>
            <QrCodeModal open={open} setOpen={setOpen} />

        </Container>
    )
}