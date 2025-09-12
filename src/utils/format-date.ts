import { addMinutes } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

export function formatTimeRange(dateString: string) {
  const timeZone = "Asia/Tashkent";
  const date = new Date(dateString);

  const startTime = formatInTimeZone(date, timeZone, "HH:mm");

  const endTime = formatInTimeZone(addMinutes(date, 90), timeZone, "HH:mm");

  return `${startTime} - ${endTime}`;
}
