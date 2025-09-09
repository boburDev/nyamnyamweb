import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ScanQrCode } from 'lucide-react';
import { Button } from '../ui/button';
import { productData } from '@/data/product-data';
import { QrCodeModal } from '../modal';

interface Props {
    open:boolean,
    setOpen: (open:boolean) => void
}

export const OrderAccordion = ({open , setOpen}:Props) => {
    return (
        <Accordion type='single' collapsible className='w-full space-y-2 mt-4' defaultValue='item-1'>
            {productData.map((item, index) => (
                <AccordionItem key={index} value={`item-${index + 1}`} className='w-full rounded-[30px] border-b-0 bg-white'>
                    <AccordionTrigger className='px-[25px] !py-[25px] text-lg hover:no-underline [&>svg]:size-6 xl:[&>svg]:size-8'>2024-07-26 14:30 • Buyurtma soni: 6</AccordionTrigger>
                    <AccordionContent className='text-muted-foreground px-5'>
                        <div>
                            <div className="w-full h-[1px] bg-plasterColor mt-[25px]"></div>
                            {item.products.map((product, id) => (
                                  <div key={id} className="flex justify-between pt-5 border border-plasterColor mt-3 rounded-[30px] p-[30px]">
                                  <div className="flex gap-[30px]">
                                      <img src={product.image} className="w-[253px] h-[183px] rounded-[20px]" alt={product.name} />
                                      <div>
                                          <h3 className="font-medium text-[22px] text-textColor">{product.name}</h3>
                                          <h4 className="text-lg text-dolphin">{product.restaurant}</h4>
                                          <h5 className="text-[16px] text-dolphin">Buyurtma miqdori: {product.stock} ta</h5>
                                          <div className="flex items-center gap-[10px] pt-[52px]">
                                              <p className="text-[15px] line-through text-dolphin">{product.originalPrice}</p>
                                              <h4 className="font-semibold text-[22px] text-mainColor">{product.currentPrice} UZS</h4>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="flex flex-col justify-between">
                                      <h4 className="text-lg text-dolphin">17:00 - 18:00</h4>
                                      <Button onClick={() => setOpen(true)} className="!bg-plasterColor" variant={"outline"}><ScanQrCode size={20} />QR kod</Button>
                                  </div>
                              </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
            <QrCodeModal open={open} setOpen={setOpen}  /> 
        </Accordion>
    )
}

export default OrderAccordion
