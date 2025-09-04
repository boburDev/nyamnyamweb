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
import { notificationData } from "@/data";
import { format, isValid } from "date-fns";
import { uz } from "date-fns/locale";

export const NotificationMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"outline"}
          className="w-12 h-12 font-medium text-sm focus-visible:ring-0"
        >
          <div className="relative">
            <NotificationIcon className="size-6"/>
            {notificationData.length > 0 && (
              <span className="absolute top-[2px] right-[2px] w-[5px] h-[5px] bg-dangerColor rounded-full"></span>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-[514px] px-4 py-[11px] border-borderColor custom-scrollbar">
        <DropdownMenuLabel className="px-0 py-[9.5px] mb-[15px] font-medium text-textColor text-[30px]">
          Bildirishnomalar
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex flex-col gap-[15px]">
          {notificationData.map((item, index) => {
            const date = new Date(item.createdAt);
            if (!isValid(date)) {
              console.error(
                `Invalid date for item at index ${index}:`,
                item.createdAt
              );
              return null; 
            }

            const sana = format(date, "d MMMM yyyy", { locale: uz });
            const vaqt = format(date, "HH:mm");

            return (
              <DropdownMenuItem
                key={index}
                className="bg-borderColor focus:bg-borderColor"
              >
                <div className="flex flex-col gap-[10px]">
                  <h4>{item.name}</h4>
                  <p>{item.desc}</p>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>{sana}</span>
                    <span>{vaqt}</span>
                  </div>
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationMenu;
