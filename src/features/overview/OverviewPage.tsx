import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { getUserFirstPet } from "@/data/mock/pet";
import Sparkline from "@/components/charts/Sparkline";

const MOOD_EMOJI: Record<string, string> = {
  happy: "😊",
  sleepy: "😴",
  playful: "🥳",
  hungry: "🍽️",
  shy: "😳",
};

const MOOD_LABEL: Record<string, string> = {
  happy: "Vui vẻ",
  sleepy: "Buồn ngủ",
  playful: "Tinh nghịch",
  hungry: "Đói bụng",
  shy: "Rụt rè",
};

const getGreeting = (): string => {
  const h = new Date().getHours();
  if (h < 11) return "Chào buổi sáng";
  if (h < 14) return "Chào buổi trưa";
  if (h < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
};

const HealthRing: React.FC<{ score: number; size?: number }> = ({ score, size = 120 }) => {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color =
    score >= 90 ? "url(#healthGradA)" : score >= 75 ? "url(#healthGradB)" : "url(#healthGradC)";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="healthGradA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>
        <linearGradient id="healthGradB" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
        <linearGradient id="healthGradC" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F43F5E" />
          <stop offset="100%" stopColor="#FB7185" />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#F1F5F9" strokeWidth={stroke} fill="none" />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <text x="50%" y="46%" textAnchor="middle" fontSize="28" fontWeight="800" fill="#0F172A">
        {score}
      </text>
      <text x="50%" y="62%" textAnchor="middle" fontSize="10" fontWeight="600" fill="#94A3B8">
        /100
      </text>
    </svg>
  );
};

