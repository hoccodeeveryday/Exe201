import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  AiHistoryRecord,
  readAiHistory,
  removeAiHistory,
  clearAiHistory,
} from "@/utils/medicalHistory";
import { getUserPets, findPetByName } from "@/data/mock/pet";

const RISK_STYLE: Record<string, { bg: string; text: string; border: string; icon: string; label: string }> = {
  low: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: "✓", label: "Nhẹ" },
  medium: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: "⚠", label: "Trung bình" },
  high: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", icon: "🚨", label: "Cao" },
  critical: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", icon: "🚑", label: "Khẩn cấp" },
};

const formatSavedAt = (iso: string): string => {
  const d = new Date(iso);
  const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  return `${weekdays[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1} • ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

interface AiHistoryListProps {
  /** Nếu true: hiển thị header + bộ filter + nút xoá tất cả (dùng cho trang riêng). */
  fullPage?: boolean;
  /** Lọc theo pet — nếu bỏ trống thì hiển thị tất cả. */
  petId?: string | null;
  /** Lọc theo pet nhận được từ hook (user đang đăng nhập) */
  scopeToUserPet?: string | null;
  /** Giới hạn số record hiển thị (dùng cho embed). */
  limit?: number;
}

export const AiHistoryList: React.FC<AiHistoryListProps> = ({ fullPage = false, petId, scopeToUserPet, limit }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [records, setRecords] = useState<AiHistoryRecord[]>(() => readAiHistory());
  const [filterPet, setFilterPet] = useState<string | "all">(petId ?? "all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Đồng bộ với localStorage khi:
  // 1. Tab focus lại (sau khi user chạy AI Check ở tab khác)
  // 2. Storage event từ tab khác
  // 3. Custom event trong cùng tab sau khi addAiHistory()
  useEffect(() => {
    const sync = () => setRecords(readAiHistory());
    window.addEventListener("focus", sync);
    window.addEventListener("storage", sync);
    window.addEventListener("vetgen:ai-history-changed", sync);
    return () => {
      window.removeEventListener("focus", sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("vetgen:ai-history-changed", sync);
    };
  }, []);

  // Filter dropdown chỉ hiển thị pet THUỘC USER HIỆN TẠI (tránh leak pet user khác).
  // Nếu không có user → rỗng (fallback "Tất cả" cũng OK).
  const myPets = useMemo(() => getUserPets(user), [user]);

  const filtered = useMemo(() => {
    let list = records;
    if (scopeToUserPet) list = list.filter(r => r.petId === scopeToUserPet);
    if (filterPet !== "all") list = list.filter(r => r.petId === filterPet);
    if (limit) list = list.slice(0, limit);
    return list;
  }, [records, filterPet, scopeToUserPet, limit]);

  const handleDelete = (id: string) => {
    if (!window.confirm("Xoá kết quả AI Check này?")) return;
    setRecords(removeAiHistory(id));
    showToast("Đã xoá kết quả.", "info");
  };

  const handleClearAll = () => {
    if (records.length === 0) return;
    if (!window.confirm(`Xoá toàn bộ ${records.length} kết quả?`)) return;
    clearAiHistory();
    setRecords([]);
    showToast("Đã xoá toàn bộ lịch sử AI Check.", "info");
  };

  const handleRefresh = () => setRecords(readAiHistory());

  if (filtered.length === 0) {
    return (
      <div className="space-y-3">
        {fullPage && (
          <div className="flex items-center justify-between">
            <div className="font-extrabold text-base text-darkbg flex items-center gap-2">
              <span className="text-2xl">🤖</span> Lịch sử AI Check
            </div>
            <Button variant="ghost" onClick={handleRefresh} className="text-xs">↻ Làm mới</Button>
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 px-4"
        >
          <div className="text-6xl mb-3">🔍</div>
          <div className="font-extrabold text-base text-darkbg">Chưa có kết quả AI Check nào</div>
          <div className="text-xs text-muted font-semibold mt-1">
            Hãy chạy thử AI Check để xem phân tích triệu chứng và lưu kết quả tại đây.
          </div>
          <Button variant="primary" className="mt-4" onClick={() => navigate("/dashboard/ai-check")}>
            🤖 Chạy AI Check ngay
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header + filter */}
      {fullPage && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-2xl">🤖</span>
            <div>
              <div className="font-extrabold text-base text-darkbg">Lịch sử AI Check</div>
              <div className="text-xs text-muted font-bold">
                {filtered.length} kết quả {scopeToUserPet ? `của ${scopeToUserPet}` : "đã lưu"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filterPet}
              onChange={e => setFilterPet(e.target.value)}
              className="px-3 py-2 rounded-xl border-2 border-gray-100 text-xs font-bold bg-white text-darkbg outline-none focus:border-primary cursor-pointer"
            >
              <option value="all">Tất cả thú cưng</option>
              {myPets.map(p => (
                <option key={p.name} value={p.name}>{p.emoji} {p.name}</option>
              ))}
            </select>
            <Button variant="ghost" onClick={handleRefresh} className="text-xs">↻ Làm mới</Button>
            <Button variant="outline" onClick={handleClearAll} className="text-xs !text-rose-600 !border-rose-200 hover:!bg-rose-50">
              🗑️ Xoá tất cả
            </Button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-2.5">
        {filtered.map((r, i) => {
          const risk = RISK_STYLE[r.riskLevel] ?? RISK_STYLE.low;
            const pet = r.petId ? findPetByName(r.petId) : null;
          const isExpanded = expandedId === r.id;
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`rounded-2xl border-2 ${risk.border} ${risk.bg} overflow-hidden`}
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : r.id)}
                className="w-full p-4 flex items-center gap-3 text-left cursor-pointer"
              >
                {/* Risk icon */}
                <div className={`w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl shrink-0 ${risk.text}`}>
                  {risk.icon}
                </div>

                {/* Pet + symptoms */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {pet && <span className="text-xl">{pet.emoji}</span>}
                    <span className="font-extrabold text-sm text-darkbg">{r.petId ?? "Chưa rõ"}</span>
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${risk.text} bg-white/60`}>
                      {risk.label}
                    </span>
                  </div>
                  <div className="text-xs text-darkbg/80 mt-1 line-clamp-1 italic">
                    "{r.symptoms}"
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-muted font-bold">
                    <span>📅 {formatSavedAt(r.savedAt)}</span>
                    {r.tags.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{r.tags.length} tag</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Expand icon */}
                <motion.span
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-muted text-lg shrink-0"
                >
                  ⌄
                </motion.span>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-1 border-t border-current/10 space-y-3">
                      {/* Top disease */}
                      {r.topDisease && (
                        <div className="p-3 rounded-xl bg-white/70">
                          <div className="text-[10px] font-extrabold text-muted uppercase tracking-wider">
                            🔍 Bệnh khả thi nhất
                          </div>
                          <div className={`font-extrabold text-sm ${risk.text} mt-0.5`}>
                            {r.topDisease}
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {r.tags.length > 0 && (
                        <div>
                          <div className="text-[10px] font-extrabold text-muted uppercase tracking-wider mb-1.5">
                            🏷️ Triệu chứng đã chọn
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {r.tags.map(t => (
                              <span
                                key={t}
                                className="px-2 py-1 rounded-full bg-white text-darkbg text-[10px] font-extrabold border border-current/10"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        <Button
                          variant="primary"
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            const params = new URLSearchParams({
                              fromAI: "1",
                              reason: r.scenarioId,
                              pet: r.petId ?? "",
                              notes: r.symptoms,
                            });
                            navigate(`/dashboard/appt?${params.toString()}`);
                          }}
                        >
                          📅 Đặt lịch khám
                        </Button>
                        <Button
                          variant="outline"
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Truyền prefill qua URL để AI Check page nhận lại:
                            // symptoms + tags + duration + petId → user chỉ cần nhấn "Phân tích"
                            const params = new URLSearchParams({
                              recheck: "1",
                              pet: r.petId ?? "",
                              symptoms: r.symptoms,
                              tags: r.tags.join(","),
                              duration: r.duration,
                            });
                            navigate(`/dashboard/ai-check?${params.toString()}`);
                          }}
                        >
                          🔄 Kiểm tra lại với cùng triệu chứng
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-xs !text-rose-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(r.id);
                          }}
                        >
                          🗑️ Xoá
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AiHistoryList;