/**
 * Date utilities theo múi giờ LOCAL (tránh lệch ngày khi cross timezone).
 *
 * ⚠️ Tại sao không dùng `new Date(iso).toLocaleDateString(...)`?
 * Vì `new Date("2026-07-24")` (ISO date-only) bị parse thành UTC midnight,
 * nên ở timezone UTC+7 sẽ thành 2026-07-24 07:00 local → ổn,
 * nhưng ở timezone UTC-7 sẽ thành 2026-07-23 17:00 local → lệch 1 ngày.
 * Cách an toàn nhất là TỰ parse YYYY-MM-DD.
 */

const WEEKDAYS_FULL = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
const WEEKDAYS_SHORT = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

const pad = (n: number): string => String(n).padStart(2, "0");

/**
 * Trả về "YYYY-MM-DD" cho Date trong local timezone.
 */
export const toLocalISODate = (d: Date): string =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/**
 * Lấy Date từ ISO "YYYY-MM-DD" theo local timezone (không qua UTC).
 */
export const fromLocalISODate = (iso: string): Date => {
  const [y, m, day] = iso.split("-").map(Number);
  return new Date(y, m - 1, day);
};

/**
 * Format ngày kiểu VN: "Thứ 5, 24/07/2026"
 */
export const formatDateVN = (iso: string): string => {
  const d = fromLocalISODate(iso);
  return `${WEEKDAYS_FULL[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

/**
 * Format ngày ngắn: "T5, 24/07/2026"
 */
export const formatDateVNShort = (iso: string): string => {
  const d = fromLocalISODate(iso);
  return `${WEEKDAYS_SHORT[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

/**
 * Format giờ + ngày kiểu ISO: "2026-07-24 09:00" (cho countdown)
 */
export const formatDateTimeLocal = (isoDate: string, time: string): Date => {
  // isoDate: "YYYY-MM-DD", time: "HH:mm"
  const [y, m, day] = isoDate.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return new Date(y, m - 1, day, hh, mm);
};

/**
 * Trả về n ngày kế tiếp từ hôm nay (theo local timezone).
 */
export const nextNDays = (n: number, from: Date = new Date()): Date[] => {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
};

/**
 * So sánh 2 ISO date strings (YYYY-MM-DD).
 */
export const isSameLocalDay = (iso1: string, iso2: string): boolean => iso1 === iso2;