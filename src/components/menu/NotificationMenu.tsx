"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationIcon } from "@/assets/icons";
import { Button } from "../ui/button";
import { format, isValid } from "date-fns";
import { uz } from "date-fns/locale";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/api";
import { useNotificationWebSocket, useNotifications } from "@/hooks";
import { useLocale } from "next-intl";

export const NotificationMenu = () => {
  const locale = useLocale();

  // Get user data to extract user ID
  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: getUsers,
    retry: false,
  });

  // Use React Query for notifications with locale
  const {
    data: notifications = [],
    isLoading: loading,
    error,
  } = useNotifications(locale);

  // Initialize WebSocket connection for real-time notifications
  useNotificationWebSocket({
    userId: userData?.id || null,
    enabled: !!userData?.id,
  });

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"outline"}
          className="w-12 h-12 font-medium text-sm focus-visible:ring-0 rounded-full lg:rounded-[15px]"
        >
          <div className="relative">
            <NotificationIcon className="size-6" />
            {unreadCount > 0 && (
              <span className="absolute top-[2px] right-[2px] w-[5px] h-[5px] bg-dangerColor rounded-full"></span>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-[79vh] md:max-h-110 xl:max-h-200 max-w-[92vw] min-w-[92vw] sm:max-w-[400px] sm:min-w-[400px] xl:max-w-[514px] xl:min-w-[514px] px-4 py-[11px] border-borderColor custom-scrollbar rounded-[12px]">
        <DropdownMenuLabel className="px-0 xl:py-[9.5px] sm:mb-[15px] font-medium text-textColor text-xl sm:text-2xl lg:text-[30px]">
          Bildirishnomalar
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex flex-col gap-[15px]">
          {loading ? (
            <div className="text-center py-4 text-gray-500">
              Yuklanmoqda...
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">
              Bildirishnomalar yuklanmadi
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              Bildirishnomalar yo'q
            </div>
          ) : (
            notifications.slice(0, 5).map((item) => {
              const date = new Date(item.created_at);
              if (!isValid(date)) {
                console.error(
                  `Invalid date for notification ${item.id}:`,
                  item.created_at
                );
                return null;
              }

              const sana = format(date, "d MMMM yyyy", { locale: uz });
              const vaqt = format(date, "HH:mm");

              return (
                <DropdownMenuItem
                  key={item.id}
                  className="bg-borderColor focus:bg-borderColor"
                  asChild
                >
                  <Link href={`/notification/${item.id}`}>
                    <div className="flex flex-col gap-[10px] w-full">
                      <h4 className={`font-medium text-base xl:text-[20px] ${!item.is_read ? 'text-textColor' : 'text-gray-600'}`}>
                        {item.title}
                      </h4>
                      <div className="flex flex-col gap-1 lg:gap-[15px] w-full">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex justify-between items-center text-sm text-gray-600">
                          <span>{sana}</span>
                          <span>{vaqt}</span>
                        </div>
                      </div>
                      {!item.is_read && (
                        <div className="w-2 h-2 bg-mainColor rounded-full self-end"></div>
                      )}
                    </div>
                  </Link>
                </DropdownMenuItem>
              );
            })
          )}
        </div>
        {notifications.length > 5 && (
          <>
            <DropdownMenuSeparator />
            <div className="text-center py-2">
              <Link
                href="/notification"
                className="text-mainColor text-sm hover:underline"
              >
                Barcha bildirishnomalarni ko'rish
              </Link>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationMenu;
