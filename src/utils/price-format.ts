export const formatPrice = (amount?: number): string => {
  if (amount == null || amount <= 0) return "";

  const floored = Math.floor(amount);
  return (
    floored
      .toLocaleString("ru-RU", { useGrouping: true })
      .replace(/\u00A0/g, ".") + " so'm"
  );
};
