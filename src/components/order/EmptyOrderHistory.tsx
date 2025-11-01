import { Link } from "@/i18n/navigation"
import { Button } from "../ui/button"
import { Clock } from "lucide-react"

const EmptyOrderHistory = () => {
    return (
        <div className="bg-gray-50 py-2 absolute top-1/2 left-1/2 -translate-1/2 md:-translate-0 md:top-0 md:left-0 w-full md:relative">
            <div>
                <div className="flex flex-col items-center justify-center">
                    <Clock className="size-[60px] sm:size-20 lg:size-[113px] text-dolphin/50" />
                    <h2 className="text-[17px] text-center sm:text-2xl lg:text-[30px] font-semibold text-textColor mt-3 lg:mt-5">
                        Buyurtmalarimda hozircha hech narsa yo‘q
                    </h2>
                    <p className="text-dolphin text-center mt-2 lg:mt-[15px] text-sm sm:text-base">
                        Buyurtmalarimni tanlab, buyurtmalarimni to‘ldiring.
                    </p>
                    <Link href="/">
                        <Button className="font-semibold lg:text-xl lg:px-[25px] lg:!h-12 mt-3 lg:mt-5 rounded-[12px] lg:rounded-[15px]">
                            Buyurtmalarimni ko’rish
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default EmptyOrderHistory