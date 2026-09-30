/**
 * Mock dataset cho AI chẩn đoán thú cưng (chó/mèo).
 * Mỗi entry map keyword triệu chứng -> danh sách bệnh khả thi + gợi ý.
 * Sau này sẽ thay bằng model AI thực.
 */

export interface DiseaseResult {
  name: string;
  pct: number; // 0-100
  severity: "low" | "medium" | "high" | "critical";
  category: "respiratory" | "digestive" | "dermatology" | "musculoskeletal" | "parasite" | "allergy" | "behavioral" | "systemic";
  icon: string;
}

export interface HomeCareTip {
  icon: string;
  text: string;
}

export interface VetSuggestion {
  icon: string;
  text: string;
}

export interface AiScenario {
  id: string;
  matchKeywords: string[]; // match nếu symptoms CHỨA 1 keyword
  riskLevel: "low" | "medium" | "high" | "critical";
  riskLabel: string;
  riskMessage: string;
  diseases: DiseaseResult[];
  homeCare: HomeCareTip[];
  vetShould: VetSuggestion[];
  redFlags: string[]; // cảnh báo khẩn
  followUpIn: string;
}

export const AI_SCENARIOS: AiScenario[] = [
  // 1. Viêm đường hô hấp nhẹ (phổ biến nhất)
  {
    id: "respiratory-mild",
    matchKeywords: ["ho", "hắt hơi", "sổ mũi", "khó thở", "thở khò khè", "ho khan", "chảy nước mũi"],
    riskLevel: "medium",
    riskLabel: "Trung bình",
    riskMessage: "Nên theo dõi thêm và tham khảo ý kiến bác sĩ thú y trong 1–2 ngày tới nếu triệu chứng không thuyên giảm.",
    diseases: [
      { name: "Viêm đường hô hấp trên nhẹ", pct: 58, severity: "medium", category: "respiratory", icon: "🤧" },
      { name: "Dị ứng theo mùa", pct: 22, severity: "low", category: "allergy", icon: "🌸" },
      { name: "Mệt mỏi do thời tiết", pct: 12, severity: "low", category: "systemic", icon: "😴" },
      { name: "Viêm phế quản nhẹ", pct: 8, severity: "medium", category: "respiratory", icon: "💨" },
    ],
    homeCare: [
      { icon: "💧", text: "Đảm bảo bé được uống đủ nước sạch mỗi ngày (30-50ml/kg)." },
      { icon: "🌬️", text: "Giữ phòng ngủ và ổ nằm sạch sẽ, tránh gió lùa trực tiếp." },
      { icon: "🌡️", text: "Theo dõi nhiệt độ cơ thể, bình thường 38-39°C ở chó, 38-39.5°C ở mèo." },
      { icon: "🍲", text: "Cho ăn thức ăn mềm, ấm, dễ tiêu hóa trong 1-2 ngày." },
    ],
    vetShould: [
      { icon: "🩺", text: "Khám tổng quát và nghe phổi trong vòng 24-48 giờ." },
      { icon: "💉", text: "Có thể cần vaccine cúm hoặc thuốc kháng sinh nhẹ." },
    ],
    redFlags: [
      "Khó thở dữ dội, thở há miệng kéo dài",
      "Sốt trên 40°C kéo dài quá 24 giờ",
      "Bỏ ăn hoàn toàn quá 1 ngày",
      "Niêm mạc lợi nhợt nhạt hoặc tím tái",
    ],
    followUpIn: "24-48 giờ",
  },

  // 2. Rối loạn tiêu hóa
  {
    id: "digestive",
    matchKeywords: ["tiêu chảy", "nôn", "ói", "bỏ ăn", "phân lỏng", "đau bụng", "chướng bụng", "biếng ăn"],
    riskLevel: "medium",
    riskLabel: "Trung bình",
    riskMessage: "Hệ tiêu hóa có dấu hiệu bất thường. Nên bổ sung nước & men vi sinh, theo dõi sát.",
    diseases: [
      { name: "Rối loạn tiêu hóa do thức ăn", pct: 52, severity: "medium", category: "digestive", icon: "🍽️" },
      { name: "Viêm dạ dày ruột cấp", pct: 28, severity: "medium", category: "digestive", icon: "🦠" },
      { name: "Nhiễm giun sán", pct: 12, severity: "low", category: "parasite", icon: "🪱" },
      { name: "Dị ứng thức ăn", pct: 8, severity: "low", category: "allergy", icon: "🥛" },
    ],
    homeCare: [
      { icon: "💧", text: "Cho uống nước đun sôi để nguội thường xuyên, chia nhỏ nhiều lần." },
      { icon: "🫙", text: "Nhịn ăn 12-24 giờ (không áp dụng cho chó con/mèo con dưới 6 tháng)." },
      { icon: "💊", text: "Bổ sung men vi sinh dành riêng cho thú cưng (Probiotic)." },
      { icon: "🍗", text: "Sau nhịn ăn, cho ăn thức ăn nhạt (ức gà luộc + cơm trắng) trong 2-3 ngày." },
    ],
    vetShould: [
      { icon: "🧪", text: "Xét nghiệm phân để loại trừ ký sinh trùng." },
      { icon: "💧", text: "Có thể truyền dịch nếu mất nước nặng." },
    ],
    redFlags: [
      "Nôn ra máu hoặc phân có máu",
      "Tiêu chảy không cầm sau 24 giờ",
      "Bụng chướng cứng, đau khi sờ",
      "Mất nước nặng (da mất đàn hồi, mắt trũng)",
    ],
    followUpIn: "12-24 giờ",
  },

  // 3. Bệnh da liễu / rụng lông
  {
    id: "dermatology",
    matchKeywords: ["rụng lông", "ngứa", "gãi", "rụt", "ghẻ", "vảy", "đỏ da", "mụn", "phát ban", "lông xơ"],
    riskLevel: "low",
    riskLabel: "Nhẹ",
    riskMessage: "Triệu chứng da liễu thường do dị ứng hoặc ký sinh trùng ngoài da. Cần xử lý sớm để tránh viêm nhiễm.",
    diseases: [
      { name: "Viêm da dị ứng (Atopic Dermatitis)", pct: 45, severity: "medium", category: "dermatology", icon: "🌿" },
      { name: "Nhiễm ve/bọ chét", pct: 30, severity: "medium", category: "parasite", icon: "🦟" },
      { name: "Nhiễm trùng nấm (Ringworm)", pct: 15, severity: "medium", category: "dermatology", icon: "🍄" },
      { name: "Ghẻ demodicosis", pct: 10, severity: "high", category: "parasite", icon: "🪲" },
    ],
    homeCare: [
      { icon: "🛁", text: "Tắm bằng dầu tắm y khoa (chlorhexidine 2-4%) 1-2 lần/tuần." },
      { icon: "🧴", text: "Không dùng dầu tắm của người cho thú cưng." },
      { icon: "🧹", text: "Vệ sinh ổ nằm, thảm, đồ chơi bằng nước nóng." },
      { icon: "⛑️", text: "Đeo loa chống liếm nếu bé gãi/liếm quá nhiều." },
    ],
    vetShould: [
      { icon: "🔬", text: "Soi tươi da & lông dưới kính hiển vi để xác định nguyên nhân." },
      { icon: "💉", text: "Tiêm thuốc hoặc kê thuốc bôi đặc trị theo chẩn đoán." },
    ],
    redFlags: [
      "Vết loét lan rộng, có mủ hoặc chảy dịch",
      "Sốt kèm theo (có thể là biến chứng nhiễm trùng)",
      "Bé bỏ ăn, uể oải kéo dài",
    ],
    followUpIn: "3-5 ngày",
  },

  // 4. Vấn đề xương khớp
  {
    id: "musculoskeletal",
    matchKeywords: ["đau chân", "đi khập khiễng", "khó đứng", "đau khớp", "không nhảy", "kêu đau", "sưng chân", "ngã"],
    riskLevel: "medium",
    riskLabel: "Trung bình",
    riskMessage: "Có dấu hiệu tổn thương cơ xương khớp. Hạn chế vận động mạnh, cần khám để chụp chiếu.",
    diseases: [
      { name: "Bong gân / căng cơ nhẹ", pct: 42, severity: "low", category: "musculoskeletal", icon: "🦴" },
      { name: "Viêm khớp (đặc biệt ở giống lớn)", pct: 30, severity: "medium", category: "musculoskeletal", icon: "🦴" },
      { name: "Trật khớp / gãy xương", pct: 18, severity: "high", category: "musculoskeletal", icon: "🩹" },
      { name: "Đĩa đệm cột sống (IVDD)", pct: 10, severity: "critical", category: "musculoskeletal", icon: "⚠️" },
    ],
    homeCare: [
      { icon: "🛏️", text: "Hạn chế vận động mạnh, cho nằm nghỉ ở nơi mềm mại." },
      { icon: "🧊", text: "Chườm lạnh 10-15 phút/lần trong 24 giờ đầu (lót khăn)." },
      { icon: "🚫", text: "Không cho leo cầu thang, nhảy lên xuống sofa." },
      { icon: "⚖️", text: "Kiểm soát cân nặng để giảm áp lực khớp." },
    ],
    vetShould: [
      { icon: "🩻", text: "Chụp X-quang hoặc MRI nếu nghi ngờ gãy xương / tổn thương cột sống." },
      { icon: "💊", text: "Thuốc kháng viêm giảm đau theo toa (KHÔNG tự ý cho thuốc người)." },
    ],
    redFlags: [
      "Liệt 2 chân sau (cấp cứu - nghi IVDD)",
      "Không chịu đặt chân xuống đất sau 24 giờ",
      "Chỗ sưng nóng đỏ, có dịch",
    ],
    followUpIn: "12-24 giờ (khẩn nếu liệt)",
  },

  // 5. Stress / Hành vi
  {
    id: "behavioral",
    matchKeywords: ["sợ", "lo lắng", "trầm cảm", "cắn", "cào", "phá", "kêu nhiều", "run rẩy", "không chịu ăn"],
    riskLevel: "low",
    riskLabel: "Nhẹ",
    riskMessage: "Bé có dấu hiệu stress hoặc thay đổi hành vi. Cần đánh giá môi trường sống và xây dựng lại thói quen.",
    diseases: [
      { name: "Lo lắng do thay đổi môi trường", pct: 48, severity: "low", category: "behavioral", icon: "😰" },
      { name: "Stress do chia ly (Separation Anxiety)", pct: 28, severity: "low", category: "behavioral", icon: "😢" },
      { name: "Đau mạn tính ẩn (gây cáu)", pct: 16, severity: "medium", category: "systemic", icon: "🤕" },
      { name: "Rối loạn ám ảnh cưỡng chế (OCD)", pct: 8, severity: "medium", category: "behavioral", icon: "🔁" },
    ],
    homeCare: [
      { icon: "🧸", text: "Tạo không gian an toàn, yên tĩnh cho bé." },
      { icon: "🎵", text: "Bật nhạc nhẹ hoặc âm thanh thiên nhiên giúp thư giãn." },
      { icon: "🕹️", text: "Tăng thời gian chơi, vận động và tương tác mỗi ngày." },
      { icon: "🌿", text: "Dùng pheromone (Feliway cho mèo, Adaptil cho chó) xịt ổ nằm." },
    ],
    vetShould: [
      { icon: "💬", text: "Tư vấn hành vi với bác sĩ thú y chuyên về hành vi." },
      { icon: "🧠", text: "Đánh giá để loại trừ đau mạn tính ẩn gây cáu bẳn." },
    ],
    redFlags: [
      "Tự cắn xé gây thương tích",
      "Bỏ ăn hoàn toàn quá 48 giờ",
      "Hành vi hung hăng bất thường với chủ",
    ],
    followUpIn: "1-2 tuần",
  },

  // 6. Ngộ độc (CRITICAL)
  {
    id: "poisoning",
    matchKeywords: ["ngộ độc", "ăn phải", "nôn ra máu", "co giật", "ngất", "sùi bọt mép", "lờ đờ", "mất ý thức"],
    riskLevel: "critical",
    riskLabel: "Khẩn cấp",
    riskMessage: "⚠️ Đây là tình huống khẩn cấp. Đưa bé đến phòng khám thú y hoặc bệnh viện NGAY LẬP TỨC.",
    diseases: [
      { name: "Ngộ độc thức ăn / hóa chất", pct: 65, severity: "critical", category: "systemic", icon: "☠️" },
      { name: "Ngộ độc thuốc (chống trùng loài)", pct: 22, severity: "critical", category: "systemic", icon: "💊" },
      { name: "Sốc phản vệ (dị ứng nặng)", pct: 13, severity: "critical", category: "allergy", icon: "🚨" },
    ],
    homeCare: [
      { icon: "📞", text: "Gọi ngay đường dây khẩn cấp thú y: 1900 1234 56." },
      { icon: "🚗", text: "Đưa đến phòng khám gần nhất trong vòng 30 phút." },
      { icon: "📦", text: "Mang theo bao bì chất bé ăn phải (nếu có) cho bác sĩ xử lý." },
      { icon: "🚫", text: "TUYỆT ĐỐI không tự ý gây nôn nếu không có chỉ định bác sĩ." },
    ],
    vetShould: [
      { icon: "🏥", text: "Khám khẩn cấp + truyền dịch thanh lọc." },
      { icon: "💉", text: "Thuốc giải độc đặc hiệu theo từng loại chất." },
    ],
    redFlags: [
      "Co giật, mất ý thức (CẤP CỨU NGAY)",
      "Sùi bọt mép, khó thở nặng",
      "Niêm mạc tím tái, lạnh",
      "Bất kỳ dấu hiệu nào ăn phải thuốc diệt chuột / socola / hành / tỏi",
    ],
    followUpIn: "NGAY LẬP TỨC",
  },

  // 7. Nhiễm ký sinh trùng máu (nguy hiểm)
  {
    id: "blood-parasite",
    matchKeywords: ["sốt cao", "vàng da", "nước tiểu vàng", "lờ đờ kéo dài", "niêm mạc nhợt"],
    riskLevel: "high",
    riskLabel: "Cao",
    riskMessage: "Có dấu hiệu nghi ngờ nhiễm ký sinh trùng máu. Cần xét nghiệm máu và điều trị càng sớm càng tốt.",
    diseases: [
      { name: "Ehrlichiosis / Babesia (ve truyền)", pct: 48, severity: "high", category: "parasite", icon: "🦠" },
      { name: "Leptospirosis", pct: 25, severity: "high", category: "parasite", icon: "🌀" },
      { name: "Viêm gan truyền nhiễm (CIV)", pct: 17, severity: "high", category: "systemic", icon: "🫁" },
      { name: "Sốt không rõ nguyên nhân", pct: 10, severity: "medium", category: "systemic", icon: "🤒" },
    ],
    homeCare: [
      { icon: "📞", text: "Đặt lịch khám trong ngày - KHÔNG nên chờ đợi." },
      { icon: "💧", text: "Cho uống nhiều nước, tránh vận động mạnh." },
      { icon: "🦟", text: "Kiểm tra & loại bỏ ve bám trên cơ thể bé ngay (dùng nhíp chuyên dụng)." },
      { icon: "🛡️", text: "Không tắm ngay sau khi phát hiện ve - đợi 24 giờ." },
    ],
    vetShould: [
      { icon: "🧪", text: "Xét nghiệm máu (CBC + PCR 4 mùa) trong ngày." },
      { icon: "💉", text: "Kháng sinh đặc trị + truyền dịch hỗ trợ." },
    ],
    redFlags: [
      "Sốt trên 40.5°C không hạ sau 24 giờ",
      "Vàng da / niêm mạc vàng rõ rệt",
      "Tiểu ra máu hoặc nước tiểu sẫm màu",
    ],
    followUpIn: "6-12 giờ",
  },

  // 8. Sốt / viêm hệ thống
  {
    id: "fever",
    matchKeywords: ["sốt", "nóng", "mệt", "uể oải", "ốm", "nằm một chỗ"],
    riskLevel: "medium",
    riskLabel: "Trung bình",
    riskMessage: "Bé có dấu hiệu sốt và mệt mỏi. Cần đo nhiệt độ và theo dõi sát các triệu chứng đi kèm.",
    diseases: [
      { name: "Nhiễm trùng toàn thân (Sepsis sớm)", pct: 35, severity: "high", category: "systemic", icon: "🦠" },
      { name: "Viêm phổi / viêm phế quản", pct: 32, severity: "medium", category: "respiratory", icon: "🫁" },
      { name: "Sốt do virus (Parvo/Care)", pct: 18, severity: "high", category: "systemic", icon: "🧬" },
      { name: "Stress nhiệt / say nắng", pct: 15, severity: "medium", category: "systemic", icon: "☀️" },
    ],
    homeCare: [
      { icon: "🌡️", text: "Đo nhiệt độ hậu môn: bình thường chó 38-39°C, mèo 38-39.5°C." },
      { icon: "❄️", text: "Nếu sốt trên 40°C: lau mát bằng khăn ẩm vùng bẹn, nách, gan bàn chân." },
      { icon: "💧", text: "Khuyến khích uống nước - dùng ống tiêm không kim nếu cần." },
      { icon: "🛏️", text: "Cho nằm nơi thoáng mát, yên tĩnh." },
    ],
    vetShould: [
      { icon: "🩺", text: "Khám lâm sàng + xét nghiệm máu & nước tiểu." },
      { icon: "💊", text: "Xác định nguyên nhân để kê đúng kháng sinh (nếu nhiễm trùng)." },
    ],
    redFlags: [
      "Sốt trên 40.5°C kéo dài quá 24 giờ",
      "Co giật, mất ý thức",
      "Nôn ra máu / tiêu chảy ra máu",
    ],
    followUpIn: "12-24 giờ",
  },

  // 9. Vấn đề mắt
  {
    id: "eye",
    matchKeywords: ["chảy nước mắt", "mắt đỏ", "ghèn mắt", "dụi mắt", "đục", "sưng mắt"],
    riskLevel: "low",
    riskLabel: "Nhẹ - Trung bình",
    riskMessage: "Các vấn đề về mắt cần xử lý sớm để tránh ảnh hưởng thị lực lâu dài.",
    diseases: [
      { name: "Viêm kết mạc (do bụi/dị ứng)", pct: 55, severity: "low", category: "dermatology", icon: "👁️" },
      { name: "Loét giác mạc", pct: 22, severity: "high", category: "dermatology", icon: "🚨" },
      { name: "Khô mắt (KCS)", pct: 13, severity: "medium", category: "dermatology", icon: "💧" },
      { name: "Glaucoma / tăng nhãn áp", pct: 10, severity: "critical", category: "dermatology", icon: "⚠️" },
    ],
    homeCare: [
      { icon: "🧼", text: "Lau ghèn mắt bằng gạc ẩm với nước muối sinh lý NaCl 0.9%." },
      { icon: "🚫", text: "Không tự ý nhỏ thuốc nhỏ mắt của người." },
      { icon: "⛑️", text: "Đeo loa chống cào cấu vùng đầu/mắt." },
      { icon: "🏠", text: "Tránh để bé ra gió bụi, nắng gắt." },
    ],
    vetShould: [
      { icon: "🔬", text: "Khám mắt chuyên sâu + đo nhãn áp." },
      { icon: "💧", text: "Nhỏ thuốc kháng sinh / kháng viêm theo toa." },
    ],
    redFlags: [
      "Mắt đục, phồng, hoặc lồi ra",
      "Bé không mở mắt / cực kỳ đau",
      "Mủ xanh / vàng chảy nhiều",
    ],
    followUpIn: "12-24 giờ",
  },

  // 10. Vấn đề răng miệng
  {
    id: "dental",
    matchKeywords: ["hôi miệng", "răng", "nướu", "khó ăn", "rơi nước miếng", "răng ố", "viêm lợi"],
    riskLevel: "low",
    riskLabel: "Nhẹ",
    riskMessage: "Vấn đề răng miệng ở thú cưng phổ biến hơn bạn nghĩ. Nên lấy cao răng định kỳ.",
    diseases: [
      { name: "Viêm nha chu (Periodontitis)", pct: 60, severity: "medium", category: "dermatology", icon: "🦷" },
      { name: "Cao răng tích tụ", pct: 22, severity: "low", category: "dermatology", icon: "😬" },
      { name: "Gãy / sâu răng", pct: 12, severity: "medium", category: "dermatology", icon: "🦴" },
      { name: "Khối u vòm miệng", pct: 6, severity: "critical", category: "systemic", icon: "🚨" },
    ],
    homeCare: [
      { icon: "🪥", text: "Đánh răng cho bé 2-3 lần/tuần bằng kem đánh răng chuyên cho thú." },
      { icon: "🦴", text: "Cho gặm đồ chơi / xương gặm nha khoa chuyên dụng." },
      { icon: "🍖", text: "Hạn chế thức ăn mềm ướt, ưu tiên hạt khô giúp làm sạch răng." },
      { icon: "👃", text: "Khám ngay nếu hôi miệng đột ngột kèm bỏ ăn." },
    ],
    vetShould: [
      { icon: "🛠️", text: "Lấy cao răng chuyên nghiệp dưới gây mê." },
      { icon: "🦷", text: "Nhổ răng sâu / điều trị tủy nếu cần." },
    ],
    redFlags: [
      "Chảy máu nướu không cầm",
      "Khối u sưng trong miệng",
      "Bỏ ăn hoàn toàn + sụt cân nhanh",
    ],
    followUpIn: "1-2 tuần",
  },
];

/**
 * Tìm kịch bản phù hợp với triệu chứng người dùng mô tả.
 * Trả về scenario đầu tiên có keyword xuất hiện trong symptoms.
 * Nếu không match gì, trả về scenario "respiratory-mild" làm fallback phổ biến nhất.
 */
export const findScenarioBySymptoms = (symptoms: string): AiScenario => {
  const lower = symptoms.toLowerCase().trim();
  if (!lower) return AI_SCENARIOS[0];

  for (const s of AI_SCENARIOS) {
    if (s.matchKeywords.some(kw => lower.includes(kw.toLowerCase()))) {
      return s;
    }
  }
  return AI_SCENARIOS[0];
};

export const getScenarioById = (id: string): AiScenario => {
  return AI_SCENARIOS.find(s => s.id === id) ?? AI_SCENARIOS[0];
};