import {
  ProfileCart,
  ProfileFavourite,
  ProfileHistory,
  ProfileNotification,
  ProfileOrder,
  ProfileUser,
} from "@/assets/icons";

export type UserMenuItem = {
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  path: string;
};
export const userMenu = [
  {
    name: "profile",
    icon: ProfileUser,
    path: "/profile",
  },
  // {
  //   name: "payment",
  //   icon: ProfilePayment,
  //   path: "/payment",
  // },
  {
    name: "order",
    icon: ProfileOrder,
    path: "/order",
  },
  {
    name: "cart",
    icon: ProfileCart,
    path: "/cart",
  },
  {
    name: "order-history",
    icon: ProfileHistory,
    path: "/order-history",
  },
  {
    name: "favourites",
    icon: ProfileFavourite,
    path: "/favourites",
  },
  {
    name: "notification",
    icon: ProfileNotification,
    path: "/notification",
  },
];
