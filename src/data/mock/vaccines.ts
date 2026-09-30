import { Vaccine } from "@/types";

export const OVERDUE_VACCINES: Vaccine[] = [
  {
    id: "vac-001",
    name: "Mũi nhắc phòng bệnh Phế quản (Bronchitis Vaccine)",
    note: "Khuyến nghị tiêm phòng định kỳ mỗi 6 tháng • Trạm thú y nội khu",
    date: "15/05/2026",
    comment: "Đã trễ lịch hẹn tiêm phòng từ 15/05/2026. Hãy đặt lịch bác sĩ để tiêm ngay.",
    doctor: "BS. Nguyễn Văn A",
    clinic: "Bệnh viện Thú y VetGen - Cơ sở 1",
    lot: "VN-BC-2026-04",
    reaction: "mild",
    species: "dog",
  },
];

export const UPCOMING_VACCINES: Vaccine[] = [
  {
    id: "vac-002",
    name: "Mũi tiêm phòng bệnh dại (Rabies Vaccine)",
    note: "Tiêm nhắc định kỳ hàng năm • Bệnh viện Thú y VetGen",
    date: "20/06/2026",
    comment: "Lịch nhắc mũi tiêm thứ 2, tránh tiếp xúc động vật lạ trước ngày tiêm.",
    doctor: "BS. Lê Văn C",
    clinic: "Bệnh viện Thú y VetGen - Cơ sở 3",
    lot: "VN-RB-2026-06",
    species: "dog",
  },
  {
    id: "vac-003",
    name: "Vaccine phòng bệnh Leptospira (mũi nhắc)",
    note: "Phòng bệnh do vi khuẩn Leptospira • Mỗi năm 1 lần",
    date: "15/08/2026",
    comment: "Mũi nhắc giúp duy trì miễn dịch. Bác sĩ sẽ khám sức khỏe trước khi tiêm.",
    doctor: "BS. Lê Văn C",
    clinic: "Bệnh viện Thú y VetGen - Cơ sở 3",
    species: "dog",
  },
];

export const INJECTED_VACCINES: Vaccine[] = [
  {
    id: "vac-004",
    name: "Vaccine 5 trong 1 cho chó (DHPPi-L)",
    note: "Phòng bệnh Care, Parvo, Viêm gan, Phế quản, Leptospira • Bệnh viện Thú y VetGen",
    date: "15/01/2026",
    comment: "Cơ thể phản ứng tốt, không sốt, ăn uống bình thường sau khi tiêm.",
    doctor: "BS. Nguyễn Văn A",
    clinic: "Bệnh viện Thú y VetGen - Cơ sở 1",
    lot: "VN-DH-2026-01",
    nextDue: "15/01/2027",
    reaction: "none",
    species: "dog",
  },
  {
    id: "vac-005",
    name: "Vaccine Cúm thường niên (Canine Influenza)",
    note: "Hỗ trợ bảo vệ đường hô hấp • Phòng khám thú y nội khu",
    date: "20/06/2025",
    comment: "Hơi mệt mỏi nhẹ vào ngày đầu, trở lại khỏe mạnh ngày hôm sau.",
    doctor: "BS. Trần Thị B",
    clinic: "Phòng khám Thú y Nội khu",
    lot: "VN-CI-2025-06",
    nextDue: "20/06/2026",
    reaction: "mild",
    species: "dog",
  },
  {
    id: "vac-006",
    name: "Vaccine Parvo cho chó con (mũi 3/3)",
    note: "Phòng bệnh Parvo • Hoàn thành chuỗi cơ bản",
    date: "10/05/2024",
    comment: "Hoàn thành 3 mũi cơ bản, miễn dịch ổn định.",
    doctor: "BS. Lê Văn C",
    clinic: "Bệnh viện Thú y VetGen - Cơ sở 3",
    lot: "VN-PV-2024-05",
    reaction: "none",
    species: "dog",
  },
];

export const REACTION_LABEL: Record<string, string> = {
  none: "Không có",
  mild: "Nhẹ",
  moderate: "Trung bình",
  severe: "Nặng",
};

export const REACTION_COLOR: Record<string, string> = {
  none: "text-emerald-600 bg-emerald-50 border-emerald-100",
  mild: "text-amber-600 bg-amber-50 border-amber-100",
  moderate: "text-orange-600 bg-orange-50 border-orange-100",
  severe: "text-rose-600 bg-rose-50 border-rose-100",
};