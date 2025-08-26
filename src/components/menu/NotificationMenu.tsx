import { NotificationIcon } from "@/assets/icons";
import { Button } from "../ui/button";

export const NotificationMenu = () => {
  return (
    <Button variant={"outline"} className="h-12 rounded-full w-12">
      <NotificationIcon />
    </Button>
  );
};

export default NotificationMenu;
