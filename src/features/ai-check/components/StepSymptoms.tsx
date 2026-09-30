import React, { useMemo } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Textarea from "@/components/ui/Textarea";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getUserPets, PetProfile } from "@/data/mock/pet";
import {
  QUICK_TAGS,
  TAGS_BY_CATEGORY,
  CATEGORY_LABEL,
  CATEGORY_EMOJI,
  SymptomTag,
  DURATION_OPTIONS,
} from "../constants";

interface StepSymptomsProps {
  symptoms: string;
  setSymptoms: (symptoms: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  petId: string | null;
  setPetId: (id: string) => void;
  duration: string;
  setDuration: (d: string) => void;
  onNext: () => void;
}

const StepSymptoms: React.FC<StepSymptomsProps> = ({
  symptoms,
  setSymptoms,
  selectedTags,
  setSelectedTags,
  petId,
  setPetId,
  duration,
  setDuration,
  onNext,
}) => {
  const { user } = useAuth();

  // Chỉ hiển thị pet thuộc user hiện tại (1 user = 1 pet trong demo).
  // Tránh bug cross-user: chọn pet của người khác lưu vào lịch sử.
  const myPets: PetProfile[] = useMemo(() => getUserPets(user), [user]);

  const handleTagClick = (tag: SymptomTag) => {
    let nextTags: string[];
    if (selectedTags.includes(tag.label)) {
      nextTags = selectedTags.filter(t => t !== tag.label);
    } else {
      nextTags = [...selectedTags, tag.label];
    }
    setSelectedTags(nextTags);

    const base = symptoms.trim();
    if (!selectedTags.includes(tag.label)) {
      setSymptoms(base ? `${base}, ${tag.label.toLowerCase()}` : tag.label);
    } else {
      const regex = new RegExp(`(^|,\\s*)${tag.label.toLowerCase()}`, "gi");
      const clean = base.replace(regex, "").trim();
      setSymptoms(clean.startsWith(",") ? clean.substring(1).trim() : clean);
    }
  };

  const canNext = petId && (symptoms.trim() || selectedTags.length > 0);

  return (
    <div className="space-y-7">
      <div>
        <h2 className="font-extrabold text-xl text-darkbg flex items-center gap-2">
          🔍 Mô tả triệu chứng
        </h2>
        <p className="text-muted text-sm mt-1">
          Thông tin càng chi tiết, AI phân tích càng chính xác. Tất cả dữ liệu được bảo mật.
        </p>
      </div>

      {/* Pet selector */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-xs font-bold text-darkbg uppercase tracking-wider">
          <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">1</span>
          Bé nào đang có triệu chứng?
        </label>
        {myPets.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary-light/30 p-5 text-center space-y-2">
            <div className="text-3xl">🐾</div>
            <div className="text-sm font-bold text-darkbg">
              Bạn chưa có thú cưng nào trong hệ thống
            </div>
            <div className="text-xs text-muted">
              Thêm hồ sơ bé cưng trước khi bắt đầu kiểm tra sức khỏe nhé!
            </div>
            <a
              href="/dashboard/pet"
              className="inline-block mt-1 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition"
            >
              + Thêm thú cưng ngay
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {myPets.map(p => {
              const isSelected = petId === p.name;
              return (
                <motion.button
                  key={p.name}
                  type="button"
                  onClick={() => setPetId(p.name)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative p-2 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-center ${
                    isSelected
                      ? "border-primary bg-gradient-to-br from-primary-light/40 to-white shadow-md"
                      : "border-gray-100 bg-white hover:border-primary/40"
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] shadow-md"
                    >
                      ✓
                    </motion.div>
                  )}
                  <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${p.avatarBg} flex items-center justify-center text-2xl shadow-sm mb-1`}>
                    {p.emoji}
                  </div>
                  <div className="font-extrabold text-xs text-darkbg leading-tight truncate">{p.name}</div>
                  <div className="text-[9px] text-muted font-bold mt-0.5 truncate">{p.breed}</div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick tags by category */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-xs font-bold text-darkbg uppercase tracking-wider">
          <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">2</span>
          Chọn nhanh triệu chứng <span className="text-muted normal-case font-medium">(nhóm theo hệ cơ quan)</span>
        </label>
        <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2 -mr-2">
          {Object.entries(TAGS_BY_CATEGORY).map(([cat, tags]) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2 sticky top-0 bg-white py-1 z-10">
                <span className="text-base">{CATEGORY_EMOJI[cat]}</span>
                <span className="text-[11px] font-extrabold text-darkbg uppercase tracking-wider">
                  {CATEGORY_LABEL[cat]}
                </span>
                <span className="text-[10px] text-muted font-bold">
                  ({tags.filter(t => selectedTags.includes(t.label)).length}/{tags.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tags.map(tag => {
                  const isSelected = selectedTags.includes(tag.label);
                  return (
                    <motion.button
                      key={tag.label}
                      type="button"
                      onClick={() => handleTagClick(tag)}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all duration-200 ${
                        isSelected
                          ? "border-primary bg-gradient-to-r from-primary to-[#FF8FAB] text-white shadow-md"
                          : "border-gray-100 bg-white text-gray-600 hover:border-primary/40"
                      }`}
                    >
                      <span className="mr-1">{tag.emoji}</span>
                      {tag.label}
                      {tag.severity === "severe" && !isSelected && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
        {selectedTags.length > 0 && (
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="info">Đã chọn {selectedTags.length} triệu chứng</Badge>
            {selectedTags.filter(t => QUICK_TAGS.find(q => q.label === t)?.severity === "severe").length > 0 && (
              <Badge variant="danger">⚠ Có triệu chứng nặng</Badge>
            )}
          </div>
        )}
      </div>

      {/* Duration */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-xs font-bold text-darkbg uppercase tracking-wider">
          <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">3</span>
          Bé bị bao lâu rồi?
        </label>
        <div className="flex flex-wrap gap-2">
          {DURATION_OPTIONS.map(d => {
            const isSelected = duration === d.id;
            return (
              <motion.button
                key={d.id}
                type="button"
                onClick={() => setDuration(d.id)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                  isSelected
                    ? "border-primary bg-primary-light text-primary"
                    : "border-gray-100 bg-white text-gray-600 hover:border-primary/40"
                }`}
              >
                <span className="mr-1">{d.emoji}</span> {d.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Textarea */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-xs font-bold text-darkbg uppercase tracking-wider">
          <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">4</span>
          Mô tả chi tiết <span className="text-muted normal-case font-medium">(tuỳ chọn)</span>
        </label>
        <Textarea
          placeholder="Ví dụ: Bé Mít nhà em bị ho nhẹ, chảy nước mũi từ sáng nay, ăn uống bình thường nhưng lười vận động hơn. Có vẻ như bị sau khi tắm..."
          rows={4}
          value={symptoms}
          onChange={e => setSymptoms(e.target.value)}
          className="resize-none"
        />
        <div className="flex items-center justify-between text-[10px] text-muted">
          <span className="italic">🔒 Chỉ AI & bác sĩ xem được mô tả này.</span>
          <span>{symptoms.length} / 500 ký tự</span>
        </div>
      </div>

      <div className="flex justify-end pt-3">
        <Button variant="primary" onClick={onNext} disabled={!canNext} className="px-8">
          Tiếp tục →
        </Button>
      </div>
    </div>
  );
};

export default StepSymptoms;