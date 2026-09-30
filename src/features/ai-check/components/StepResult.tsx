import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/hooks/useToast";
import { findScenarioBySymptoms, DiseaseResult, AiScenario } from "@/data/mock/aiScenarios";
import { findPetByName, PetProfile } from "@/data/mock/pet";
import { DURATION_OPTIONS } from "../constants";
import { addAiHistory, makeAiHistoryId, AiHistoryRecord } from "@/utils/medicalHistory";

interface StepResultProps {
  petId: string | null;
  symptoms: string;
  selectedTags: string[];
  duration: string;
  photo: string | null;
  onReset: () => void;
}

const RISK_STYLES: Record<string, { bg: string; text: string; border: string; ring: string; icon: string; label: string }> = {
  low: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", ring: "ring-emerald-200", icon: "✓", label: "Nhẹ" },
  medium: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", ring: "ring-amber-200", icon: "⚠", label: "Trung bình" },
  high: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", ring: "ring-orange-200", icon: "🚨", label: "Cao" },
  critical: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", ring: "ring-rose-200", icon: "🚑", label: "Khẩn cấp" },
};

const CATEGORY_LABEL: Record<string, string> = {
  respiratory: "Hô hấp",
  digestive: "Tiêu hóa",
  dermatology: "Da liễu",
  musculoskeletal: "Xương khớp",
  parasite: "Ký sinh trùng",
  allergy: "Dị ứng",
  behavioral: "Hành vi",
  systemic: "Toàn thân",
};

const SEVERITY_VARIANT: Record<string, "success" | "warning" | "danger" | "info"> = {
  low: "success",
  medium: "warning",
  high: "danger",
  critical: "danger",
};

const SEVERITY_LABEL: Record<string, string> = {
  low: "Nhẹ",
  medium: "Trung bình",
  high: "Cao",
  critical: "Khẩn cấp",
};

