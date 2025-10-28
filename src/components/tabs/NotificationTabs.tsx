import { useState } from "react";

interface NotificationTabsProps {
  onTabChange: (tab: "all" | "unread" | "read") => void;
}

const NotificationTabs = ({ onTabChange }: NotificationTabsProps) => {
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");
  return (
    <div className="flex items-center gap-3 mt-[27px] mb-5 sm:hidden">
      <button
        onClick={() => {
          setActiveTab("all");
          onTabChange("all");
        }}
        className={`px-4 py-1.5 rounded-[10px] text-sm leading-6 border transition-all
            ${activeTab === "all" ? "bg-mainColor text-white border-mainColor" : "border-gray-300 text-tabsTextColor"}`}
      >
        Hammasi
      </button>

      <button
        onClick={() => {
          setActiveTab("unread");
          onTabChange("unread");
        }}
        className={`px-4 py-1.5 rounded-[10px] text-sm leading-6 border transition-all
            ${activeTab === "unread" ? "bg-mainColor text-white border-mainColor" : "border-gray-300 text-tabsTextColor"}`}
      >
        O‘qilmagan
      </button>

      <button
        onClick={() => {
          setActiveTab("read");
          onTabChange("read");
        }}
        className={`px-4 py-1.5 rounded-[10px] text-sm leading-6 border transition-all
            ${activeTab === "read" ? "bg-mainColor text-white border-mainColor" : "border-gray-300 text-tabsTextColor"}`}
      >
        O‘qilgan
      </button>
    </div>
  )
}

export default NotificationTabs