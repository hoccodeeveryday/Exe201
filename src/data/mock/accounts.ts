import { User } from "@/types";

/**
 * Tài khoản cứng để demo phân quyền admin / user.
 * Sau này sẽ thay bằng API thực.
 *
 * `petOwner` (optional) là key trong PET_PROFILES — nếu user tên khác với chủ pet
 * (vd "Nguyễn Hoàng Mai Thảo" → pet owner "Mai Anh"), lookup sẽ theo `petOwner`
 * thay vì `name`. Nếu không có thì fallback về `name`.
 */
export interface DemoAccount extends User {
  password: string;
  /** Emoji avatar cho pet đi kèm (dùng cho landing & overview). */
  petEmoji?: string;
  /** Màu gradient đại diện cho persona (dùng ở hero card). */
  gradient?: string;
  /** Key trong PET_PROFILES — chỉ định chủ của thú cưng khi tên user không trùng. */
  petOwner?: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    name: "Yến Nhi",
    email: "yennhi@vetgen.vn",
    password: "123456",
    avatar: "Y",
    role: "user",
    petEmoji: "🐶",
    gradient: "from-rose-400 to-pink-500",
  },
  {
    name: "Nguyễn Hoàng Mai Thảo",
    email: "maithao@vetgen.vn",
    password: "123456",
    avatar: "T",
    role: "user",
    petEmoji: "🐩",
    gradient: "from-pink-400 to-fuchsia-500",
    petOwner: "Nguyễn Hoàng Mai Thảo",
  },
  {
    name: "Khoa Có",
    email: "khoanguyen@vetgen.vn",
    password: "123456",
    avatar: "K",
    role: "user",
    petEmoji: "🐕",
    gradient: "from-amber-400 to-orange-500",
    petOwner: "Khoa Có",
  },
  {
    name: "Tung Cao",
    email: "TungCao@vetgen.vn",
    password: "123456",
    avatar: "C",
    role: "user",
    petEmoji: "🐱",
    gradient: "from-violet-400 to-purple-500",
    petOwner: "Tung Cao",
  },
  {
    name: "Lê Nhi",
    email: "lenhi@vetgen.vn",
    password: "123456",
    avatar: "L",
    role: "user",
    petEmoji: "🐈",
    gradient: "from-cyan-400 to-blue-500",
    petOwner: "Lê Nhi",
  },
  {
    name: "Nghĩa Báo",
    email: "hanghia@vetgen.vn",
    password: "123456",
    avatar: "B",
    role: "user",
    petEmoji: "🐰",
    gradient: "from-emerald-400 to-teal-500",
    petOwner: "Nghĩa Báo",
  },
  {
    name: "Phương Uyên",
    email: "phuonguyen@vetgen.vn",
    password: "123456",
    avatar: "P",
    role: "user",
    petEmoji: "🦜",
    gradient: "from-sky-400 to-indigo-500",
  },
  {
    name: "Admin VetGen",
    email: "admin@vetgen.vn",
    password: "admin123",
    avatar: "A",
    role: "admin",
    petEmoji: "🛡️",
    gradient: "from-indigo-500 to-purple-600",
  },
];

/**
 * Tra cứu pet owner key từ user (có thể có petOwner riêng).
 * Trả về key trong PET_PROFILES — hoặc undefined nếu user null.
 */
export const getPetOwnerKey = (user: User | null | undefined): string | undefined => {
  if (!user?.name) return undefined;
  const acc = DEMO_ACCOUNTS.find(a => a.name === user.name);
  return acc?.petOwner ?? user.name;
};

/**
 * Giúp Autofill nhanh trong form login: click 1 nút là điền email/password.
 */
export const ADMIN_FILL = {
  email: "admin@vetgen.vn",
  password: "admin123",
};

export const USER_FILL = {
  email: "yennhi@vetgen.vn",
  password: "123456",
};

/** Lấy demo account đầu tiên theo role (cho autofill). */
export const getFirstDemoByRole = (role: "admin" | "user"): DemoAccount => {
  const acc = DEMO_ACCOUNTS.find(a => a.role === role);
  if (!acc) throw new Error(`No demo account for role ${role}`);
  return acc;
};