const StepResult: React.FC<StepResultProps> = ({
  petId,
  symptoms,
  selectedTags,
  duration,
  photo,
  onReset,
}) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [saved, setSaved] = useState(false);
  const autoSavedRef = useRef(false);

  const pet: PetProfile | undefined = petId ? findPetByName(petId) : undefined;
  const scenario: AiScenario = useMemo(() => findScenarioBySymptoms(symptoms), [symptoms]);
  const risk = RISK_STYLES[scenario.riskLevel];
  const totalDiseases = scenario.diseases.length;
  const topDisease = [...scenario.diseases].sort((a, b) => b.pct - a.pct)[0];

  const durationLabel = DURATION_OPTIONS.find(d => d.id === duration)?.label;

  /**
   * Auto-save ngay khi StepResult mount (1 lần duy nhất).
   * Trước đây user phải bấm thủ công "📋 Lưu vào hồ sơ" → nhiều user bỏ qua → record không tồn tại.
   * Bây giờ: đến step 4 → tự lưu → user thấy toast "Đã lưu tự động" → có thể xem lịch sử ngay.
   * Nếu user đã thao tác Save thủ công trước đó (vd re-mount), bỏ qua.
   */
  useEffect(() => {
    if (autoSavedRef.current || saved) return;
    autoSavedRef.current = true;
    const record: AiHistoryRecord = {
      id: makeAiHistoryId(),
      petId,
      symptoms,
      tags: selectedTags,
      duration,
      scenarioId: scenario.id,
      riskLevel: scenario.riskLevel,
      topDisease: topDisease?.name,
      savedAt: new Date().toISOString(),
    };
    try {
      addAiHistory(record);
      setSaved(true);
      showToast(`Đã lưu tự động vào hồ sơ của ${petId ?? "thú cưng"}! 📋`, "success");
    } catch {
      showToast("Không thể tự lưu. Bấm 'Lưu vào hồ sơ' để thử lại.", "warning");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lưu kết quả vào localStorage (giả lập "lưu hồ sơ") — manual override
  const handleSave = () => {
    if (saved) {
      // Đã lưu rồi → chuyển thẳng tới trang lịch sử.
      navigate("/dashboard/ai-history");
      return;
    }
    const record: AiHistoryRecord = {
      id: makeAiHistoryId(),
      petId,
      symptoms,
      tags: selectedTags,
      duration,
      scenarioId: scenario.id,
      riskLevel: scenario.riskLevel,
      topDisease: topDisease?.name,
      savedAt: new Date().toISOString(),
    };
    try {
      addAiHistory(record);
      setSaved(true);
      showToast(`Đã lưu kết quả vào hồ sơ của ${petId ?? "thú cưng"}! 📋`, "success");
    } catch {
      showToast("Không thể lưu. Vui lòng thử lại.", "error");
    }
  };

  // Chia sẻ qua Web Share API / clipboard
  const handleShare = async () => {
    const text = `🐾 Kết quả AI Check - ${petId}\n📋 Triệu chứng: ${symptoms}\n🎯 Mức độ rủi ro: ${risk.label}\n🔍 Bệnh khả thi nhất: ${topDisease?.name} (${topDisease?.pct}%)\n💊 Hướng xử lý: ${scenario.homeCare[0]?.text}\n\n— VetGen AI`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Kết quả AI Check", text });
      } catch {
        // user cancelled
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      showToast("Đã copy kết quả vào clipboard!", "success");
    } else {
      showToast("Trình duyệt không hỗ trợ chia sẻ.", "info");
    }
  };

  // Đặt lịch khám với prefill context
  const handleBookAppt = () => {
    const params = new URLSearchParams({
      fromAI: "1",
      reason: scenario.id,
      pet: petId ?? "",
      notes: symptoms,
    });
    navigate(`/dashboard/appt?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${risk.bg} ${risk.text} ring-4 ${risk.ring} shadow-lg mb-4`}
        >
          <span className="text-4xl">{scenario.riskLevel === "critical" ? "🚑" : "🤖"}</span>
        </motion.div>
        <h2 className="font-extrabold text-2xl text-darkbg">
          Kết quả phân tích AI
        </h2>
        <div className="text-muted text-sm mt-2 max-w-md mx-auto space-y-1">
          {pet && (
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl">{pet.emoji}</span>
              <span><strong className="text-darkbg">{pet.name}</strong> • {pet.breed}</span>
            </div>
          )}
          <div className="text-xs">
            Triệu chứng: <em className="text-darkbg font-semibold">"{symptoms || "Triệu chứng mặc định"}"</em>
          </div>
          {durationLabel && (
            <div className="text-xs text-muted">
              ⏱️ Diễn biến: <strong className="text-darkbg">{durationLabel}</strong>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
          <Badge variant="info">📊 {totalDiseases} bệnh khả thi</Badge>
          <Badge variant={scenario.riskLevel === "low" ? "success" : scenario.riskLevel === "medium" ? "warning" : "danger"}>
            {risk.icon} Mức độ: {risk.label}
          </Badge>
          {photo && <Badge variant="info">📷 Có ảnh đính kèm</Badge>}
        </div>
      </motion.div>

      {/* Risk Alert */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`${risk.bg} border ${risk.border} rounded-2xl p-5 flex gap-3.5 items-start`}
      >
        <Icon n="warn" size={22} className={`${risk.text} mt-0.5 shrink-0`} />
        <div className="flex-1">
          <div className={`font-extrabold text-sm ${risk.text}`}>
            Mức độ rủi ro: {risk.label} {scenario.riskLevel === "critical" && "— GỌI CẤP CỨU NGAY"}
          </div>
          <div className={`text-xs leading-relaxed mt-1 font-medium ${risk.text}`}>
            {scenario.riskMessage}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs font-bold">
            <Icon n="clock" size={14} className={risk.text} />
            <span className={risk.text}>Theo dõi lại trong: {scenario.followUpIn}</span>
          </div>
        </div>
      </motion.div>

      {/* Disease Bars */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="p-6 space-y-4">
          <div className="font-extrabold text-base text-darkbg flex items-center gap-2">
            <Icon n="ai" size={18} className="text-primary" />
            Khả năng mắc các bệnh
            <Badge variant="info" className="ml-auto">📊 {totalDiseases} kết quả</Badge>
          </div>
          <div className="space-y-4">
            {scenario.diseases.map((d, i) => (
              <DiseaseBar key={d.name} disease={d} delay={i * 0.08} />
            ))}
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Home Care */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card className="p-6 space-y-4 h-full">
            <div className="font-extrabold text-base text-darkbg flex items-center gap-2">
              <Icon n="tick" size={18} className="text-emerald-500" /> Hướng xử lý tại nhà
            </div>
            <ul className="space-y-3">
              {scenario.homeCare.map((tip, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.08 }}
                  className="flex gap-3 items-start p-3 rounded-xl bg-emerald-50/40 border border-emerald-100"
                >
                  <span className="text-2xl shrink-0">{tip.icon}</span>
                  <span className="text-xs text-darkbg leading-relaxed font-semibold">{tip.text}</span>
                </motion.li>
              ))}
            </ul>
          </Card>
        </motion.div>

        {/* Vet Should */}
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card className="p-6 space-y-4 h-full">
            <div className="font-extrabold text-base text-darkbg flex items-center gap-2">
              <Icon n="vax" size={18} className="text-primary" /> Bác sĩ sẽ làm gì
            </div>
            <ul className="space-y-3">
              {scenario.vetShould.map((tip, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.08 }}
                  className="flex gap-3 items-start p-3 rounded-xl bg-rose-50/40 border border-rose-100"
                >
                  <span className="text-2xl shrink-0">{tip.icon}</span>
                  <span className="text-xs text-darkbg leading-relaxed font-semibold">{tip.text}</span>
                </motion.li>
              ))}
            </ul>
          </Card>
        </motion.div>
      </div>

      {/* Red Flags */}
      {scenario.redFlags.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card className="p-6 bg-gradient-to-br from-rose-50 to-red-50 border-rose-200 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-300/30 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="font-extrabold text-base text-rose-800 flex items-center gap-2 mb-4">
                <span className="text-2xl">🚨</span>
                Dấu hiệu cần cấp cứu NGAY
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {scenario.redFlags.map((flag, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + idx * 0.06 }}
                    className="flex gap-2 items-start p-2.5 rounded-xl bg-white/70 border border-rose-100"
                  >
                    <span className="text-rose-500 font-bold select-none shrink-0">⚠</span>
                    <span className="text-xs text-rose-900 leading-relaxed font-bold">{flag}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Photo attachment if any */}
      {photo && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          <Card className="p-4">
            <div className="text-[10px] font-extrabold text-muted uppercase tracking-wider mb-2">
              📷 Ảnh thú cưng đính kèm
            </div>
            <img src={photo} alt="Pet" className="rounded-xl max-h-48 mx-auto shadow-md" />
          </Card>
        </motion.div>
      )}

      {/* Saved confirmation banner */}
      {saved && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 250 }}
          className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 shadow-sm relative overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-300/30 rounded-full blur-3xl" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-2xl shadow-md shrink-0">
              ✓
            </div>
            <div className="flex-1">
              <div className="font-extrabold text-base text-emerald-800">
                Đã lưu vào hồ sơ y tế!
              </div>
              <div className="text-xs text-emerald-700 font-semibold mt-0.5">
                Kết quả này sẽ hiển thị trong <strong>Lịch sử AI Check</strong> để bạn tra cứu và đặt lịch lại.
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3 relative z-10">
            <Button
              variant="primary"
              className="px-5 !bg-emerald-600 hover:!bg-emerald-700"
              onClick={() => navigate("/dashboard/ai-history")}
            >
              📂 Xem lịch sử ngay
            </Button>
            <Button
              variant="outline"
              className="px-5 !border-emerald-300 !text-emerald-700 hover:!bg-emerald-100"
              onClick={() => navigate("/dashboard/appt")}
            >
              📅 Đặt lịch khám luôn
            </Button>
          </div>
        </motion.div>
      )}

      {/* Action toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex flex-wrap gap-2 pt-3"
      >
        <Button variant="primary" onClick={handleBookAppt} className="px-6">
          📅 Đặt lịch khám ngay
        </Button>
        <Button variant="outline" onClick={handleSave} disabled={false} className="px-6">
          {saved ? "📂 Mở hồ sơ" : "📋 Lưu vào hồ sơ"}
        </Button>
        <Button variant="ghost" onClick={handleShare}>
          🔗 Chia sẻ với bác sĩ
        </Button>
        <Button variant="ghost" onClick={onReset}>
          🔄 Kiểm tra lại
        </Button>
      </motion.div>
    </div>
  );
};

const DiseaseBar: React.FC<{ disease: DiseaseResult; delay: number }> = ({ disease, delay }) => {
  const sevVariant = SEVERITY_VARIANT[disease.severity];
  const sevLabel = SEVERITY_LABEL[disease.severity];

  const barColor =
    disease.severity === "critical" ? "bg-gradient-to-r from-rose-500 to-red-500" :
    disease.severity === "high" ? "bg-gradient-to-r from-orange-400 to-rose-500" :
    disease.severity === "medium" ? "bg-gradient-to-r from-amber-400 to-orange-500" :
    "bg-gradient-to-r from-emerald-400 to-teal-500";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-center justify-between text-xs font-bold mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-2xl">{disease.icon}</span>
          <div>
            <div className="text-darkbg font-extrabold">{disease.name}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Badge variant={sevVariant} className="text-[10px] py-0 px-1.5">{sevLabel}</Badge>
              <span className="text-[10px] text-muted font-bold uppercase tracking-wider">
                {CATEGORY_LABEL[disease.category] ?? disease.category}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right shrink-0 ml-3">
          <div className="text-lg font-extrabold text-gradient">{disease.pct}%</div>
          <div className="text-[10px] text-muted font-bold uppercase tracking-wider">khả năng</div>
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${disease.pct}%` }}
          transition={{ duration: 1.2, delay: delay + 0.2, ease: "easeOut" }}
          className={`h-full rounded-full ${barColor} relative`}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StepResult;