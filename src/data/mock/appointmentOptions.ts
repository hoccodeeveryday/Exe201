/**
 * Lý do đặt lịch khám thú cưng.
 * Mỗi reason map tới emoji + category + doctor spec gợi ý.
 */
export interface AppointmentReason {
  id: string;
  label: string;
  emoji: string;
  category: "general" | "emergency" | "specialist" | "wellness";
  description: string;
  suggestSpec?: string; // gợi ý bác sĩ
  isEmergency?: boolean;
}

export const APPOINTMENT_REASONS: AppointmentReason[] = [
  { id: "general-checkup", label: "Khám tổng quát", emoji: "🩺", category: "general", description: "Kiểm tra sức khỏe định kỳ", suggestSpec: "Dinh dưỡng - Phòng ngừa" },
  { id: "vaccine", label: "Tiêm phòng", emoji: "💉", category: "wellness", description: "Vaccine định kỳ", suggestSpec: "Dinh dưỡng - Phòng ngừa" },
  { id: "tẩy-giun", label: "Tẩy giun", emoji: "💊", category: "wellness", description: "Tẩy giun định kỳ", suggestSpec: "Dinh dưỡng - Phòng ngừa" },
  { id: "skin-issue", label: "Vấn đề da liễu", emoji: "🌿", category: "specialist", description: "Ngứa, rụng lông, phát ban", suggestSpec: "Da liễu - Nội khoa" },
  { id: "digestive", label: "Vấn đề tiêu hóa", emoji: "🍽️", category: "specialist", description: "Tiêu chảy, nôn, bỏ ăn", suggestSpec: "Da liễu - Nội khoa" },
  { id: "bone-joint", label: "Đau xương khớp", emoji: "🦴", category: "specialist", description: "Khập khiễng, đau chân", suggestSpec: "Ngoại - Chấn thương" },
  { id: "behavior", label: "Hành vi bất thường", emoji: "😰", category: "specialist", description: "Stress, lo lắng, cắn", suggestSpec: "Hành vi - Tâm lý" },
  { id: "nutrition", label: "Tư vấn dinh dưỡng", emoji: "🥗", category: "general", description: "Chế độ ăn phù hợp", suggestSpec: "Dinh dưỡng - Phòng ngừa" },
  { id: "weight-tracking", label: "Theo dõi cân nặng", emoji: "⚖️", category: "wellness", description: "Kiểm tra cân nặng định kỳ", suggestSpec: "Dinh dưỡng - Phòng ngừa" },
  { id: "emergency", label: "CẤP CỨU", emoji: "🚑", category: "emergency", description: "Khẩn cấp - Ưu tiên xử lý ngay", suggestSpec: "Cấp cứu - Hồi sức", isEmergency: true },
];

/**
 * Hình thức khám
 */
export interface AppointmentMode {
  id: "clinic" | "home" | "online";
  label: string;
  emoji: string;
  description: string;
  feeMultiplier: number; // hệ số nhân phí khám
  available: boolean;
}

export const APPOINTMENT_MODES: AppointmentMode[] = [
  {
    id: "clinic",
    label: "Tại phòng khám",
    emoji: "🏥",
    description: "Khám trực tiếp tại cơ sở",
    feeMultiplier: 1,
    available: true,
  },
  {
    id: "home",
    label: "Bác sĩ đến nhà",
    emoji: "🏠",
    description: "Phụ phí di chuyển 200k",
    feeMultiplier: 1.5,
    available: true,
  },
  {
    id: "online",
    label: "Tư vấn online",
    emoji: "💻",
    description: "Video call - Giảm 30% phí",
    feeMultiplier: 0.7,
    available: true,
  },
];