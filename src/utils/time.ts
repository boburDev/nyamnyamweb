import {
  toZonedTime,
  format as formatTz,
  toDate,
} from "date-fns-tz";
import { isValid } from "date-fns";

const DEFAULT_TZ = "Asia/Tashkent";


function normalizeTimeString(time?: string | null) {
  if (!time) return null;
  const t = time.trim();
  // allow "HH:mm" or "HH:mm:ss"
  const mmss = /^([01]?\d|2[0-3]):([0-5]\d)(:?([0-5]\d))?$/;
  const m = t.match(mmss);
  if (!m) return null;
  const hh = m[1].padStart(2, "0");
  const min = m[2].padStart(2, "0");
  const sec = m[4] ? m[4].padStart(2, "0") : "00";
  return `${hh}:${min}:${sec}`;
}

function buildDateForTimeInZone(
  timeStr: string,
  timeZone = DEFAULT_TZ
): Date | null {
  const normalized = normalizeTimeString(timeStr);
  if (!normalized) return null;

  const now = new Date();
  const zonedNow = toZonedTime(now, timeZone);
  const yyyy = zonedNow.getFullYear();
  const mm = String(zonedNow.getMonth() + 1).padStart(2, "0");
  const dd = String(zonedNow.getDate()).padStart(2, "0");

  const localDateTime = `${yyyy}-${mm}-${dd} ${normalized}`;

  const utcDate = toDate(localDateTime, { timeZone });

  if (!isValid(utcDate)) return null;
  return utcDate;
}

export function formatTimeInTz(
  time?: string | null,
  options?: { timeZone?: string; outputFormat?: string }
) {
  const { timeZone = DEFAULT_TZ, outputFormat = "HH:mm" } = options ?? {};
  const d = buildDateForTimeInZone(time ?? "", timeZone);
  if (!d) return "-";
  return formatTz(d, outputFormat, { timeZone });
}

export function formatTimeRangeInTz(
  start?: string | null,
  end?: string | null,
  options?: { timeZone?: string; outputFormat?: string; separator?: string }
) {
  const {
    timeZone = DEFAULT_TZ,
    outputFormat = "HH:mm",
    separator = " — ",
  } = options ?? {};
  const s = formatTimeInTz(start, { timeZone, outputFormat });
  const e = formatTimeInTz(end, { timeZone, outputFormat });

  if (s === "-" && e === "-") return "-";
  if (s === "-") return e;
  if (e === "-") return s;
  return `${s}${separator}${e}`;
}
