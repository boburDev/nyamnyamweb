import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { CalendarDays, Clock, ScanQrCode } from 'lucide-react';
import { Button } from '../ui/button';
import { QrCodeModal } from '../modal';
import { format } from 'date-fns';

interface Props {
    open:boolean,
    setOpen: (open:boolean) => void
    orders: any[]
}

export const OrderAccordion = ({open , setOpen, orders}:Props) => {
    return (
        <Accordion type="single" collapsible className="w-full space-y-2 mt-4" defaultValue="item-1">
        {orders.map((item, index) => (
          <AccordionItem
            key={item.ordersId}
            value={`item-${index + 1}`}
            className="w-full rounded-[30px] border-b-0 bg-white"
          >
            <AccordionTrigger className="px-[30px] !py-[24px] flex items-center hover:no-underline [&>svg]:size-6 xl:[&>svg]:size-8">
            <p className='flex flex-col font-semibold text-lg'> Surprise bag ({item.products.length}x)
                 <span className='!font-normal text-[16px] text-dolphin flex items-center gap-[6px]'><CalendarDays size={16} />2024.07.26<Clock size={16} />14:30 Buyurtma soni: {item.products.length} ta</span>
            </p>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground px-5">
              <div>
                <div className="w-full h-[1px] bg-plasterColor mt-[25px]"></div>
                {item.products.map((product: any, id: number) => (
                  <div
                    key={id}
                    className="flex justify-between pt-5 border border-plasterColor mt-3 rounded-[30px] p-[30px]"
                  >
                    <div className="flex gap-[30px]">
                      <img
                        src={product.image}
                        className="w-[253px] h-[183px] rounded-[20px]"
                        alt={product.name}
                      />
                      <div>
                        <h3 className="font-medium text-[22px] text-textColor">{product.name}</h3>
                        <h4 className="text-lg text-dolphin">{product.restaurant}</h4>
                        <h5 className="text-[16px] text-dolphin">
                          Buyurtma miqdori: {product.stock} ta
                        </h5>
                        <div className="flex items-center gap-[10px] pt-[52px]">
                          <p className="text-[15px] line-through text-dolphin">{product.originalPrice}</p>
                          <h4 className="font-semibold text-[22px] text-mainColor">
                            {product.currentPrice}
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between">
                       <div className='flex flex-col'>
                       {product.status === "In Progress" && (
                          <p className='px-3 py-[4.5px] text-[16px] rounded-[15px] flex items-center justify-center text-accordionText bg-inProgressColor'>{product.status}</p>
                       )}
                       {product.status === "Pending" && (
                          <p className='px-3 py-[4.5px] text-[16px] rounded-[15px] flex items-center justify-center text-blue-500 bg-blue-100'>{product.status}</p>
                       )}
                       {product.status === "Completed" && (
                          <p className='px-3 py-[4.5px] text-[16px] rounded-[15px] flex items-center justify-center text-mainColor bg-completedColor'>{product.status}</p>
                       )}
                      <h4 className="text-lg text-dolphin pt-[25px]">
                        {format(new Date(product.start), "HH:mm")} -{" "}
                        {format(new Date(product.end), "HH:mm")}
                      </h4>
                       </div>
                      <Button
                        onClick={() => setOpen(true)}
                        className="!bg-plasterColor"
                        variant={"outline"}
                      >
                        <ScanQrCode size={20} />
                        QR kod
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
        <QrCodeModal open={open} setOpen={setOpen} />
      </Accordion>
      
    )
}

export default OrderAccordion
