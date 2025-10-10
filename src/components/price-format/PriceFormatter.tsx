import { cn } from "@/lib/utils";

interface Props {
  amount?: number;
  className?: string;
}

export const PriceFormatter = ({ amount, className }: Props) => {
  if (amount === undefined || amount === null) {
    return null;
  }

  const currency = "so'm";
  const formatted = amount
    .toLocaleString("ru-RU", {
      useGrouping: true,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .replace(/\u00A0/g, " ");
  const formattedWithoutCurrency = formatted.replace(currency, "");
  const [integerPart, fractionPart] = formattedWithoutCurrency.split(",");

  return (
    <span className={cn("font-semibold text-mainColor text-lg", className)}>
      {integerPart}
      {fractionPart && fractionPart !== "00" && (
        <span className="text-xs ">,{fractionPart}</span>
      )}{" "}
      {currency}
    </span>
  );
};

export default PriceFormatter;
