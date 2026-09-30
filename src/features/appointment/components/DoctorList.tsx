import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { DOCTORS } from "@/data/mock/doctors";
import { Doctor } from "@/types/index";

interface DoctorListProps {
  selectedDoctor: Doctor | null;
  onSelect: (doc: Doctor) => void;
  suggestSpec?: string;
  onBack?: () => void;
  onNext: () => void;
}

const formatVND = (n: number): string => {
  return new Intl.NumberFormat("vi-VN").format(n) + " ₫";
};

const DoctorList: React.FC<DoctorListProps> = ({ selectedDoctor, onSelect, suggestSpec, onBack, onNext }) => {
  // Chuẩn hoá spec & tag: bỏ dấu, lowercase, bỏ ký tự đặc biệt để match ổn định hơn.
  const normalize = (s: string): string =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

  // Match 2 chiều: spec chứa tag HOẶC tag chứa spec (đều là match).
  // Ví dụ spec "Da liễu - Nội khoa" match tag "Da liễu" ✓
  //       spec "Cấp cứu - Hồi sức" match tag "Cấp cứu 24/7" ✓
  const isMatch = (spec: string, tag: string): boolean => {
    const a = normalize(spec);
    const b = normalize(tag);
    return a.includes(b) || b.includes(a);
  };

  // Sắp xếp: bác sĩ match suggestSpec lên đầu.
  const sortedDoctors = [...DOCTORS].sort((a, b) => {
    if (!suggestSpec) return 0;
    const aMatch = a.tags.some(t => isMatch(suggestSpec, t)) ? 0 : 1;
    const bMatch = b.tags.some(t => isMatch(suggestSpec, t)) ? 0 : 1;
    return aMatch - bMatch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-extrabold text-xl text-darkbg">Chọn bác sĩ thú y</h2>
        <p className="text-muted text-sm mt-1">
          {suggestSpec ? (
            <>
              Gợi ý bác sĩ chuyên <strong className="text-primary">{suggestSpec}</strong> cho triệu chứng của bé.
            </>
          ) : (
            "Đội ngũ bác sĩ thú y giàu kinh nghiệm luôn sẵn sàng tư vấn."
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sortedDoctors.map((doc, i) => {
          const isSelected = selectedDoctor?.id === doc.id;
          const isSuggested = suggestSpec ? doc.tags.some(t => isMatch(suggestSpec, t)) : false;
          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -3 }}
              onClick={() => onSelect(doc)}
              className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 bg-white overflow-hidden ${
                isSelected
                  ? "border-primary bg-gradient-to-br from-primary-light/30 to-white shadow-lg"
                  : "border-gray-100 hover:border-primary/40 hover:shadow-sm"
              }`}
            >
              {isSuggested && (
                <div className="absolute top-2 right-2">
                  <Badge variant="success" className="text-[10px] py-0 px-2">⭐ Gợi ý</Badge>
                </div>
              )}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-sm shadow-md z-10"
                >
                  ✓
                </motion.div>
              )}
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${doc.avatarBg} flex items-center justify-center text-4xl shadow-md shrink-0`}>
                  {doc.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-sm text-darkbg leading-tight">
                    {doc.title} {doc.name}
                  </h3>
                  <div className="text-xs text-primary font-bold mt-1">{doc.specShort}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {doc.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-gray-100 text-muted text-[10px] font-bold">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-2.5 text-xs">
                    <div className="flex items-center gap-1 text-amber-500 font-extrabold">
                      ★ {doc.rating}
                      <span className="text-muted font-semibold">({doc.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {doc.nextAvailable}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-[11px] text-muted font-bold">
                    🏥 {doc.clinic}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <div>
                  <div className="text-[10px] text-muted font-bold uppercase tracking-wider">Phí khám</div>
                  <div className="text-base font-extrabold text-gradient">{formatVND(doc.fee)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-muted font-bold uppercase tracking-wider">Kinh nghiệm</div>
                  <div className="text-sm font-extrabold text-darkbg">{doc.experience} năm</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-between pt-3">
        {onBack && <Button variant="ghost" onClick={onBack}>← Quay lại</Button>}
        <Button variant="primary" onClick={onNext} disabled={!selectedDoctor} className="px-8 ml-auto">
          Tiếp tục →
        </Button>
      </div>
    </div>
  );
};

export default DoctorList;