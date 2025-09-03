export const phoneRegex = /^\+998\d{9}$/;
export const phoneLocalRegex = /^\d{9}$/;
export const normalizePhone = (raw: string) => {
  if (phoneRegex.test(raw)) return raw;
  if (phoneLocalRegex.test(raw)) return `+998${raw}`;
  return raw;
};

export function formatDate(date: Date | undefined) {
  if (!date) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export function parseDate(value: string): Date | undefined {
  const regex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
  const match = value.match(regex);
  if (!match) return undefined;

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1;
  const year = parseInt(match[3], 10);

  const date = new Date(year, month, day);
  return isNaN(date.getTime()) ? undefined : date;
}
