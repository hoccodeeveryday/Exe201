/**
 * Quản lý lịch sử kết quả AI Check.
 * Lưu trong localStorage; production nên thay bằng API backend.
 */

const KEY = "ai_history";

export interface AiHistoryRecord {
  id: string;
  petId: string | null;
  symptoms: string;
  tags: string[];
  duration: string;
  scenarioId: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  topDisease: string | undefined;
  /** ISO timestamp khi lưu */
  savedAt: string;
  /** Optional: photo dataURL nếu có (giữ nhỏ để tránh localStorage quá tải) */
  photo?: string | null;
}

export const readAiHistory = (): AiHistoryRecord[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as AiHistoryRecord[];
  } catch {
    return [];
  }
};

export const writeAiHistory = (records: AiHistoryRecord[]): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify(records));
    emitChanged("vetgen:ai-history-changed");
  } catch {
    // Quota exceeded — bỏ qua, không crash app
  }
};

export const addAiHistory = (record: AiHistoryRecord): AiHistoryRecord[] => {
  const existing = readAiHistory();
  const next = [record, ...existing];
  writeAiHistory(next);
  return next;
};

export const removeAiHistory = (id: string): AiHistoryRecord[] => {
  const next = readAiHistory().filter(r => r.id !== id);
  writeAiHistory(next);
  return next;
};

export const clearAiHistory = (): void => {
  try {
    localStorage.removeItem(KEY);
    emitChanged("vetgen:ai-history-changed");
  } catch {
    // ignore
  }
};

/**
 * Tạo id ngắn gọn, dễ đọc (giống format appointment code).
 */
export const makeAiHistoryId = (): string => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) {
    s += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `AI-${s}`;
};

/**
 * Quản lý lịch hẹn (ConfirmSuccess lưu).
 */
const APT_KEY = "appointments";

export interface AppointmentRecord {
  id: string;
  petId: string | null;
  petName?: string;
  doctorId: string;
  doctorName: string;
  doctorSpec?: string;
  reasonId?: string;
  reasonLabel?: string;
  date: string;
  time: string;
  modeId?: string;
  modeLabel?: string;
  fee: number;
  symptomNote?: string;
  createdAt: string;
}

export const readAppointments = (): AppointmentRecord[] => {
  try {
    return JSON.parse(localStorage.getItem(APT_KEY) ?? "[]") as AppointmentRecord[];
  } catch {
    return [];
  }
};

/**
 * Phát event để mọi AiHistoryList / AppointmentList đang mount đồng bộ lại dữ liệu.
 * An toàn trên mọi môi trường (Node test không có window).
 */
const emitChanged = (eventName: string): void => {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent(eventName));
  } catch {
    // ignore
  }
};

export const writeAppointments = (records: AppointmentRecord[]): void => {
  try {
    localStorage.setItem(APT_KEY, JSON.stringify(records));
    emitChanged("vetgen:appointments-changed");
  } catch {
    // Quota exceeded — bỏ qua, không crash app
  }
};

export const addAppointment = (record: AppointmentRecord): AppointmentRecord[] => {
  const existing = readAppointments();
  const next = [record, ...existing];
  writeAppointments(next);
  return next;
};

export const removeAppointment = (id: string): AppointmentRecord[] => {
  const next = readAppointments().filter(r => r.id !== id);
  writeAppointments(next);
  return next;
};

export const clearAppointments = (): void => {
  try {
    localStorage.removeItem(APT_KEY);
    emitChanged("vetgen:appointments-changed");
  } catch {
    // ignore
  }
};