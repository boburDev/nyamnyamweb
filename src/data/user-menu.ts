import {
  ProfileCart,
  ProfileFavourite,
  ProfileHistory,
  ProfileNotification,
  ProfileOrder,
  ProfilePayment,
  ProfileUser,
} from "@/assets/icons";

export type UserMenuItem = {
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  path: string;
};
export const userMenu: UserMenuItem[] = [
  {
    name: "Mening profilim",
    icon: ProfileUser,
    path: "/profile",
  },
  {
    name: "Tolov kartasi",
    icon: ProfilePayment,
    path: "/payment",
  },
  {
    name: "Buyurtmalarim",
    icon: ProfileOrder,
    path: "/order",
  },
  {
    name: "Savat",
    icon: ProfileCart,
    path: "/cart",
  },
  {
    name: "Xaridlar tarixi",
    icon: ProfileHistory,
    path: "/order-history",
  },
  {
    name: "Saqlangan mahsulotlar",
    icon: ProfileFavourite,
    path: "/favourites",
  },
  {
    name: "Bildirishnoma",
    icon: ProfileNotification,
    path: "/notification",
  },
];
