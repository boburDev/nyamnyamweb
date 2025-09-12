import {
  ClickIcon,
  PaymeIcon,
  PaynetIcon,
  UzcardIcon,
  UzumIcon,
} from "@/assets/icons";

export type PaymeIcons = {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}
export const paymentIcons: PaymeIcons[] = [
  {
    icon: ClickIcon,
  },
  {
    icon: PaymeIcon,
  },
  {
    icon: UzumIcon,
  },
  {
    icon: PaynetIcon,
  },
  {
    icon: UzcardIcon,
  },
];
