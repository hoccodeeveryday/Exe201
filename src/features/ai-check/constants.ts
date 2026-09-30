/**
 * Triệu chứng phổ biến cho AI Check, phân theo category.
 */

export interface SymptomTag {
  label: string;
  emoji: string;
  category: "respiratory" | "digestive" | "dermatology" | "behavioral" | "systemic" | "musculoskeletal";
  severity: "mild" | "moderate" | "severe";
}

export const QUICK_TAGS: SymptomTag[] = [
  // Hô hấp
  { label: "Ho", emoji: "🤧", category: "respiratory", severity: "mild" },
  { label: "Hắt hơi", emoji: "🤲", category: "respiratory", severity: "mild" },
  { label: "Chảy nước mũi", emoji: "💧", category: "respiratory", severity: "mild" },
  { label: "Khó thở", emoji: "😮‍💨", category: "respiratory", severity: "severe" },
  { label: "Khò khè", emoji: "💨", category: "respiratory", severity: "moderate" },

  // Tiêu hóa
  { label: "Bỏ ăn", emoji: "🚫", category: "digestive", severity: "moderate" },
  { label: "Nôn mửa", emoji: "🤮", category: "digestive", severity: "moderate" },
  { label: "Tiêu chảy", emoji: "💩", category: "digestive", severity: "moderate" },
  { label: "Chướng bụng", emoji: "🎈", category: "digestive", severity: "severe" },

  // Da liễu
  { label: "Ngứa", emoji: "🪲", category: "dermatology", severity: "mild" },
  { label: "Rụng lông", emoji: "🧶", category: "dermatology", severity: "moderate" },
  { label: "Đỏ da", emoji: "🔴", category: "dermatology", severity: "moderate" },
  { label: "Mụn / vảy", emoji: "⚪", category: "dermatology", severity: "moderate" },

  // Hành vi
  { label: "Lờ đờ", emoji: "😴", category: "behavioral", severity: "mild" },
  { label: "Mệt mỏi", emoji: "🥱", category: "systemic", severity: "mild" },
  { label: "Run rẩy", emoji: "🥶", category: "behavioral", severity: "moderate" },
  { label: "Cắn / cào", emoji: "😾", category: "behavioral", severity: "moderate" },

  // Toàn thân
  { label: "Sốt", emoji: "🌡️", category: "systemic", severity: "severe" },
  { label: "Chảy nước mắt", emoji: "😢", category: "dermatology", severity: "mild" },

  // Xương khớp
  { label: "Đi khập khiễng", emoji: "🦿", category: "musculoskeletal", severity: "moderate" },
  { label: "Khó đứng", emoji: "🦴", category: "musculoskeletal", severity: "severe" },
];

export const CATEGORY_LABEL: Record<string, string> = {
  respiratory: "Hô hấp",
  digestive: "Tiêu hóa",
  dermatology: "Da liễu",
  behavioral: "Hành vi",
  systemic: "Toàn thân",
  musculoskeletal: "Xương khớp",
};

export const CATEGORY_EMOJI: Record<string, string> = {
  respiratory: "🫁",
  digestive: "🍽️",
  dermatology: "🌿",
  behavioral: "🧠",
  systemic: "💗",
  musculoskeletal: "🦴",
};

/**
 * Nhóm tags theo category.
 */
export const TAGS_BY_CATEGORY: Record<string, SymptomTag[]> = QUICK_TAGS.reduce(
  (acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category].push(t);
    return acc;
  },
  {} as Record<string, SymptomTag[]>,
);

/**
 * Duration options (khoảng thời gian bị triệu chứng).
 */
export const DURATION_OPTIONS = [
  { id: "today", label: "Hôm nay", emoji: "📅" },
  { id: "1-3d", label: "1–3 ngày", emoji: "🗓️" },
  { id: "1w", label: "Khoảng 1 tuần", emoji: "📆" },
  { id: "2w+", label: "Hơn 2 tuần", emoji: "🗓️" },
  { id: "month", label: "Hơn 1 tháng", emoji: "📅" },
];