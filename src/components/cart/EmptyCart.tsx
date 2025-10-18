import { Link } from "@/i18n/navigation";
import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";

export const EmptyCart = () => {
  return (
    <div className=" bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center pt-[127px]">
          <ShoppingCart size={113} className="text-[#BCBEC3]" />
          <h2 className="text-[30px] font-semibold text-textColor mt-5">
            Savatda hozircha hech narsa yo‘q
          </h2>
          <p className="text-dolphin mt-[15px]">
            Surprise baglarni tanlab, savatingizni to‘ldiring.
          </p>
          <Link href="/">
            <Button className="font-semibold text-xl px-[25px] !h-12 mt-5">
              Surprise baglarni ko’rish
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;
