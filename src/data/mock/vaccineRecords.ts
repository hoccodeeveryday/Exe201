/**
 * Bộ mock data phẳng dùng cho AdminVaxPage - gộp overdue/upcoming/done thành 1 danh sách.
 */
export interface VaccineRecord {
  id: string;
  pet: string;
  breed: string;
  vaccine: string;
  date: string;
  status: "overdue" | "soon" | "done";
}

export const VACCINE_RECORDS: VaccineRecord[] = [
  { id: "VX-001", pet: "Bé Mít", breed: "Corgi", vaccine: "Vaccine 5 trong 1 (DHPPi-L)", date: "15/01/2026", status: "done" },
  { id: "VX-002", pet: "Bé Mít", breed: "Corgi", vaccine: "Vaccine dại (Rabies)", date: "20/06/2026", status: "soon" },
  { id: "VX-003", pet: "Bé Mít", breed: "Corgi", vaccine: "Vaccine Phế quản (Bronchitis)", date: "15/05/2026", status: "overdue" },
  { id: "VX-004", pet: "Bông", breed: "Poodle", vaccine: "Vaccine Parvo", date: "08/03/2026", status: "done" },
  { id: "VX-005", pet: "Bông", breed: "Poodle", vaccine: "Vaccine Care", date: "14/07/2026", status: "overdue" },
  { id: "VX-006", pet: "Cang", breed: "Corgi", vaccine: "Vaccine 5 trong 1", date: "20/08/2026", status: "soon" },
  { id: "VX-007", pet: "Pudding", breed: "Mèo Anh", vaccine: "Vaccine FVRCP", date: "12/05/2026", status: "done" },
  { id: "VX-008", pet: "Pudding", breed: "Mèo Anh", vaccine: "Vaccine dại cho mèo", date: "01/08/2026", status: "soon" },
  { id: "VX-009", pet: "Mochi", breed: "Mèo Ba Tư", vaccine: "Vaccine FIV", date: "22/03/2026", status: "overdue" },
  { id: "VX-010", pet: "Bé Mít", breed: "Corgi", vaccine: "Vaccine Cúm chó", date: "20/06/2025", status: "done" },
];