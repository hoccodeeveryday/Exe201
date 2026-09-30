/**
 * PetProfile mở rộng cho VetGen UI (không extend Pet gốc vì weight: number vs string).
 */
export interface PetProfile {
  name: string;
  breed: string;
  age: string;
  emoji: string;
  avatarBg: string; // tailwind gradient
  mood: "happy" | "sleepy" | "playful" | "hungry" | "shy";
  healthScore: number; // 0-100
  weight: number; // kg
  height: number; // cm
  birthday: string;
  hobbies: string[];
  color: string;
  microchip: string;
  ownerSince: string;
  lastCheckup: string;
  nextVaccine: string;
  notes: string;
}

export const CURRENT_PET: PetProfile = {
  name: "Bé Mít",
  breed: "Corgi Pembroke",
  age: "2 tuổi 3 tháng",
  emoji: "🐶",
  avatarBg: "from-rose-300 via-pink-300 to-fuchsia-300",
  mood: "playful",
  healthScore: 92,
  weight: 8.5,
  height: 28,
  birthday: "12/04/2024",
  hobbies: ["Săn bóng", "Đi công viên", "Ăn bánh thưởng", "Ngủ trưa"],
  color: "Vàng cam - Trắng",
  microchip: "VN-2024-001287",
  ownerSince: "12/05/2024",
  lastCheckup: "20/05/2026",
  nextVaccine: "20/06/2026",
  notes: "Bé Mít rất thích ăn bánh thưởng và ghét tắm. Nên cho ăn 2 bữa/ngày.",
};

export const PET_PROFILES: Record<string, PetProfile> = {
  "Yến Nhi": CURRENT_PET,
  "Nguyễn Hoàng Mai Thảo": {
    name: "Bông",
    breed: "Poodle Tiny",
    age: "3 tuổi",
    emoji: "🐩",
    avatarBg: "from-pink-300 via-rose-300 to-red-300",
    mood: "happy",
    healthScore: 95,
    weight: 4.2,
    height: 22,
    birthday: "08/02/2023",
    hobbies: ["Duỗi lông", "Chụp ảnh", "Đi spa"],
    color: "Kem",
    microchip: "VN-2023-005412",
    ownerSince: "20/02/2023",
    lastCheckup: "02/06/2026",
    nextVaccine: "15/08/2026",
    notes: "Bông đi spa 2 tuần/lần, cần chải lông hàng ngày. Mai Thảo thường đăng story cùng Bông mỗi cuối tuần.",
  },
  "Khoa Có": {
    name: "Cang",
    breed: "Corgi Cardigan",
    age: "1 tuổi 5 tháng",
    emoji: "🐕",
    avatarBg: "from-amber-300 via-orange-300 to-yellow-300",
    mood: "hungry",
    healthScore: 88,
    weight: 9.1,
    height: 30,
    birthday: "15/03/2025",
    hobbies: ["Chạy bộ", "Bắt bóng", "Ăn vặt"],
    color: "Đen - Trắng",
    microchip: "VN-2025-002103",
    ownerSince: "01/04/2025",
    lastCheckup: "10/04/2026",
    nextVaccine: "20/08/2026",
    notes: "Cang rất hiếu động, cần vận động ít nhất 45 phút/ngày. Khoa hay dắt Cang đi công viên Tao Đàn.",
  },
  "Tung Cao": {
    name: "Pudding",
    breed: "Mèo Anh lông ngắn",
    age: "4 tuổi",
    emoji: "🐱",
    avatarBg: "from-violet-300 via-purple-300 to-fuchsia-300",
    mood: "sleepy",
    healthScore: 90,
    weight: 4.8,
    height: 26,
    birthday: "22/05/2022",
    hobbies: ["Ngủ", "Liếm lông", "Nhìn chim"],
    color: "Xám xanh",
    microchip: "VN-2022-008721",
    ownerSince: "01/06/2022",
    lastCheckup: "15/05/2026",
    nextVaccine: "01/08/2026",
    notes: "Pudding ngủ trung bình 16 tiếng/ngày. Tung thường để Pudding trên bàn làm việc.",
  },
  "Lê Nhi": {
    name: "Mochi",
    breed: "Mèo Ba Tư",
    age: "2 tuổi",
    emoji: "🐈",
    avatarBg: "from-cyan-300 via-blue-300 to-indigo-300",
    mood: "shy",
    healthScore: 85,
    weight: 5.2,
    height: 25,
    birthday: "10/07/2024",
    hobbies: ["Chơi cần câu", "Ngủ nắng", "Liếm lông"],
    color: "Trắng - Kem",
    microchip: "VN-2024-009876",
    ownerSince: "01/08/2024",
    lastCheckup: "01/06/2026",
    nextVaccine: "22/09/2026",
    notes: "Mochi cần chải lông 2 lần/tuần do lông dài. Nhi chăm chải lông mỗi tối.",
  },
  "Nghĩa Báo": {
    name: "Táo",
    breed: "Thỏ Hà Lan",
    age: "1 tuổi",
    emoji: "🐰",
    avatarBg: "from-emerald-300 via-teal-300 to-cyan-300",
    mood: "happy",
    healthScore: 94,
    weight: 2.1,
    height: 18,
    birthday: "30/06/2025",
    hobbies: ["Ăn cà rốt", "Nhảy", "Khám phá"],
    color: "Nâu - Trắng",
    microchip: "VN-2025-003412",
    ownerSince: "01/07/2025",
    lastCheckup: "15/05/2026",
    nextVaccine: "30/11/2026",
    notes: "Táo ăn rau mỗi ngày, chuồng cần dọn mỗi 2 ngày. Nghĩa nuôi Táo ngoài ban công có mái che.",
  },
  "Phương Uyên": {
    name: "Coco",
    breed: "Vẹt Xanh Nam Mỹ",
    age: "5 tuổi",
    emoji: "🦜",
    avatarBg: "from-sky-300 via-blue-300 to-indigo-300",
    mood: "playful",
    healthScore: 91,
    weight: 0.4,
    height: 32,
    birthday: "12/03/2021",
    hobbies: ["Nói chuyện", "Hót", "Leo trèo"],
    color: "Xanh dương - Vàng",
    microchip: "VN-2021-001248",
    ownerSince: "20/03/2021",
    lastCheckup: "10/05/2026",
    nextVaccine: "12/09/2026",
    notes: "Coco biết nói ~50 từ. Cần tương tác 2 tiếng/ngày. Uyên dạy Coco nói thêm mỗi sáng.",
  },
};

