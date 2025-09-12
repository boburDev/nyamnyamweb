/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container } from "@/components/container";
import PriceFormatter from "@/components/price-format/PriceFormatter";
import { formatTimeRange } from "@/utils";
import { formatPrice } from "@/utils/price-format";
import Image from "next/image";

export default async function CheckoutPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/checkout`);

  if (!res.ok) {
    throw new Error("Checkoutlarni olishda xatolik");
  }

  const data = await res.json();

  if (!data || !data.id) {
    return <div>Checkout topilmadi</div>;
  }
  console.log("data", data);

  return (
    <div className="pt-20 pb-[150px]">
      <Container>
        <h2 className="page-title mb-10">To‘lov tafsilotlari</h2>

        <div className="grid grid-cols-12 gap-[30px]">
          <div className="col-span-7">
            <div className="bg-white shadow-md pb-5 pl-[30px] pr-5 rounded-[30px] border border-nitrogenColor">
              {data.items?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex justify-between py-5 border-b last:border-b-0 border-plasterColor"
                >
                  <div className="flex gap-[17px]">
                    <div className="rounded-[20px] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={170}
                        height={130}
                        className="w-[179px] h-[139px] "
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="font-medium text-lg text-textColor mb-[14px]">
                        {item.name}
                      </p>
                      <span className="text-dolphin font-normal text-sm mb-[14px]">
                        Hozircha yo'q
                      </span>
                      <span className="text-dolphin font-normal text-sm mb-4">
                        {item.restaurant}
                      </span>
                      <div className="flex gap-3 items-center">
                        <span className="text-dolphin font-normal text-base">
                          {formatPrice(item.originalPrice)}
                        </span>
                        <PriceFormatter
                          amount={item.currentPrice}
                          className="text-[22px]"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="font-normal text-dolphin">
                      {formatTimeRange(data.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-5">
            <div className="bg-white rounded-[30px] shadow-md px-5 pt-5 pb-[30px] border border-nitrogenColor">
              <h3 className="font-medium text-2xl mb-[30px] text-textColor">
                To’lov turi
              </h3>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
