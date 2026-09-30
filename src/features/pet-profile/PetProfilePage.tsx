import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Tabs from "@/components/ui/Tabs";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import PetInfoTab from "./components/PetInfoTab";
import AppointmentList from "@/features/appointment/components/AppointmentList";
import { getUserFirstPet } from "@/data/mock/pet";
import { useAuth } from "@/features/auth/hooks/useAuth";
import Sparkline from "@/components/charts/Sparkline";

const MOOD_EMOJI: Record<string, string> = {
  happy: "😊", sleepy: "😴", playful: "🥳", hungry: "🍽️", shy: "😳",
};
const MOOD_LABEL: Record<string, string> = {
  happy: "Vui vẻ", sleepy: "Buồn ngủ", playful: "Tinh nghịch", hungry: "Đói bụng", shy: "Rụt rè",
};

const PetProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("info");
  const { user } = useAuth();
  const navigate = useNavigate();
  const pet = useMemo(() => getUserFirstPet(user) ?? getUserFirstPet({ name: "Yến Nhi" })!, [user]);

  const tabs = [
    { id: "info", label: "Thông tin cơ bản" },
    { id: "health", label: "Hồ sơ y tế" },
    { id: "weight", label: "Nhật ký cân nặng" },
  ];

  const healthStats = [
    { label: "Sức khỏe tổng thể", value: `${pet.healthScore}/100`, color: "from-emerald-400 to-teal-500", icon: "💚" },
    { label: "Cân nặng", value: `${pet.weight} kg`, color: "from-rose-400 to-pink-500", icon: "⚖️" },
    { label: "Chiều cao", value: `${pet.height} cm`, color: "from-violet-400 to-purple-500", icon: "📏" },
    { label: "Sở thích", value: `${pet.hobbies.length} mục`, color: "from-amber-400 to-orange-500", icon: "⭐" },
  ];

  const weightHistory = [
    { d: "Hôm nay", w: 8.5 },
    { d: "1 tháng trước", w: 8.4 },
    { d: "3 tháng trước", w: 8.1 },
    { d: "6 tháng trước", w: 7.8 },
    { d: "9 tháng trước", w: 7.5 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader />

      {/* Pet Hero */}
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
            className={`w-40 h-40 md:w-48 md:h-48 rounded-3xl bg-gradient-to-br ${pet.avatarBg} flex items-center justify-center text-8xl md:text-9xl shadow-2xl mood-halo`}
          >
            {pet.emoji}
          </motion.div>

          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur text-xs font-extrabold text-primary mb-2">
              🐾 Hồ sơ thú cưng
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-darkbg tracking-tight">
              {pet.name} <span className="text-2xl md:text-3xl">{MOOD_EMOJI[pet.mood]}</span>
            </h1>
            <p className="text-gray-600 mt-2 font-medium">
              {pet.breed} • {pet.age} • {pet.color}
            </p>
            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
              <Badge variant="success">✓ {MOOD_LABEL[pet.mood]}</Badge>
              <Badge variant="info">🎂 {pet.birthday}</Badge>
              <Badge variant="warning">⏰ Vaccine: {pet.nextVaccine}</Badge>
            </div>
            <div className="text-xs text-muted mt-3 font-mono">
              🆔 Microchip: <span className="font-bold">{pet.microchip}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stat cards row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {healthStats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Card className="p-5 relative overflow-hidden hover-lift shine-effect">
              <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-30 blur-2xl bg-gradient-to-br ${s.color}`} />
              <div className="flex justify-between items-start mb-2 relative z-10">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">{s.label}</span>
                <span className="text-2xl">{s.icon}</span>
              </div>
              <div className="text-2xl font-extrabold text-darkbg relative z-10">{s.value}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="p-6">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === "info" && <PetInfoTab />}

            {activeTab === "health" && (
              <div className="space-y-5">
                <h3 className="font-extrabold text-base text-darkbg mb-4">Lịch sử bệnh án & khám điều trị</h3>
                <div className="border border-gray-100 rounded-2xl divide-y divide-gray-100 overflow-hidden">
                  {[
                    { d: "10/01/2026", t: "Khám định kỳ & Tẩy giun", doctor: "BS. Nguyễn Văn A", status: "Hoàn thành" },
                    { d: "22/11/2025", t: "Điều trị viêm tai ngoài nhẹ", doctor: "BS. Trần Thị B", status: "Hoàn thành" },
                    { d: "15/08/2025", t: "Tiêm vaccine 5 trong 1", doctor: "BS. Lê Văn C", status: "Hoàn thành" },
                  ].map((h, i) => (
                    <div key={i} className="flex justify-between items-center p-4 hover:bg-gray-50/50 transition-colors">
                      <div>
                        <div className="font-bold text-sm text-darkbg">{h.t}</div>
                        <div className="text-xs text-muted mt-1">{h.doctor} • {h.d}</div>
                      </div>
                      <Badge variant="success">{h.status}</Badge>
                    </div>
                  ))}
                </div>

                {/* Lịch hẹn của bé */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-extrabold text-base text-darkbg flex items-center gap-2">
                      📅 Lịch hẹn sắp tới & đã qua
                    </h3>
                    <Button
                      variant="outline"
                      className="text-xs"
                      onClick={() => navigate("/dashboard/appointments")}
                    >
                      Xem tất cả →
                    </Button>
                  </div>
                  <AppointmentList limit={3} petId={pet.name} />
                </div>
              </div>
            )}

            {activeTab === "weight" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-darkbg">Lịch sử theo dõi cân nặng</h3>
                  <Badge variant="info">📈 +1.0 kg / năm</Badge>
                </div>
                <Card className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 border-rose-100">
                  <Sparkline data={weightHistory.map(w => w.w).reverse()} width={300} height={48} stroke="#F05A7E" fill="rgba(240,90,126,0.2)" />
                </Card>
                <div className="border border-gray-100 rounded-2xl divide-y divide-gray-100 overflow-hidden">
                  {weightHistory.map((w, i) => (
                    <div key={i} className="flex justify-between items-center p-4 hover:bg-gray-50/50 transition-colors">
                      <span className="font-semibold text-sm text-darkbg">{w.d}</span>
                      <span className="font-extrabold text-sm text-primary">{w.w} kg</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h3 className="font-extrabold text-base text-darkbg mb-4 flex items-center gap-2">
              ⭐ Sở thích
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
          </Card>

          <Card className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100">
            <h3 className="font-extrabold text-base text-darkbg mb-3 flex items-center gap-2">
              📝 Ghi chú của bạn
            </h3>
            <p className="text-sm text-violet-900 leading-relaxed">{pet.notes}</p>
            <div className="mt-4 text-xs text-violet-700 font-bold">
              🏠 Đồng hành cùng bạn từ {pet.ownerSince}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PetProfilePage;