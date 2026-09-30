import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  AppointmentRecord,
  readAppointments,
  removeAppointment,
  clearAppointments,
} from "@/utils/medicalHistory";
import { formatDateVN, fromLocalISODate, formatDateTimeLocal } from "@/utils/dateUtils";
import { findPetByName, getUserPets } from "@/data/mock/pet";

const STATUS: Record<string, { label: string; bg: string; text: string; border: string; emoji: string }> = {
  upcoming: { label: "Sắp tới", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", emoji: "🗓️" },
  today: { label: "Hôm nay", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", emoji: "🔥" },
  past: { label: "Đã qua", bg: "bg-gray-50", text: "text-gray-500", border: "border-gray-200", emoji: "✓" },
};

const formatVND = (n: number): string => new Intl.NumberFormat("vi-VN").format(n) + " ₫";

const getStatus = (date: string, time: string): keyof typeof STATUS => {
  const target = formatDateTimeLocal(date, time);
  const now = new Date();
  if (target.toDateString() === now.toDateString()) return "today";
  return target.getTime() > now.getTime() ? "upcoming" : "past";
};

const formatCreatedAt = (iso: string): string => {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

interface AppointmentListProps {
  /** Nếu true: hiển thị header + filter + xoá tất cả (dùng cho trang riêng). */
  fullPage?: boolean;
  /** Giới hạn số record hiển thị (dùng cho embed ở trang khác). */
  limit?: number;
  /** Lọc theo pet. */
  petId?: string;
}

export const AppointmentList: React.FC<AppointmentListProps> = ({ fullPage = false, limit, petId }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [records, setRecords] = useState<AppointmentRecord[]>(() => readAppointments());
  const [filterStatus, setFilterStatus] = useState<"all" | "upcoming" | "past">("all");
  const [filterPet, setFilterPet] = useState<string | "all">(petId ?? "all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Đồng bộ với localStorage khi:
  // 1. Tab focus lại (sau khi user đặt lịch ở tab khác)
  // 2. Storage event từ tab khác
  // 3. Custom event trong cùng tab sau khi addAppointment()
  useEffect(() => {
    const sync = () => setRecords(readAppointments());
    window.addEventListener("focus", sync);
    window.addEventListener("storage", sync);
    window.addEventListener("vetgen:appointments-changed", sync);
    return () => {
      window.removeEventListener("focus", sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("vetgen:appointments-changed", sync);
    };
  }, []);

  // Filter dropdown CHỈ hiển thị pet thuộc user hiện tại (tránh leak pet user khác).
  const myPets = useMemo(() => getUserPets(user), [user]);

  const filtered = useMemo(() => {
    let list = records;
    if (filterPet !== "all") list = list.filter(r => r.petId === filterPet);
    if (filterStatus !== "all") {
      list = list.filter(r => {
        const s = getStatus(r.date, r.time);
        if (filterStatus === "upcoming") return s === "upcoming" || s === "today";
        return s === "past";
      });
    }
    return limit ? list.slice(0, limit) : list;
  }, [records, filterPet, filterStatus, limit]);

  const stats = useMemo(() => {
    const today = records.filter(r => getStatus(r.date, r.time) === "today").length;
    const upcoming = records.filter(r => getStatus(r.date, r.time) === "upcoming").length;
    const past = records.filter(r => getStatus(r.date, r.time) === "past").length;
    return { today, upcoming, past, total: records.length };
  }, [records]);

  const handleDelete = (id: string) => {
    if (!window.confirm("Xoá lịch hẹn này?")) return;
    setRecords(removeAppointment(id));
    showToast("Đã xoá lịch hẹn.", "info");
  };

  const handleClearAll = () => {
    if (records.length === 0) return;
    if (!window.confirm(`Xoá toàn bộ ${records.length} lịch hẹn?`)) return;
    clearAppointments();
    setRecords([]);
    showToast("Đã xoá toàn bộ lịch hẹn.", "info");
  };

  const handleRefresh = () => setRecords(readAppointments());

  // Subscribe storage event để auto-refresh khi tab khác thay đổi.
  React.useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "appointments") handleRefresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (records.length === 0) {
    return (
      <div className="space-y-3">
        {fullPage && (
          <div className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <div className="font-extrabold text-base text-darkbg">Hồ sơ lịch hẹn</div>
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 px-4"
        >
          <div className="text-6xl mb-3">📅</div>
          <div className="font-extrabold text-base text-darkbg">Chưa có lịch hẹn nào</div>
          <div className="text-xs text-muted font-semibold mt-1">
            Đặt lịch khám cho bé cưng, kết quả sẽ được lưu tại đây để bạn xem lại.
          </div>
          <Button variant="primary" className="mt-4" onClick={() => navigate("/dashboard/appt")}>
            📅 Đặt lịch khám
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      {fullPage && (
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
            <div className="text-2xl">🔥</div>
            <div className="text-2xl font-extrabold text-emerald-700">{stats.today}</div>
            <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">Hôm nay</div>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-center">
            <div className="text-2xl">🗓️</div>
            <div className="text-2xl font-extrabold text-blue-700">{stats.upcoming}</div>
            <div className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">Sắp tới</div>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
            <div className="text-2xl">✓</div>
            <div className="text-2xl font-extrabold text-gray-600">{stats.past}</div>
            <div className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">Đã qua</div>
          </div>
        </div>
      )}

      {/* Header + filter */}
      {fullPage && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-2xl">📋</span>
            <div>
              <div className="font-extrabold text-base text-darkbg">Hồ sơ lịch hẹn</div>
              <div className="text-xs text-muted font-bold">{filtered.length} / {stats.total} lịch hẹn</div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as typeof filterStatus)}
              className="px-3 py-2 rounded-xl border-2 border-gray-100 text-xs font-bold bg-white text-darkbg outline-none focus:border-primary cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="upcoming">🗓️ Sắp tới</option>
              <option value="past">✓ Đã qua</option>
            </select>
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
        {filtered.length === 0 && (
          <div className="text-center py-8 px-4 text-xs text-muted font-bold">
            Không có lịch hẹn nào khớp bộ lọc.
          </div>
        )}
        {filtered.map((r, i) => {
          const statusKey = getStatus(r.date, r.time);
          const status = STATUS[statusKey];
            const pet = r.petId ? findPetByName(r.petId) : null;
          const isExpanded = expandedId === r.id;
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`rounded-2xl border-2 ${status.border} ${status.bg} overflow-hidden`}
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : r.id)}
                className="w-full p-4 flex items-center gap-3 text-left cursor-pointer"
              >
                {/* Date box */}
                <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex flex-col items-center justify-center shrink-0">
                  <div className="text-[9px] font-extrabold text-muted uppercase tracking-wider leading-none">
                    Th{fromLocalISODate(r.date).getMonth() + 1}
                  </div>
                  <div className="text-xl font-extrabold text-darkbg leading-tight">
                    {fromLocalISODate(r.date).getDate()}
                  </div>
                  <div className="text-[9px] font-extrabold text-primary leading-none">
                    {r.time}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${status.text} bg-white/60 flex items-center gap-1`}>
                      <span>{status.emoji}</span> {status.label}
                    </span>
                    <Badge variant="info" className="text-[9px]">{r.id}</Badge>
                  </div>
                  <div className="font-extrabold text-sm text-darkbg mt-1 truncate">
                    {pet?.emoji} {r.petName ?? r.petId ?? "—"} • {r.reasonLabel ?? "Khám"}
                  </div>
                  <div className="text-xs text-muted font-bold mt-0.5 truncate">
                    👨‍⚕️ {r.doctorName} • {r.doctorSpec ?? ""}
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
                    <div className="px-4 pb-4 pt-1 border-t border-current/10 space-y-2.5">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-white/60">
                          <div className="text-[10px] text-muted font-bold uppercase tracking-wider">📅 Ngày</div>
                          <div className="font-extrabold text-darkbg mt-0.5">{formatDateVN(r.date)}</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/60">
                          <div className="text-[10px] text-muted font-bold uppercase tracking-wider">⏰ Giờ</div>
                          <div className="font-extrabold text-primary mt-0.5">{r.time}</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/60">
                          <div className="text-[10px] text-muted font-bold uppercase tracking-wider">🏥 Hình thức</div>
                          <div className="font-extrabold text-darkbg mt-0.5">{r.modeLabel ?? "—"}</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/60">
                          <div className="text-[10px] text-muted font-bold uppercase tracking-wider">💰 Phí</div>
                          <div className="font-extrabold text-gradient mt-0.5">{formatVND(r.fee)}</div>
                        </div>
                      </div>

                      {r.symptomNote && r.symptomNote.trim() && (
                        <div className="p-3 rounded-xl bg-white/70">
                          <div className="text-[10px] font-extrabold text-muted uppercase tracking-wider mb-1">
                            📝 Mô tả triệu chứng
                          </div>
                          <p className="text-xs text-darkbg italic leading-relaxed">"{r.symptomNote}"</p>
                        </div>
                      )}

                      <div className="text-[10px] text-muted italic">
                        📌 Đặt lúc {formatCreatedAt(r.createdAt)}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {(statusKey === "upcoming" || statusKey === "today") && (
                          <Button
                            variant="outline"
                            className="text-xs !text-rose-600 !border-rose-200 hover:!bg-rose-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(r.id);
                            }}
                          >
                            ❌ Huỷ lịch hẹn
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(r.id);
                          }}
                        >
                          🗑️ Xoá khỏi hồ sơ
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

export default AppointmentList;