const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  // Pet theo user hiện tại. Không fallback "Yến Nhi" — nếu user chưa có pet thì hiện một pet mặc định cho an toàn.
  const pet = useMemo(() => getUserFirstPet(user) ?? getUserFirstPet({ name: "Yến Nhi" })!, [user]);

  const handleConfirmMeds = () => {
    showToast(`Đã xác nhận cho ${pet.name} uống thuốc thành công! 🐾`, "success");
  };

  const stats = [
    { label: "Khám sức khỏe", value: "12", suffix: "lần", color: "from-rose-400 to-pink-500", icon: "🩺", sparkline: [3, 4, 5, 6, 8, 9, 10, 11, 12] },
    { label: "Vaccine đã tiêm", value: "8", suffix: "mũi", color: "from-amber-400 to-orange-500", icon: "💉", sparkline: [2, 3, 4, 5, 6, 7, 7, 8, 8] },
    { label: "Cân nặng", value: pet.weight.toString(), suffix: "kg", color: "from-emerald-400 to-teal-500", icon: "⚖️", sparkline: [7.8, 8.0, 8.1, 8.2, 8.3, 8.4, 8.5, 8.5, 8.5] },
    { label: "Hoạt động", value: "47", suffix: "giờ", color: "from-blue-400 to-indigo-500", icon: "🏃", sparkline: [25, 30, 35, 38, 40, 43, 45, 46, 47] },
  ];

  const activities = [
    { icon: "🩺", bg: "bg-rose-50", color: "text-primary", title: `Kiểm tra sức khỏe AI – ${pet.name}`, sub: "Phân tích triệu chứng rụng lông nhẹ • 3 ngày trước" },
    { icon: "⚖️", bg: "bg-emerald-50", color: "text-emerald-500", title: "Đã cập nhật cân nặng mới", sub: `Cân nặng mới của ${pet.name}: ${pet.weight}kg • 1 tuần trước` },
    { icon: "💉", bg: "bg-amber-50", color: "text-warning", title: "Đã tiêm Vaccine 5 trong 1", sub: "Tiêm phòng đầy đủ tại trạm thú y quận • 15/01/2026" },
  ];

  const quests = [
    { emoji: "🍽️", label: "Cho ăn 2 bữa", done: true },
    { emoji: "🚶", label: "Đi dạo 30 phút", done: true },
    { emoji: "💊", label: "Cho uống thuốc 18:00", done: false },
    { emoji: "🎾", label: "Chơi với pet 15 phút", done: false },
  ];

  const completedQuests = quests.filter(q => q.done).length;
  const questProgress = (completedQuests / quests.length) * 100;

  return (
    <div className="space-y-6">
      <PageHeader />

      {/* Pet Hero Card - full width gradient */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pet-hero-card relative overflow-hidden p-8 md:p-10 bg-gradient-to-br from-rose-100 via-pink-50 to-violet-50"
      >
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-gradient-to-br from-violet-400/20 to-transparent rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={`w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-br ${pet.avatarBg} flex items-center justify-center text-7xl md:text-8xl shadow-2xl mood-halo`}
          >
            {pet.emoji}
          </motion.div>

          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur text-xs font-extrabold text-primary mb-3">
              {getGreeting()}, {user?.name ?? "bạn"} 👋
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-darkbg tracking-tight">
              {pet.name} đang <span className="text-gradient">{MOOD_LABEL[pet.mood]}</span> ✨
            </h2>
            <p className="text-gray-600 mt-2 font-medium">
              {pet.breed} • {pet.age} • {pet.weight}kg • {MOOD_EMOJI[pet.mood]}
            </p>
            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
              <Badge variant="success">✓ Sức khỏe tốt</Badge>
              <Badge variant="warning">⏰ Vaccine sắp đến hạn</Badge>
              <Badge variant="info">🎂 Sinh nhật {pet.birthday}</Badge>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <HealthRing score={pet.healthScore} />
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Sức khỏe tổng thể</span>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Card className="p-5 relative overflow-hidden border border-gray-100 hover-lift cursor-pointer shine-effect">
              <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-30 bg-gradient-to-br ${s.color}`} />
              <div className="flex justify-between items-start mb-3 relative z-10">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">{s.label}</span>
                <span className="text-2xl">{s.icon}</span>
              </div>
              <div className="flex items-baseline gap-1 relative z-10 mb-2">
                <span className="text-3xl font-extrabold text-darkbg">{s.value}</span>
                <span className="text-xs text-muted font-semibold">{s.suffix}</span>
              </div>
              <div className="relative z-10">
                <Sparkline data={s.sparkline} width={140} height={28} stroke="#F05A7E" fill="rgba(240,90,126,0.15)" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Quests */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
            <Card className="p-6 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-emerald-200/30 to-transparent rounded-full blur-2xl" />
              <div className="flex items-center justify-between mb-5 relative z-10">
                <div>
                  <h3 className="font-extrabold text-base text-darkbg flex items-center gap-2">
                    🎯 Nhiệm vụ hôm nay
                  </h3>
                  <p className="text-xs text-muted font-semibold mt-1">
                    Hoàn thành {completedQuests}/{quests.length} nhiệm vụ
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-gradient">{Math.round(questProgress)}%</div>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4 relative z-10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${questProgress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                />
              </div>
              <ul className="space-y-2.5 relative z-10">
                {quests.map((q, i) => (
                  <motion.li
                    key={q.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${
                      q.done ? "bg-emerald-50/60" : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <button
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all ${
                        q.done ? "bg-emerald-500 border-emerald-500 text-white" : "border-gray-300 hover:border-emerald-400"
                      }`}
                      onClick={() => !q.done && handleConfirmMeds()}
                      aria-label={q.done ? "Đã hoàn thành" : "Đánh dấu hoàn thành"}
                    >
                      {q.done && "✓"}
                    </button>
                    <span className="text-2xl">{q.emoji}</span>
                    <span className={`text-sm font-semibold ${q.done ? "text-muted line-through" : "text-darkbg"}`}>
                      {q.label}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </Card>
          </motion.div>

          {/* Appt + Vax row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
              <Card className="p-6 flex flex-col justify-between h-52 hover-lift cursor-pointer relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/10 blur-2xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3 text-primary font-bold text-sm">
                    <Icon n="cal" size={16} /> Lịch hẹn sắp tới
                  </div>
                  <div className="text-xs text-muted mb-1">Khám tổng quát sức khỏe</div>
                  <div className="font-bold text-base text-darkbg">BS. Nguyễn Văn A</div>
                  <div className="text-primary font-bold text-xs mt-1">Ngày mai – 09:00 sáng</div>
                </div>
                <Button variant="outline" className="w-full text-xs relative z-10" onClick={() => navigate("/dashboard/appt")}>
                  Xem chi tiết
                </Button>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
              <Card className="p-6 flex flex-col justify-between h-52 hover-lift cursor-pointer relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-amber-400/10 blur-2xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3 text-warning font-bold text-sm">
                    <Icon n="vax" size={16} /> Tiêm chủng sắp tới
                  </div>
                  <div className="text-xs text-muted mb-1">Mũi tiêm phòng bệnh dại</div>
                  <div className="font-bold text-base text-darkbg">Vaccine Dại</div>
                  <div className="text-warning font-bold text-xs mt-1">20/06/2026 – 10:00 sáng</div>
                </div>
                <Button variant="outline" className="w-full text-xs relative z-10" onClick={() => navigate("/dashboard/vax")}>
                  Xem chi tiết
                </Button>
              </Card>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.6 }}>
            <Card className="p-6">
              <div className="flex justify-between items-center mb-5">
                <span className="font-extrabold text-base text-darkbg">Hoạt động gần đây</span>
                <button className="text-sm text-primary font-bold hover:underline cursor-pointer outline-none">Tất cả</button>
              </div>
              <div className="divide-y divide-gray-100">
                {activities.map((a, i) => (
                  <div key={i} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0 hover:bg-gray-50/50 -mx-2 px-2 rounded-lg transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${a.bg} ${a.color}`}>
                      {a.icon}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-darkbg">{a.title}</div>
                      <div className="text-xs text-muted mt-1 font-medium">{a.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's suggestion */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200 p-6 shadow-sm"
          >
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-amber-300/30 blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 font-extrabold text-sm text-amber-800 mb-3 select-none">
                <Icon n="star" size={16} className="text-amber-500" /> Gợi ý hôm nay
              </div>
              <div className="text-sm text-amber-900 leading-relaxed mb-5 font-medium">
                Hãy nhớ cho {pet.name} uống thuốc đúng giờ lúc 18:00 hôm nay nhé.
              </div>
              <Button variant="primary" className="w-full text-xs py-3" onClick={handleConfirmMeds}>
                Xác nhận đã uống
              </Button>
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="text-center mt-6 text-5xl drop-shadow-sm select-none"
              >
                {pet.emoji}
              </motion.div>
            </div>
          </motion.div>

          {/* Pet hobbies */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Card className="p-6">
              <h3 className="font-extrabold text-base text-darkbg mb-4 flex items-center gap-2">
                ⭐ Sở thích của {pet.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {pet.hobbies.map((h, i) => (
                  <motion.span
                    key={h}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06 }}
                    className="px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-100 to-pink-100 text-primary text-xs font-extrabold"
                  >
                    {h}
                  </motion.span>
                ))}
              </div>
              <div className="mt-5 p-3 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100">
                <div className="text-xs font-bold text-violet-700 mb-1">📝 Ghi chú</div>
                <div className="text-xs text-violet-900 leading-relaxed">{pet.notes}</div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;