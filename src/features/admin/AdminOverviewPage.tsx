import React, { useMemo } from "react";
import { motion } from "framer-motion";
import AdminStatCard from "@/components/admin/AdminStatCard";
import ActivityFeed from "@/components/admin/ActivityFeed";
import AreaChart from "@/components/charts/AreaChart";
import BarChart from "@/components/charts/BarChart";
import DonutChart from "@/components/charts/DonutChart";
import LineChart from "@/components/charts/LineChart";
import {
  REVENUE_12M,
  NEW_USERS_12M,
  APPOINTMENTS_12M,
  APPTS_BY_DAY,
  BREED_DIST,
  TOP_DOCTORS,
  RECENT_ACTIVITY,
  SYSTEM_HEALTH,
  SYSTEM_ALERTS,
} from "@/data/mock/stats";
import { useAdminData } from "@/hooks/useAdminData";

const Section: React.FC<{ title: string; subtitle?: string; right?: React.ReactNode; children: React.ReactNode }> = ({
  title,
  subtitle,
  right,
  children,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-admin rounded-2xl shadow-admin p-6"
  >
    <div className="flex items-start justify-between mb-5">
      <div>
        <h3 className="text-base font-extrabold text-slate-900">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 font-semibold mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </div>
    {children}
  </motion.div>
);

const StatusDot: React.FC<{ status: "operational" | "degraded" | "down" }> = ({ status }) => {
  const map = {
    operational: "bg-emerald-500 text-emerald-100",
    degraded: "bg-amber-500 text-amber-100",
    down: "bg-rose-500 text-rose-100",
  };
  return <span className={`status-dot ${map[status]}`} />;
};

const AdminOverviewPage: React.FC = () => {
  const { users, appointments, posts } = useAdminData();

  const stats = useMemo(() => {
    const activeUsers = users.filter(u => u.status === "active").length;
    const todayAppts = appointments.filter(a => a.status !== "cancelled").length;
    const approvedPosts = posts.filter(p => p.status === "approved").length;
    void activeUsers; void todayAppts; void approvedPosts;
    return [
      {
        label: "Doanh thu tháng", value: "96.4 tr",
        delta: 12.4,
        sparklineData: REVENUE_12M.slice(-9).map(d => d.value),
        icon: "vax",
        iconGradient: "from-indigo-500 to-purple-500",
        accentColor: "#6366F1",
      },
      {
        label: "Người dùng mới", value: "425",
        delta: 9.5,
        sparklineData: NEW_USERS_12M.slice(-9).map(d => d.value),
        icon: "profile",
        iconGradient: "from-pink-500 to-rose-500",
        accentColor: "#EC4899",
      },
      {
        label: "Lịch hẹn hôm nay", value: "47",
        delta: 8.1,
        sparklineData: [12, 14, 18, 22, 28, 32, 38, 41, 47],
        icon: "cal",
        iconGradient: "from-amber-500 to-orange-500",
        accentColor: "#F59E0B",
      },
      {
        label: "Bài viết duyệt", value: "248",
        delta: -1.2,
        sparklineData: [220, 232, 240, 245, 238, 242, 246, 252, 248],
        icon: "community",
        iconGradient: "from-emerald-500 to-teal-500",
        accentColor: "#10B981",
      },
    ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <AdminStatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Revenue area chart (chiếm 2 cột) + Appointment bar chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Section
            title="Doanh thu & Người dùng mới"
            subtitle="12 tháng gần nhất (triệu VNĐ / số user)"
            right={
              <div className="flex gap-2 text-xs">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 font-extrabold">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  Doanh thu
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 font-extrabold">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Users
                </span>
              </div>
            }
          >
            <LineChart
              data={REVENUE_12M.map(d => ({ label: d.label, value: d.value }))}
              data2={NEW_USERS_12M.map(d => ({ label: d.label, value: d.value / 4 }))}
              height={260}
            />
          </Section>
        </div>

        <Section title="Lịch hẹn theo ngày" subtitle="Trong tuần này">
          <BarChart data={APPTS_BY_DAY} height={260} color="#8B5CF6" />
        </Section>
      </div>

      {/* Donut + Top doctors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Section title="Phân bố giống loài" subtitle="Tổng số thú cưng đang hoạt động">
          <DonutChart data={BREED_DIST} size={170} thickness={26} centerValue="1.2k" centerLabel="tổng thú cưng" />
        </Section>

        <div className="lg:col-span-2">
          <Section title="Top bác sĩ tháng này" subtitle="Xếp hạng theo doanh thu">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Bác sĩ</th>
                  <th>Chuyên khoa</th>
                  <th className="text-right">Lịch hẹn</th>
                  <th>Rating</th>
                  <th className="text-right">Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {TOP_DOCTORS.map((d, i) => (
                  <tr key={d.name}>
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-[10px] font-extrabold flex items-center justify-center">
                          #{i + 1}
                        </span>
                        <span className="text-slate-900 font-extrabold">{d.name}</span>
                      </div>
                    </td>
                    <td className="text-slate-500 font-semibold">{d.spec}</td>
                    <td className="text-right">
                      <span className="px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-extrabold">
                        {d.appts}
                      </span>
                    </td>
                    <td className="text-amber-500 font-bold">⭐ {d.rating}</td>
                    <td className="text-right text-slate-900 font-extrabold">{d.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        </div>
      </div>

      {/* Activity + System health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Section title="Hoạt động gần đây" subtitle="Cập nhật mới nhất trong hệ thống">
            <ActivityFeed items={RECENT_ACTIVITY} />
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Sức khỏe hệ thống" subtitle="Uptime trong 30 ngày qua">
            <ul className="space-y-2.5 text-sm">
              {SYSTEM_HEALTH.map(s => (
                <li key={s.name} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                  <div className="flex items-center">
                    <StatusDot status={s.status} />
                    <span className="text-slate-700 font-semibold">{s.name}</span>
                  </div>
                  <span className={`text-xs font-extrabold ${
                    s.status === "operational" ? "text-emerald-600" :
                    s.status === "degraded" ? "text-amber-600" : "text-rose-600"
                  }`}>{s.uptime}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Cảnh báo">
            <ul className="space-y-2">
              {SYSTEM_ALERTS.map((a, i) => (
                <li
                  key={i}
                  className={`flex gap-2 p-3 rounded-xl text-xs font-semibold ${
                    a.severity === "warning"
                      ? "bg-amber-50 text-amber-900 border border-amber-100"
                      : "bg-indigo-50 text-indigo-900 border border-indigo-100"
                  }`}
                >
                  <span className="text-base leading-none">{a.severity === "warning" ? "⚠" : "ℹ"}</span>
                  {a.text}
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>

      {/* Area chart standalone - thống kê lịch hẹn 12 tháng */}
      <Section
        title="Tăng trưởng lịch hẹn"
        subtitle="Tổng lịch hẹn được đặt qua 12 tháng"
        right={<div className="text-xs font-bold text-slate-500">So với cùng kỳ: <span className="text-emerald-600">+34.2%</span></div>}
      >
        <AreaChart
          data={APPOINTMENTS_12M}
          height={240}
          stroke="#8B5CF6"
          gradientFrom="rgba(139,92,246,0.40)"
          gradientTo="rgba(139,92,246,0)"
        />
      </Section>
    </div>
  );
};

export default AdminOverviewPage;