/**
 * Tìm pet profile theo TÊN thú cưng (vd "Bé Mít", "Bông", "Pudding").
 *
 * Vì records trong localStorage (AI history, Appointments) lưu petId = pet.name
 * nhưng PET_PROFILES lại key theo ownerName, cần 1 helper duy nhất để lookup
 * 2 chiều, tránh lỗi "Pet không tồn tại trong hệ thống".
 *
 * Trả về undefined nếu không tìm thấy — caller quyết định hiển thị fallback.
 */
export const findPetByName = (petName: string): PetProfile | undefined => {
  if (!petName) return undefined;
  const all = Object.values(PET_PROFILES);
  return all.find(p => p.name === petName);
};

/** Tên thú cưng có hợp lệ trong hệ thống không. */
export const isPetNameValid = (petName: string): boolean => {
  return !!findPetByName(petName);
};

/**
 * Cache runtime cho pet được tạo nhanh (user mới đăng ký chưa có hồ sơ thật).
 * Key = owner key (user.name hoặc user.petOwner).
 */
const runtimePetCache: Record<string, PetProfile> = {};

/** Helper: tạo PetProfile mặc định cho user mới đăng ký. */
const buildPlaceholderPet = (ownerName: string, petName: string): PetProfile => {
  const slug = petName || ownerName;
  return {
    name: slug,
    breed: "Chưa rõ",
    age: "Chưa rõ",
    emoji: "🐾",
    avatarBg: "from-rose-300 to-pink-400",
    mood: "happy",
    healthScore: 100,
    weight: 0,
    height: 0,
    birthday: "",
    hobbies: [],
    color: "",
    microchip: "",
    ownerSince: new Date().toLocaleDateString("vi-VN"),
    lastCheckup: "",
    nextVaccine: "",
    notes: "Thú cưng mới. Vui lòng cập nhật hồ sơ chi tiết ở trang Hồ sơ thú cưng.",
  };
};

/**
 * Lấy danh sách pet thuộc về user hiện tại.
 * Trong demo: 1 user = 1 pet chính. Production sẽ query server.
 *
 * Trả về mảng (rỗng nếu không có user).
 *
 * Lookup ưu tiên theo `user.petOwner` (nếu có) → dùng để map tên user thực
 * (vd "Nguyễn Hoàng Mai Thảo") sang key trong PET_PROFILES (vd "Mai Anh").
 * Fallback về `user.name`.
 *
 * Nếu user mới đăng ký chưa có trong PET_PROFILES → tạo placeholder runtime
 * để user vào app thấy ngay 1 pet mặc định (không rỗng).
 *
 * ⚠️ KHÔNG dùng Object.values(PET_PROFILES) cho màn hình chọn pet của user —
 * làm vậy sẽ leak pet của user khác (bug cross-user booking).
 */
export const getUserPets = (
  user: { name?: string; petOwner?: string } | null | undefined
): PetProfile[] => {
  if (!user?.name) return [];
  const key = user.petOwner ?? user.name;
  const owner = PET_PROFILES[key] ?? runtimePetCache[key];
  if (owner) return [owner];
  // User mới chưa có pet nào — tạo placeholder runtime để UI không empty.
  const placeholder = buildPlaceholderPet(key, key);
  runtimePetCache[key] = placeholder;
  return [placeholder];
};

/** Pet đầu tiên của user hiện tại (helper shorthand). */
export const getUserFirstPet = (
  user: { name?: string; petOwner?: string } | null | undefined
): PetProfile | undefined => {
  return getUserPets(user)[0];
};