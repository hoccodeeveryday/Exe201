// src/types/index.ts

export interface Pet {
  name: string;
  breed: string;
  gender: string;
  dob: string;
  weight: string;
  note: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;            // "BS.", "PGS.TS."
  spec: string;             // mô tả dài
  specShort: string;        // ngắn gọn: "Ngoại - Chấn thương"
  tags: string[];           // tag chuyên môn
  rating: string;
  reviews: number;
  avatar: string;           // emoji
  avatarBg: string;         // tailwind gradient
  clinic: string;
  fee: number;              // phí khám (VND)
  experience: number;       // năm kinh nghiệm
  nextAvailable: string;    // "Hôm nay", "Ngày mai"
}

export interface Post {
  author: string;
  badge: string;
  time: string;
  emoji: string;
  content: string;
  img: string;
  likes: number;
  comments: number;
}

export interface Vaccine {
  id?: string;
  name: string;
  note: string;
  date: string;
  comment: string;
  doctor?: string;     // bác sĩ tiêm
  clinic?: string;     // nơi tiêm
  lot?: string;        // số lô vaccine
  nextDue?: string;    // ngày nhắc tiêm tiếp (ISO)
  reaction?: "none" | "mild" | "moderate" | "severe"; // phản ứng phụ sau tiêm
  species?: "dog" | "cat" | "rabbit" | "bird" | "all";
}

export type Role = "admin" | "user";

export interface NavItem {
  id: string;
  icon: string;
  label: string;
  path: string;
  roles?: Role[];
}

export interface User {
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "user";
  /** Key trong PET_PROFILES — dùng để map user thật sang chủ pet khi tên không trùng. */
  petOwner?: string;
}

export interface Testimonial {
  name: string;
  pet: string;
  petEmoji?: string;
  rating: number;
  content: string;
  text: string; // backwards compatibility
}
