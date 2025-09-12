'use client'
import { Container } from "@/components/container"
import { Switch } from "@/components/ui/switch"
import { useTranslations } from "next-intl"
import { useState } from "react"

const Notification = () => {
    const [activeDay, setActiveDay] = useState<string[]>([]);
    const t = useTranslations('notification')

    const weekDaysKeys = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];

    const toggleDay = (day: string) => {
        setActiveDay((prev) =>
            prev.includes(day)
                ? prev.filter((d) => d !== day)
                : [...prev, day]
        );
    };
    return (
        <Container>
            <div className="mt-[76px] pb-[150px]">
                <h2 className="font-medium text-4xl text-textColor">{t("title")}</h2>
                <div className="bg-white border border-plasterColor rounded-[20px] mt-10">
                    <h4 className="text-[16px] text-textColor pl-[30px] pt-6">
                        {t("desc")}
                    </h4>
                    <div className="flex items-center justify-between px-[30px] bg-notificationColor py-[13.5px] mt-[22px]">
                        <div>
                            <h4 className="font-medium text-[16px] text-textColor">{t("section-1-title")}</h4>
                            <p className="text-sm text-dolphin">{t("section-1-desc")}</p>
                        </div>
                        <Switch
                            className='w-13 h-7.5 pl-[2px] data-[state=checked]:!bg-mainColor data-[state=unchecked]:!bg-switchBgColor shadow-none border-0 focus-visible:ring-gColor/20 focus-visible:ring-[2px] [&_span]:!bg-white [&_span]:w-6.5 [&_span]:h-6.5 [&_span]:data-[state=checked]:!translate-x-[calc(100%-4px)] [&_span]:data-[state=unchecked]:!translate-x-3px [&_span]:shadow-[0px_3px_8px_0px_#00000026]'
                            aria-label='Success Switch'
                        />
                    </div>
                    <div className="flex items-center justify-between px-[30px] bg-notificationColor py-[13.5px] mt-[10px]">
                        <div>
                            <h4 className="font-medium text-[16px] text-textColor">{t("section-2-title")}</h4>
                            <p className="text-sm text-dolphin">{t("section-2-desc")}</p>
                        </div>
                        <Switch
                            className='w-13 h-7.5 pl-[2px] data-[state=checked]:!bg-mainColor data-[state=unchecked]:!bg-switchBgColor shadow-none border-0 focus-visible:ring-gColor/20 focus-visible:ring-[2px] [&_span]:!bg-white [&_span]:w-6.5 [&_span]:h-6.5 [&_span]:data-[state=checked]:!translate-x-[calc(100%-4px)] [&_span]:data-[state=unchecked]:!translate-x-3px [&_span]:shadow-[0px_3px_8px_0px_#00000026]'
                            aria-label='Success Switch'
                        />
                    </div>
                    <div className="flex flex-col w-[290px] gap-[22px] pt-[22px] pl-[30px]">
                        <div className="checkbox">
                            <input type="checkbox" id="checkbox1" />
                            <label htmlFor="checkbox1">
                                <span className="text-[16px] leading-6 text-dolphin">{t("section-3")}</span>
                            </label>
                        </div>
                        <div className="checkbox">
                            <input type="checkbox" id="checkbox2" />
                            <label htmlFor="checkbox2">
                                <span className="text-[16px] leading-6 text-dolphin">{t("section-4")}</span>
                            </label>
                        </div>
                        <div className="checkbox">
                            <input type="checkbox" id="checkbox3" />
                            <label htmlFor="checkbox3">
                                <span className="text-[16px] leading-6 text-dolphin">{t("section-5")}</span>
                            </label>
                        </div>
                    </div>
                    <div className="pl-[30px] pt-[32px]">
                        <h2 className="font-semibold text-[22px] leading-7">{t("section-6-title")}</h2>
                        <p className="text-[16px] leading-6 text-dolphin pt-[26px]">{t("section-6-desc")}</p>
                        <div className="flex items-center gap-[15px] pt-[34px] pb-[30px]">
                            {weekDaysKeys.map((key) => (
                                <button key={key} onClick={() => toggleDay(key)}
                                    className={`px-[10px] py-[5.5px] rounded-[16px] border transition text-sm font-medium 
                                  ${activeDay.includes(key)
                                            ? "bg-mainColor text-white border-mainColor"
                                            : "bg-white text-black border-gray-300"
                                        }`}
                                >{t(`week-days.${key}`)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default Notification