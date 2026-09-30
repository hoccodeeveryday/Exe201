/**
 * Bộ mock data thống kê 12 tháng (admin dashboard).
 * Số liệu mang tính minh họa - sẽ thay bằng API thật.
 */

export interface MonthlyPoint {
  /** "T01" → "T12" */
  label: string;
  value: number;
}

export const REVENUE_12M: MonthlyPoint[] = [
  { label: "T01", value: 28 },
  { label: "T02", value: 32 },
  { label: "T03", value: 41 },
  { label: "T04", value: 39 },
  { label: "T05", value: 51 },
  { label: "T06", value: 58 },
  { label: "T07", value: 62 },
  { label: "T08", value: 71 },
  { label: "T09", value: 68 },
  { label: "T10", value: 79 },
  { label: "T11", value: 88 },
  { label: "T12", value: 96 },
];

export const NEW_USERS_12M: MonthlyPoint[] = [
  { label: "T01", value: 124 },
  { label: "T02", value: 142 },
  { label: "T03", value: 168 },
  { label: "T04", value: 159 },
  { label: "T05", value: 203 },
  { label: "T06", value: 241 },
  { label: "T07", value: 278 },
  { label: "T08", value: 312 },
  { label: "T09", value: 295 },
  { label: "T10", value: 341 },
  { label: "T11", value: 388 },
  { label: "T12", value: 425 },
];

export const APPOINTMENTS_12M: MonthlyPoint[] = [
  { label: "T01", value: 312 },
  { label: "T02", value: 358 },
  { label: "T03", value: 401 },
  { label: "T04", value: 423 },
  { label: "T05", value: 489 },
  { label: "T06", value: 512 },
  { label: "T07", value: 547 },
  { label: "T08", value: 612 },
  { label: "T09", value: 588 },
  { label: "T10", value: 691 },
  { label: "T11", value: 742 },
  { label: "T12", value: 821 },
];

export const APPTS_BY_DAY: MonthlyPoint[] = [
  { label: "T2", value: 18 },
  { label: "T3", value: 24 },
  { label: "T4", value: 32 },
  { label: "T5", value: 28 },
  { label: "T6", value: 38 },
  { label: "T7", value: 45 },
  { label: "CN", value: 22 },
];

export interface BreedSlice {
  name: string;
  pct: number;
  color: string;
}

export const BREED_DIST: BreedSlice[] = [
  { name: "Chó (Cún)", pct: 48, color: "#6366F1" },
  { name: "Mèo (Miêu)", pct: 32, color: "#A855F7" },
  { name: "Chim", pct: 8, color: "#10B981" },
  { name: "Thỏ", pct: 7, color: "#F59E0B" },
  { name: "Khác", pct: 5, color: "#64748B" },
];

export interface TopDoctor {
  name: string;
  spec: string;
  appts: number;
  rating: number;
  revenue: string;
}

export const TOP_DOCTORS: TopDoctor[] = [
  { name: "BS. Nguyễn Văn A", spec: "Nội khoa", appts: 142, rating: 4.9, revenue: "42.5tr" },
  { name: "BS. Trần Thị B", spec: "Da liễu", appts: 128, rating: 4.8, revenue: "38.2tr" },
  { name: "BS. Lê Văn C", spec: "Phẫu thuật", appts: 96, rating: 4.9, revenue: "31.0tr" },
  { name: "BS. Phạm Thị D", spec: "Tiêm chủng", appts: 89, rating: 4.7, revenue: "24.8tr" },
  { name: "BS. Hoàng Văn E", spec: "Nha khoa", appts: 74, rating: 4.8, revenue: "21.4tr" },
];

export interface AdminActivity {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
  type: "create" | "update" | "delete" | "alert";
}

export const RECENT_ACTIVITY: AdminActivity[] = [
  { id: "ACT-001", actor: "BS. Nguyễn Văn A", action: "đã xác nhận", target: "lịch hẹn APT-002", time: "5 phút trước", type: "update" },
  { id: "ACT-002", actor: "Admin", action: "đã khóa tài khoản", target: "VG-005 (Minh Nhật)", time: "12 phút trước", type: "alert" },
  { id: "ACT-003", actor: "Yến Nhi", action: "đã đăng bài", target: "\"Chăm bé Mít sau tiêm\"", time: "24 phút trước", type: "create" },
  { id: "ACT-004", actor: "Hệ thống", action: "gửi", target: "200 nhắc lịch tiêm", time: "1 giờ trước", type: "create" },
  { id: "ACT-005", actor: "BS. Trần Thị B", action: "đã ẩn bài viết", target: "POST-007", time: "2 giờ trước", type: "delete" },
  { id: "ACT-006", actor: "Mai Anh", action: "đã đăng ký gói", target: "Premium", time: "3 giờ trước", type: "update" },
];

export interface SystemHealth {
  name: string;
  status: "operational" | "degraded" | "down";
  uptime: string;
}

export const SYSTEM_HEALTH: SystemHealth[] = [
  { name: "API Gateway", status: "operational", uptime: "99.98%" },
  { name: "AI Inference", status: "operational", uptime: "99.91%" },
  { name: "Storage S3", status: "degraded", uptime: "98.42%" },
  { name: "Notification", status: "operational", uptime: "99.99%" },
  { name: "Database", status: "operational", uptime: "99.97%" },
];

export const SYSTEM_ALERTS = [
  { severity: "warning" as const, text: "S3 storage đang hoạt động ở 92% capacity. Cân nhắc dọn dẹp." },
  { severity: "info" as const, text: "API latency trung bình 124ms, dưới ngưỡng 200ms." },
  { severity: "info" as const, text: "AI inference cost tháng này tăng 14% so với tháng trước." },
];