import { cn } from "@/lib/utils";

interface Props {
  amount?: number | null;
  className?: string;
  summ?: boolean; 
}

export const PriceFormatter = ({ amount, className, summ = true }: Props) => {
  if (amount === undefined || amount === null || Number.isNaN(Number(amount))) {
    return null;
  }

  const currency = "so'm";

  const formatted = new Intl.NumberFormat("ru-RU", {
    useGrouping: true,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(Number(amount))
    .replace(/\u00A0/g, " "); 

  const [integerPart, fractionPart] = formatted.split(",");

  return (
    <span className={cn("font-semibold text-mainColor text-lg", className)}>
      {integerPart}
      {fractionPart && fractionPart !== "00" && (
        <span className="text-xs">,{fractionPart}</span>
      )}{" "}
      {summ ? currency : null}
    </span>
  );
};

export default PriceFormatter;
