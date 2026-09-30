import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import AdminStatCard from "@/components/admin/AdminStatCard";
import DataTable from "@/components/admin/DataTable";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { DOCTORS } from "@/data/mock/doctors";
import { AdminAppointment } from "@/app/providers/AdminDataProvider";
import { useAdminData } from "@/hooks/useAdminData";
import { useToast } from "@/hooks/useToast";

type FilterTab = "all" | AdminAppointment["status"];

const tabs: { id: FilterTab; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "pending", label: "Chờ duyệt" },
  { id: "confirmed", label: "Đã xác nhận" },
  { id: "cancelled", label: "Đã hủy" },
];

const variantFor: Record<AdminAppointment["status"], "success" | "warning" | "danger"> = {
  confirmed: "success",
  pending: "warning",
  cancelled: "danger",
};

const labelFor: Record<AdminAppointment["status"], string> = {
  confirmed: "Đã xác nhận",
  pending: "Chờ duyệt",
  cancelled: "Đã hủy",
};

const AdminApptPage: React.FC = () => {
  const { appointments, confirmAppointment, cancelAppointment } = useAdminData();
  const { showToast } = useToast();
  const [tab, setTab] = useState<FilterTab>("all");

  const filtered = useMemo(
    () => (tab === "all" ? appointments : appointments.filter(a => a.status === tab)),
    [appointments, tab]
  );

  const handleConfirm = (a: AdminAppointment) => {
    confirmAppointment(a.id);
    showToast(`Đã xác nhận lịch hẹn của ${a.user}`, "success");
  };
  const handleCancel = (a: AdminAppointment) => {
    cancelAppointment(a.id);
    showToast(`Đã hủy lịch hẹn của ${a.user}`, "warning");
  };

  const stats = [
    { label: "Lịch hẹn hôm nay", value: 47, delta: 12.4, sparklineData: [28, 32, 38, 42, 40, 44, 47, 50, 47], icon: "cal", iconGradient: "from-indigo-500 to-purple-500", accentColor: "#6366F1" },
    { label: "Chờ duyệt", value: 8, delta: -3.2, sparklineData: [12, 11, 10, 9, 9, 8, 7, 7, 8], icon: "warn", iconGradient: "from-amber-500 to-orange-500", accentColor: "#F59E0B" },
    { label: "Đã xác nhận", value: 35, delta: 15.8, sparklineData: [20, 22, 24, 26, 28, 30, 32, 33, 35], icon: "tick", iconGradient: "from-emerald-500 to-teal-500", accentColor: "#10B981" },
    { label: "Đã hủy", value: 4, delta: -20.0, sparklineData: [8, 7, 6, 5, 5, 4, 4, 4, 4], icon: "x", iconGradient: "from-rose-500 to-rose-600", accentColor: "#F43F5E" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => <AdminStatCard key={s.label} {...s} />)}
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-admin rounded-2xl shadow-admin p-6">
        <div className="mb-5">
          <h3 className="text-base font-extrabold text-slate-900">Đội ngũ bác sĩ</h3>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">{DOCTORS.length} bác sĩ đang hoạt động trong hệ thống</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DOCTORS.map(d => (
            <div key={d.name} className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-indigo-200 hover:shadow-sm transition">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-extrabold text-white">
                {d.name.split(" ").slice(-2).join("")[0] || d.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-extrabold text-slate-900 truncate">{d.name}</div>
                <div className="text-xs text-slate-500 font-semibold">{d.spec}</div>
                <div className="text-xs text-amber-500 font-bold mt-0.5">⭐ {d.rating} ({d.reviews})</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-admin rounded-2xl shadow-admin p-6">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Lịch hẹn gần đây</h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Duyệt / hủy lịch hẹn của chủ nuôi</p>
          </div>
          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
            {tabs.map(t => {
              const count = t.id === "all" ? appointments.length : appointments.filter(a => a.status === t.id).length;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-3.5 py-1.5 text-xs font-extrabold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    active ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {t.label}
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    active ? "bg-indigo-100 text-indigo-600" : "bg-slate-200 text-slate-600"
                  }`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <DataTable<AdminAppointment>
          data={filtered}
          rowKey={a => a.id}
          searchKeys={["user", "pet", "doctor", "id"]}
          columns={[
            { key: "id", header: "Mã", render: a => <span className="text-slate-900 font-extrabold">{a.id}</span> },
            { key: "user", header: "Chủ nuôi", render: a => <span className="text-slate-700 font-semibold">{a.user}</span> },
            { key: "pet", header: "Thú cưng", render: a => <span className="text-slate-900 font-extrabold">{a.pet}</span> },
            { key: "doctor", header: "Bác sĩ", render: a => <span className="text-slate-600">{a.doctor}</span> },
            { key: "date", header: "Thời gian", render: a => <span className="text-slate-900 font-extrabold">{a.date}</span> },
            {
              key: "status",
              header: "Trạng thái",
              render: a => (
                <Badge variant={variantFor[a.status]}>
                  <span className={`status-dot ${
                    a.status === "confirmed" ? "bg-emerald-500 text-emerald-100" :
                    a.status === "pending" ? "bg-amber-500 text-amber-100" : "bg-rose-500 text-rose-100"
                  } mr-1`} />
                  {labelFor[a.status]}
                </Badge>
              ),
            },
            {
              key: "actions",
              header: "Thao tác",
              align: "right",
              render: a => (
                <>
                  {a.status === "pending" && (
                    <Button variant="outline" onClick={() => handleConfirm(a)} className="text-xs px-3 py-1.5 inline-flex items-center gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                      <Icon n="tick" size={12} /> Duyệt
                    </Button>
                  )}
                  {a.status === "confirmed" && (
                    <Button variant="ghost" onClick={() => handleCancel(a)} className="text-xs px-3 py-1.5 inline-flex items-center gap-1 text-rose-600 hover:bg-rose-50">
                      <Icon n="x" size={12} /> Hủy
                    </Button>
                  )}
                  {a.status === "cancelled" && (
                    <span className="text-xs text-slate-400 font-semibold">—</span>
                  )}
                </>
              ),
            },
          ]}
        />
      </motion.div>
    </div>
  );
};

export default AdminApptPage;