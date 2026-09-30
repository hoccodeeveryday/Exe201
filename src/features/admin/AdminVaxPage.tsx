import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import AdminStatCard from "@/components/admin/AdminStatCard";
import DataTable from "@/components/admin/DataTable";
import Badge from "@/components/ui/Badge";
import LineChart from "@/components/charts/LineChart";
import Icon from "@/components/ui/Icon";
import { VACCINE_RECORDS, VaccineRecord } from "@/data/mock/vaccineRecords";
import { useToast } from "@/hooks/useToast";

type StatusTab = "all" | "overdue" | "upcoming" | "done";

const tabs: { id: StatusTab; label: string; color: string }[] = [
  { id: "all", label: "Tất cả", color: "indigo" },
  { id: "overdue", label: "Quá hạn", color: "rose" },
  { id: "upcoming", label: "Sắp tiêm", color: "amber" },
  { id: "done", label: "Đã tiêm", color: "emerald" },
];

const stats = [
  { label: "Tổng lịch tiêm", value: 1248, delta: 8.2, sparklineData: [840, 880, 920, 960, 1010, 1060, 1100, 1160, 1248], icon: "vax", iconGradient: "from-indigo-500 to-purple-500", accentColor: "#6366F1" },
  { label: "Quá hạn", value: 38, delta: -12.4, sparklineData: [60, 56, 52, 48, 46, 44, 42, 40, 38], icon: "warn", iconGradient: "from-rose-500 to-rose-600", accentColor: "#F43F5E" },
  { label: "Sắp tiêm", value: 142, delta: 4.5, sparklineData: [110, 115, 120, 125, 128, 132, 136, 140, 142], icon: "cal", iconGradient: "from-amber-500 to-orange-500", accentColor: "#F59E0B" },
  { label: "Tỷ lệ tiêm đúng hạn", value: "94.2%", delta: 1.4, sparklineData: [88, 89, 90, 91, 92, 92, 93, 93, 94.2], icon: "tick", iconGradient: "from-emerald-500 to-teal-500", accentColor: "#10B981" },
];

const trendOverdue = [
  { label: "T1", value: 60 },
  { label: "T2", value: 58 },
  { label: "T3", value: 55 },
  { label: "T4", value: 48 },
  { label: "T5", value: 52 },
  { label: "T6", value: 46 },
  { label: "T7", value: 42 },
  { label: "T8", value: 38 },
  { label: "T9", value: 35 },
  { label: "T10", value: 32 },
  { label: "T11", value: 30 },
  { label: "T12", value: 28 },
];

const trendDone = [
  { label: "T1", value: 80 },
  { label: "T2", value: 82 },
  { label: "T3", value: 85 },
  { label: "T4", value: 87 },
  { label: "T5", value: 90 },
  { label: "T6", value: 91 },
  { label: "T7", value: 93 },
  { label: "T8", value: 92 },
  { label: "T9", value: 94 },
  { label: "T10", value: 95 },
  { label: "T11", value: 96 },
  { label: "T12", value: 94 },
];

const AdminVaxPage: React.FC = () => {
  const { showToast } = useToast();
  const [tab, setTab] = useState<StatusTab>("all");

  const filtered = useMemo(() => {
    if (tab === "all") return VACCINE_RECORDS;
    if (tab === "overdue") return VACCINE_RECORDS.filter(v => v.status === "overdue");
    if (tab === "upcoming") return VACCINE_RECORDS.filter(v => v.status === "soon");
    return VACCINE_RECORDS.filter(v => v.status === "done");
  }, [tab]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => <AdminStatCard key={s.label} {...s} />)}
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-admin rounded-2xl shadow-admin p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Xu hướng tiêm chủng</h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">12 tháng · Lịch quá hạn vs Lịch hoàn thành (%)</p>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-extrabold">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Quá hạn
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-extrabold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Hoàn thành
            </span>
          </div>
        </div>
        <LineChart data={trendOverdue.map(d => ({ label: d.label, value: d.value }))} data2={trendDone.map(d => ({ label: d.label, value: d.value }))} height={260} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-admin rounded-2xl shadow-admin p-6">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Danh sách tiêm chủng</h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Tổng <span className="text-slate-900 font-extrabold">{VACCINE_RECORDS.length}</span> lịch tiêm trong hệ thống
            </p>
          </div>
          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
            {tabs.map(t => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-3.5 py-1.5 text-xs font-extrabold rounded-lg transition cursor-pointer ${
                    active ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <DataTable<VaccineRecord>
          data={filtered}
          rowKey={v => v.id}
          searchKeys={["pet", "breed", "vaccine"]}
          columns={[
            { key: "id", header: "Mã", render: v => <span className="text-slate-900 font-extrabold">{v.id}</span> },
            {
              key: "pet",
              header: "Thú cưng",
              render: v => (
                <div>
                  <div className="text-slate-900 font-extrabold">{v.pet}</div>
                  <div className="text-[11px] text-slate-500 font-semibold">{v.breed}</div>
                </div>
              ),
            },
            { key: "vaccine", header: "Vaccine", render: v => <span className="text-slate-700 font-semibold">{v.vaccine}</span> },
            { key: "date", header: "Ngày", render: v => <span className="text-slate-900 font-extrabold">{v.date}</span> },
            {
              key: "status",
              header: "Trạng thái",
              render: v => {
                if (v.status === "done") return <Badge variant="success"><span className="status-dot bg-emerald-500 text-emerald-100 mr-1" />Đã tiêm</Badge>;
                if (v.status === "overdue") return <Badge variant="danger"><span className="status-dot bg-rose-500 text-rose-100 mr-1" />Quá hạn</Badge>;
                return <Badge variant="warning"><span className="status-dot bg-amber-500 text-amber-100 mr-1" />Sắp tiêm</Badge>;
              },
            },
            {
              key: "actions",
              header: "Thao tác",
              align: "right",
              render: v => (
                <div className="flex gap-1.5 justify-end">
                  <button
                    onClick={() => showToast(`Đã đánh dấu tiêm hoàn thành cho ${v.pet}`, "success")}
                    className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer transition"
                  >
                    <Icon n="tick" size={12} /> Duyệt
                  </button>
                </div>
              ),
            },
          ]}
        />
      </motion.div>
    </div>
  );
};

export default AdminVaxPage;