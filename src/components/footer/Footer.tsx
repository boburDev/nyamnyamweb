import { links } from "@/data/footer-data"
import { Container } from "../container"
import Link from "next/link"
import { Button } from "../ui/button"


export const Footer = () => {
    return (
        <div className="w-full pt-[39px] pb-[29px] bg-mainColor rounded-t-[45px]">
            <Container>
                <div className="flex items-center gap-[63px]">
                    <div className="w-[433px] gap-[21px] flex flex-col">
                        <h2 className="font-medium text-[38px] text-white">Logo</h2>
                        <p className="text-sm leading-[25px] text-white">SaveMeal – bu oziq-ovqat isrofiga qarshi kurashuvchi platforma.
                            Yaroqlilik muddati yaqin mahsulotlarni arzon narxda toping.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-[155px] pt-[59px]">
                        {links.map((item, index) => (
                            <div className=" text-white">
                                <h3 className="pb-[23px]">{item.title}</h3>
                                <div className="flex flex-col gap-[10px] text-white w-[167px]">
                                    {item.link?.map(item => (
                                        <Link href='/' className="text-[14px] leading-[25px]">{item.title}</Link>
                                    ))}
                                </div>
                                <div className="flex items-center gap-[20px]">
                                    {item.socials?.map((social, index) => (
                                        <Link key={social.id ?? index} href={social.path}>
                                            {typeof social.icon === "function" ? social.icon() : social.icon || ''}
                                        </Link>

                                    ))}
                                </div>
                                {index === 2 && (
                                    <Button variant='secondary' className="mt-[26px] font-medium text-[12px] w-[140px]">Biznes uchun kirish</Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col items-center pt-[18px]">
                    <div className="w-full h-[1px] bg-white"></div>
                    <p className="text-[16px] text-white pt-[31px]"> 2025 SaveMeal. Barcha huquqlar himoyalangan</p>
                </div>
            </Container>
        </div>
    )
}

export default Footer