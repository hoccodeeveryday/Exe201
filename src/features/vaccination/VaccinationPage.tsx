import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import Tabs from "@/components/ui/Tabs";
import Button from "@/components/ui/Button";
import {
  OVERDUE_VACCINES,
  UPCOMING_VACCINES,
  INJECTED_VACCINES,
  REACTION_LABEL,
  REACTION_COLOR,
} from "@/data/mock/vaccines";
import { getUserFirstPet } from "@/data/mock/pet";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

type View = "list" | "timeline";

const VaccinationPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const pet = useMemo(() => getUserFirstPet(user) ?? getUserFirstPet({ name: "Yến Nhi" })!, [user]);
  const [activeTab, setActiveTab] = useState("overdue");
  const [view, setView] = useState<View>("list");

  const handleBookVaccine = (name: string) => {
    showToast(`Đã đặt lịch tiêm "${name}" cho ${pet.name}!`, "success");
  };

  const handleBookWithAppt = () => {
    const params = new URLSearchParams({
      fromAI: "0",
      reason: "vaccine",
      pet: pet.name,
      notes: `Tiêm vaccine cho ${pet.name}`,
    });
    navigate(`/dashboard/appt?${params.toString()}`);
  };

  const stats = [
    { label: "Đã tiêm", value: INJECTED_VACCINES.length, color: "from-emerald-400 to-teal-500", icon: "✓", tabId: "injected" },
    { label: "Sắp tới", value: UPCOMING_VACCINES.length, color: "from-amber-400 to-orange-500", icon: "⏰", tabId: "upcoming" },
    { label: "Trễ hẹn", value: OVERDUE_VACCINES.length, color: "from-rose-400 to-pink-500", icon: "!", tabId: "overdue" },
    { label: "Tổng cộng", value: INJECTED_VACCINES.length + UPCOMING_VACCINES.length + OVERDUE_VACCINES.length, color: "from-violet-400 to-purple-500", icon: "💉", tabId: "" },
  ];

  const tabs = [
    { id: "overdue", label: `🚨 Trễ hẹn (${OVERDUE_VACCINES.length})` },
    { id: "upcoming", label: `⏰ Sắp tới (${UPCOMING_VACCINES.length})` },
    { id: "injected", label: `✓ Đã tiêm (${INJECTED_VACCINES.length})` },
  ];

  const upcoming = UPCOMING_VACCINES[0];
  const daysUntilDue = 30;
  const totalOverdue = OVERDUE_VACCINES.length;

  // Timeline data: gộp tất cả vaccine, sort theo date desc
  const allVaccines = [
    ...OVERDUE_VACCINES.map(v => ({ ...v, status: "overdue" as const })),
    ...UPCOMING_VACCINES.map(v => ({ ...v, status: "upcoming" as const })),
    ...INJECTED_VACCINES.map(v => ({ ...v, status: "injected" as const })),
  ].sort((a, b) => {
    const parseDate = (s: string) => {
      const [d, m, y] = s.split("/");
      return new Date(`${y}-${m}-${d}`).getTime();
    };
    return parseDate(b.date) - parseDate(a.date);
  });

  return (
    <div className="space-y-6">
      <PageHeader />

      {/* Pet banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pet-hero-card relative overflow-hidden p-6 md:p-8 bg-gradient-to-br from-rose-100 via-pink-50 to-violet-50"
      >
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
        <div className="relative z-10 flex items-center gap-5">
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [-3, 3, -3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${pet.avatarBg} flex items-center justify-center text-5xl shadow-xl`}
          >
            {pet.emoji}
          </motion.div>
          <div className="flex-1">
            <div className="text-xs font-extrabold uppercase tracking-wider text-primary mb-1">Sổ tiêm chủng</div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-darkbg tracking-tight">
              {pet.name} · <span className="text-gradient">{pet.breed}</span>
            </h1>
            <p className="text-sm text-muted font-semibold mt-1">
              Theo dõi lịch tiêm chủng & nhắc nhở thông minh
            </p>
          </div>
          <div className="hidden md:flex flex-col items-center">
            <div className="text-5xl">💉</div>
          </div>
        </div>
      </motion.div>

      {/* OVERDUE ALERT - hiển thị to nếu có */}
      <AnimatePresence>
        {totalOverdue > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gradient-to-r from-rose-100 via-rose-50 to-red-50 border-2 border-rose-300 rounded-2xl p-5 relative overflow-hidden shadow-lg"
          >
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-12 -right-12 w-48 h-48 bg-rose-400 rounded-full blur-3xl pointer-events-none"
            />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center text-4xl shadow-lg shrink-0">
                🚨
              </div>
              <div className="flex-1">
                <div className="font-extrabold text-base text-rose-900">
                  {pet.name} có {totalOverdue} mũi tiêm TRỄ HẸN!
                </div>
                <p className="text-sm text-rose-800 mt-1 font-semibold">
                  Hãy đặt lịch tiêm bổ sung trong tuần này để đảm bảo miễn dịch cho bé.
                </p>
              </div>
              <Button variant="primary" onClick={handleBookWithAppt} className="bg-gradient-to-r from-rose-500 to-red-500 shadow-lg shadow-rose-300/50">
                📅 Đặt lịch ngay
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="p-5 relative overflow-hidden hover-lift shine-effect cursor-pointer" onClick={() => {
              if (s.tabId) setActiveTab(s.tabId);
            }}>
              <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-25 blur-2xl bg-gradient-to-br ${s.color}`} />
              <div className="flex justify-between items-start mb-2 relative z-10">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">{s.label}</span>
                <span className="text-2xl">{s.icon}</span>
              </div>
              <div className="text-3xl font-extrabold text-darkbg relative z-10">{s.value}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Next due highlight */}
      {upcoming && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-amber-100 via-orange-50 to-rose-50 border-amber-200 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-amber-300/40 to-transparent rounded-full blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-4xl shadow-xl animate-pet-bounce">
                💉
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="text-xs font-extrabold uppercase tracking-wider text-amber-700 mb-1">
                  ⏰ Sắp đến hạn
                </div>
                <h3 className="text-xl font-extrabold text-darkbg">{upcoming.name}</h3>
                <p className="text-sm text-amber-800 mt-1 font-semibold">
                  📅 {upcoming.date} • còn {daysUntilDue} ngày
                </p>
                <p className="text-xs text-amber-900 mt-1">{upcoming.note}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="primary" className="btn-rainbow" onClick={() => handleBookVaccine(upcoming.name)}>
                  📅 Đặt lịch nhanh
                </Button>
                <Button variant="outline" className="text-xs" onClick={handleBookWithAppt}>
                  🏥 Đặt qua lịch khám
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* View toggle */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
          <div className="flex items-center gap-2 flex-1">
            <Icon n="vax" size={20} className="text-primary" />
            <h2 className="font-extrabold text-base text-darkbg">
              {view === "list" ? `Lịch tiêm của ${pet.name}` : `Timeline tiêm chủng`}
            </h2>
          </div>
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => setView("list")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                view === "list" ? "bg-white text-darkbg shadow-sm" : "text-muted hover:text-darkbg"
              }`}
            >
              📋 Theo trạng thái
            </button>
            <button
              type="button"
              onClick={() => setView("timeline")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                view === "timeline" ? "bg-white text-darkbg shadow-sm" : "text-muted hover:text-darkbg"
              }`}
            >
              🕐 Timeline
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === "list" ? (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

              <AnimatePresence mode="wait">
                {activeTab === "overdue" && (
                  <motion.div key="overdue" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4 mt-5">
                    {OVERDUE_VACCINES.length === 0 ? (
                      <EmptyState icon="🎉" title="Không có mũi tiêm trễ hẹn" desc="Bạn đang cập nhật đầy đủ vaccine cho bé!" />
                    ) : (
                      OVERDUE_VACCINES.map((r, i) => (
                        <VaccineCard
                          key={`overdue-${i}`}
                          index={i}
                          delay={i * 0.08}
                          accent="rose"
                          icon="⚠️"
                          title={r.name}
                          meta={`Đã trễ từ ${r.date}`}
                          badge={<Badge variant="danger">Trễ hẹn</Badge>}
                          note={r.note}
                          comment={r.comment}
                          doctor={r.doctor}
                          clinic={r.clinic}
                          lot={r.lot}
                          reaction={r.reaction}
                          cta={
                            <div className="flex gap-2">
                              <Button variant="primary" className="text-xs" onClick={handleBookWithAppt}>
                                Đặt qua lịch khám
                              </Button>
                              <Button variant="outline" className="text-xs" onClick={() => handleBookVaccine(r.name)}>
                                Đặt nhanh
                              </Button>
                            </div>
                          }
                        />
                      ))
                    )}
                  </motion.div>
                )}

                {activeTab === "upcoming" && (
                  <motion.div key="upcoming" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4 mt-5">
                    {UPCOMING_VACCINES.length === 0 ? (
                      <EmptyState icon="📅" title="Chưa có lịch tiêm sắp tới" desc="Hãy đặt lịch vaccine cho bé ngay nhé!" />
                    ) : (
                      UPCOMING_VACCINES.map((r, i) => (
                        <VaccineCard
                          key={`upcoming-${i}`}
                          index={i}
                          delay={i * 0.08}
                          accent="amber"
                          icon="⏰"
                          title={r.name}
                          meta={`Hạn tiêm: ${r.date}`}
                          badge={<Badge variant="warning">Sắp tới</Badge>}
                          note={r.note}
                          comment={r.comment}
                          doctor={r.doctor}
                          clinic={r.clinic}
                          lot={r.lot}
                        />
                      ))
                    )}
                  </motion.div>
                )}

                {activeTab === "injected" && (
                  <motion.div key="injected" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4 mt-5">
                    {INJECTED_VACCINES.length === 0 ? (
                      <EmptyState icon="💉" title="Chưa có mũi tiêm nào hoàn thành" />
                    ) : (
                      INJECTED_VACCINES.map((r, i) => (
                        <VaccineCard
                          key={`injected-${i}`}
                          index={i}
                          delay={i * 0.08}
                          accent="emerald"
                          icon="✓"
                          title={r.name}
                          meta={`Đã tiêm: ${r.date}`}
                          badge={<Badge variant="success">Đã hoàn thành</Badge>}
                          note={r.note}
                          comment={r.comment}
                          doctor={r.doctor}
                          clinic={r.clinic}
                          lot={r.lot}
                          reaction={r.reaction}
                          nextDue={r.nextDue}
                        />
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <TimelineView vaccines={allVaccines} />
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
};

interface VaccineCardProps {
  index: number;
  delay: number;
  accent: "rose" | "amber" | "emerald";
  icon: string;
  title: string;
  meta: string;
  badge: React.ReactNode;
  note: string;
  comment: string;
  doctor?: string;
  clinic?: string;
  lot?: string;
  reaction?: "none" | "mild" | "moderate" | "severe";
  nextDue?: string;
  cta?: React.ReactNode;
}

const ACCENT: Record<string, { border: string; bg: string; iconBg: string; metaText: string; noteText: string; commentText: string }> = {
  rose: { border: "border-rose-100 border-l-[5px] border-l-danger", bg: "bg-rose-50/60", iconBg: "bg-rose-100", metaText: "text-rose-700", noteText: "text-rose-900", commentText: "text-rose-800" },
  amber: { border: "border-amber-100 border-l-[5px] border-l-warning", bg: "bg-amber-50/60", iconBg: "bg-amber-100", metaText: "text-amber-700", noteText: "text-amber-900", commentText: "text-amber-800" },
  emerald: { border: "border-emerald-100 border-l-[5px] border-l-emerald-500", bg: "bg-emerald-50/40", iconBg: "bg-emerald-100", metaText: "text-emerald-700", noteText: "text-emerald-900", commentText: "text-emerald-800" },
};

const VaccineCard: React.FC<VaccineCardProps> = ({ delay, accent, icon, title, meta, badge, note, comment, doctor, clinic, lot, reaction, nextDue, cta }) => {
  const a = ACCENT[accent];
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`p-5 rounded-2xl border ${a.border} ${a.bg} hover:-translate-y-0.5 hover:shadow-md transition-all`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${a.iconBg} flex items-center justify-center text-2xl`}>{icon}</div>
          <div>
            <h3 className="font-extrabold text-sm text-darkbg">{title}</h3>
            <div className={`flex items-center gap-1.5 text-xs font-semibold mt-1 ${a.metaText}`}>
              <Icon n="clock" size={13} />
              <span>{meta}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {badge}
          {cta}
        </div>
      </div>
      <p className={`text-xs leading-relaxed font-semibold mt-3 ${a.noteText}`}>{note}</p>
      <p className={`text-xs leading-relaxed mt-2 italic ${a.commentText}`}>{comment}</p>

      {/* Detail grid */}
      {(doctor || clinic || lot || reaction || nextDue) && (
        <div className="mt-3 pt-3 border-t border-dashed border-current/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
          {doctor && (
            <div>
              <div className="text-muted uppercase tracking-wider font-bold">👨‍⚕️ Bác sĩ</div>
              <div className="text-darkbg font-extrabold mt-0.5">{doctor}</div>
            </div>
          )}
          {clinic && (
            <div>
              <div className="text-muted uppercase tracking-wider font-bold">🏥 Nơi tiêm</div>
              <div className="text-darkbg font-extrabold mt-0.5 truncate">{clinic}</div>
            </div>
          )}
          {lot && (
            <div>
              <div className="text-muted uppercase tracking-wider font-bold">💊 Số lô</div>
              <div className="text-darkbg font-mono font-extrabold mt-0.5">{lot}</div>
            </div>
          )}
          {reaction && (
            <div>
              <div className="text-muted uppercase tracking-wider font-bold">⚡ Phản ứng</div>
              <div className={`inline-flex items-center px-1.5 py-0.5 rounded-md border font-extrabold mt-0.5 ${REACTION_COLOR[reaction]}`}>
                {REACTION_LABEL[reaction]}
              </div>
            </div>
          )}
          {nextDue && (
            <div className="col-span-2 sm:col-span-4">
              <div className="text-muted uppercase tracking-wider font-bold">🔄 Mũi tiêm tiếp theo</div>
              <div className="text-darkbg font-extrabold mt-0.5">{nextDue}</div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

const STATUS_STYLE: Record<string, { dot: string; bg: string; text: string; icon: string; label: string }> = {
  injected: { dot: "bg-emerald-500", bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", icon: "✓", label: "Đã tiêm" },
  upcoming: { dot: "bg-amber-500", bg: "bg-amber-50 border-amber-200", text: "text-amber-700", icon: "⏰", label: "Sắp tới" },
  overdue: { dot: "bg-rose-500", bg: "bg-rose-50 border-rose-200", text: "text-rose-700", icon: "🚨", label: "Trễ hẹn" },
};

type TimelineItem = (typeof INJECTED_VACCINES)[number] & { status: "overdue" | "upcoming" | "injected" };

const TimelineView: React.FC<{ vaccines: TimelineItem[] }> = ({ vaccines }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative mt-2">
      {/* vertical line */}
      <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-rose-300 via-amber-300 to-emerald-300" />
      <div className="space-y-3">
        {vaccines.map((v, i) => {
          const s = STATUS_STYLE[v.status];
          return (
            <motion.div
              key={v.id ?? i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="relative flex gap-4 pl-0"
            >
              {/* dot */}
              <div className="relative z-10 shrink-0">
                <div className={`w-10 h-10 rounded-full ${s.bg} border-2 ${s.dot.replace("bg-", "border-")} flex items-center justify-center text-base shadow-sm`}>
                  {s.icon}
                </div>
              </div>
              {/* card */}
              <div className={`flex-1 p-4 rounded-2xl border ${s.bg}`}>
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <div className={`text-[10px] font-extrabold uppercase tracking-wider ${s.text}`}>
                      {s.label} • {v.date}
                    </div>
                    <h4 className="font-extrabold text-sm text-darkbg mt-1">{v.name}</h4>
                    {v.doctor && (
                      <div className="text-[11px] text-muted font-bold mt-1">👨‍⚕️ {v.doctor}</div>
                    )}
                  </div>
                  {v.reaction && (
                    <div className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${REACTION_COLOR[v.reaction]}`}>
                      ⚡ {REACTION_LABEL[v.reaction]}
                    </div>
                  )}
                </div>
                {v.comment && (
                  <p className={`text-xs mt-2 leading-relaxed italic ${s.text}`}>{v.comment}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

const EmptyState: React.FC<{ icon: string; title: string; desc?: string }> = ({ icon, title, desc }) => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 px-4">
    <div className="text-6xl mb-3">{icon}</div>
    <div className="font-extrabold text-base text-darkbg">{title}</div>
    {desc && <div className="text-xs text-muted font-semibold mt-1">{desc}</div>}
  </motion.div>
);

export default VaccinationPage;