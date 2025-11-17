"use client"

import { InstagramIcon, TelegrammIcon, User, YouTubeIcon } from "@/assets/icons";
import { ShoppingCart, House, Heart } from "lucide-react";
import { useTranslations } from "next-intl";

export const useFooterLinks = () => {
  const t = useTranslations("Footer");

  return [
    {
      title: t("usefulLinks.title"),
      link: [
        { title: t("usefulLinks.link-1"), path: "/" },
        { title: t("usefulLinks.link-2"), path: "/public-offer" },
        { title: t("usefulLinks.link-3"), path: "/" },
      ],
    },
    {
      title: t("companyLinks.title"),
      link: [
        { title: t("companyLinks.link-1"), path: "/" },
        // { title: t("companyLinks.link-2") },
        { title: t("companyLinks.link-3"), path: "/" },
        // { title: t("companyLinks.link-4") },
      ],
    },
    {
      title: t("social.title"),
      socials: [
        { id: 1, icon: TelegrammIcon, path: "/" },
        { id: 2, icon: YouTubeIcon, path: "/" },
        { id: 3, icon: InstagramIcon, path: "/" },
      ],
    },
  ];
};

export const useFooterData = () => {
  const t = useTranslations("Footer");

  return [
    {
      name: t("mobile.btn-1"),
      path: "/",
      icon: House,
    },
    {
      name: t("mobile.btn-2"),
      path: "/cart",
      icon: ShoppingCart,
    },
    {
      name: t("mobile.btn-3"),
      path: "/favourites",
      icon: Heart,
    },
    {
      name: t("mobile.btn-4"),
      path: "/profile",
      icon: User,
    },
  ];
};
