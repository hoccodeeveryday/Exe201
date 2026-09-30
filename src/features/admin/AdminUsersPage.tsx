import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import AdminStatCard from "@/components/admin/AdminStatCard";
import DataTable from "@/components/admin/DataTable";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { AdminUser } from "@/app/providers/AdminDataProvider";
import { useAdminData } from "@/hooks/useAdminData";
import { useToast } from "@/hooks/useToast";

const planColors: Record<AdminUser["plan"], "success" | "warning"> = {
  Premium: "success",
  Free: "warning",
};

const AdminUsersPage: React.FC = () => {
  const { users, toggleUserBlock } = useAdminData();
  const { showToast } = useToast();
  const [planFilter, setPlanFilter] = useState<"all" | AdminUser["plan"]>("all");

  const handleToggle = (u: AdminUser) => {
    toggleUserBlock(u.id);
    showToast(
      u.status === "active"
        ? `Đã khóa tài khoản ${u.name}`
        : `Đã mở khóa tài khoản ${u.name}`,
      u.status === "active" ? "warning" : "success"
    );
  };

  const filtered = useMemo(
    () => (planFilter === "all" ? users : users.filter(u => u.plan === planFilter)),
    [users, planFilter]
  );

  const stats = [
    { label: "Tổng người dùng", value: users.length, delta: 9.5, sparklineData: [120, 132, 145, 162, 158, 172, 188, 195, 200], icon: "profile", iconGradient: "from-indigo-500 to-purple-500", accentColor: "#6366F1" },
    { label: "Đang hoạt động", value: users.filter(u => u.status === "active").length, delta: 12.0, sparklineData: [88, 95, 102, 108, 115, 122, 128, 134, 140], icon: "tick", iconGradient: "from-emerald-500 to-teal-500", accentColor: "#10B981" },
    { label: "Đã khóa", value: users.filter(u => u.status === "blocked").length, delta: -15.2, sparklineData: [10, 9, 8, 7, 6, 7, 5, 4, 3], icon: "x", iconGradient: "from-rose-500 to-rose-600", accentColor: "#F43F5E" },
    { label: "Premium", value: users.filter(u => u.plan === "Premium").length, delta: 18.7, sparklineData: [42, 48, 55, 60, 64, 72, 78, 82, 88], icon: "vax", iconGradient: "from-amber-500 to-orange-500", accentColor: "#F59E0B" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => <AdminStatCard key={s.label} {...s} />)}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-admin rounded-2xl shadow-admin p-6"
      >
        <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Danh sách chủ nuôi</h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Tổng <span className="text-slate-900 font-extrabold">{users.length}</span> tài khoản ·{" "}
              <span className="text-emerald-600 font-extrabold">{users.filter(u => u.status === "active").length}</span> đang hoạt động
            </p>
          </div>
          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
            {(["all", "Premium", "Free"] as const).map(p => (
              <button
                key={p}
                onClick={() => setPlanFilter(p)}
                className={`px-3.5 py-1.5 text-xs font-extrabold rounded-lg transition cursor-pointer ${
                  planFilter === p
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {p === "all" ? "Tất cả" : p}
              </button>
            ))}
          </div>
        </div>

        <DataTable<AdminUser>
          data={filtered}
          rowKey={u => u.id}
          searchKeys={["name", "email", "id", "pet"]}
          columns={[
            {
              key: "name",
              header: "Người dùng",
              render: u => (
                <div className="flex items-center gap-3">
                  <Avatar size="sm">{u.name[0]}</Avatar>
                  <div>
                    <div className="font-extrabold text-slate-900">{u.name}</div>
                    <div className="text-[11px] text-slate-500 font-semibold">{u.id}</div>
                  </div>
                </div>
              ),
            },
            { key: "email", header: "Email", render: u => <span className="text-slate-600">{u.email}</span> },
            { key: "pet", header: "Thú cưng", render: u => <span className="text-slate-900 font-extrabold">{u.pet}</span> },
            {
              key: "plan",
              header: "Gói",
              render: u => <Badge variant={planColors[u.plan]}>{u.plan}</Badge>,
            },
            {
              key: "status",
              header: "Trạng thái",
              render: u => (
                <Badge variant={u.status === "active" ? "success" : "danger"}>
                  <span className={`status-dot ${u.status === "active" ? "bg-emerald-500 text-emerald-100" : "bg-rose-500 text-rose-100"} mr-1`} />
                  {u.status === "active" ? "Hoạt động" : "Đã khóa"}
                </Badge>
              ),
            },
            {
              key: "actions",
              header: "Thao tác",
              align: "right",
              render: u => (
                <Button
                  variant="ghost"
                  onClick={() => handleToggle(u)}
                  className={`text-xs px-3 py-1.5 inline-flex items-center gap-1.5 ${
                    u.status === "active" ? "text-rose-600 hover:bg-rose-50" : "text-emerald-600 hover:bg-emerald-50"
                  }`}
                >
                  <Icon n={u.status === "active" ? "x" : "tick"} size={13} />
                  {u.status === "active" ? "Khóa" : "Mở khóa"}
                </Button>
              ),
            },
          ]}
        />
      </motion.div>
    </div>
  );
};

export default AdminUsersPage;