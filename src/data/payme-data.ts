import {
  ClickIcon,
  PaymeIcon,
  // PaynetIcon,
  // UzcardIcon,
  UzumIcon,
} from "@/assets/icons";

export type PaymeIcons = {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  name: string;
}
export const paymentIcons: PaymeIcons[] = [
  {
    icon: ClickIcon,
    name: "click",
  },
  {
    icon: PaymeIcon,
    name: "payme",
  },
  {
    icon: UzumIcon,
    name: "uzum",
  },
  // {
  //   icon: UzcardIcon,
  //   name: "uzcard",
  // },
  // {
  //   icon: PaynetIcon,
  //   name: "paynet",
  // },
];
