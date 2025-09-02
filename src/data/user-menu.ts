import {
  ProfileCart,
  ProfileFavourite,
  ProfileHistory,
  ProfileNotification,
  ProfileOrder,
  ProfilePayment,
  ProfileUser,
} from "@/assets/icons";
import { useTranslations } from "next-intl";

export type UserMenuItem = {
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  path: string;
};
export const useUserMenu = (): UserMenuItem[] => {
const t = useTranslations("UserMenu");

return [
  {
    name: t("profile"),
    icon: ProfileUser,
    path: "/profile",
  },
  {
    name: t("payment"),
    icon: ProfilePayment,
    path: "/payment",
  },
  {
    name: t("order"),
    icon: ProfileOrder,
    path: "/order",
  },
  {
    name: t("cart"),
    icon: ProfileCart,
    path: "/cart",
  },
  {
    name: t("order-history"),
    icon: ProfileHistory,
    path: "/order-history",
  },
  {
    name: t("favourites"),
    icon: ProfileFavourite,
    path: "/favourites",
  },
  {
    name: t("notification"),
    icon: ProfileNotification,
    path: "/notification",
  },
]}
