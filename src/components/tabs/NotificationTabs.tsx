import { useTranslations } from "next-intl";
import { useState } from "react";

interface NotificationTabsProps {
  onTabChange: (tab: "all" | "unread" | "read") => void;
}

const NotificationTabs = ({ onTabChange }: NotificationTabsProps) => {
  const t = useTranslations("notification.tabs")
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");

  const handleTabChange = (tab: "all" | "unread" | "read") => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="flex items-center gap-3 md:hidden">
      <button
        onClick={() => handleTabChange("all")}
        className={`px-4 py-1.5 rounded-[10px] text-sm leading-6 border transition-all
            ${activeTab === "all" ? "bg-mainColor text-white border-mainColor" : "border-gray-300 text-tabsTextColor"}`}
      >
        {t("tab-1")}
      </button>

      <button
        onClick={() => handleTabChange("unread")}
        className={`px-4 py-1.5 rounded-[10px] text-sm leading-6 border transition-all
            ${activeTab === "unread" ? "bg-mainColor text-white border-mainColor" : "border-gray-300 text-tabsTextColor"}`}
      >
        {t("tab-2")}
      </button>

      <button
        onClick={() => handleTabChange("read")}
        className={`px-4 py-1.5 rounded-[10px] text-sm leading-6 border transition-all
            ${activeTab === "read" ? "bg-mainColor text-white border-mainColor" : "border-gray-300 text-tabsTextColor"}`}
      >
        {t("tab-3")}
      </button>
    </div>
  )
}

export default NotificationTabs