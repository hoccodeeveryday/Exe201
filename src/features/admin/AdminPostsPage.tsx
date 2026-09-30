import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import DataTable from "@/components/admin/DataTable";
import AdminStatCard from "@/components/admin/AdminStatCard";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { AdminPost } from "@/app/providers/AdminDataProvider";
import { useAdminData } from "@/hooks/useAdminData";
import { useToast } from "@/hooks/useToast";

type FilterTab = "all" | AdminPost["status"];

const tabs: { id: FilterTab; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "approved", label: "Đã duyệt" },
  { id: "hidden", label: "Đã ẩn" },
  { id: "removed", label: "Đã xóa" },
];

const variantFor: Record<AdminPost["status"], { tone: "success" | "warning" | "danger"; label: string }> = {
  approved: { tone: "success", label: "Đã duyệt" },
  hidden: { tone: "warning", label: "Đã ẩn" },
  removed: { tone: "danger", label: "Đã xóa" },
};

const AdminPostsPage: React.FC = () => {
  const { posts, hidePost, restorePost, removePost } = useAdminData();
  const { showToast } = useToast();
  const [tab, setTab] = useState<FilterTab>("all");

  const filtered = useMemo(
    () => (tab === "all" ? posts : posts.filter(p => p.status === tab)),
    [posts, tab]
  );

  const stats = [
    { label: "Tổng bài viết", value: posts.length, delta: 14.3, sparklineData: [120, 142, 158, 168, 172, 188, 195, 210, 232], icon: "community", iconGradient: "from-indigo-500 to-purple-500", accentColor: "#6366F1" },
    { label: "Đã duyệt", value: posts.filter(p => p.status === "approved").length, delta: 18.2, sparklineData: [98, 102, 110, 118, 124, 132, 138, 145, 152], icon: "tick", iconGradient: "from-emerald-500 to-teal-500", accentColor: "#10B981" },
    { label: "Đã ẩn", value: posts.filter(p => p.status === "hidden").length, delta: -25.0, sparklineData: [10, 9, 8, 7, 6, 5, 5, 4, 3], icon: "warn", iconGradient: "from-amber-500 to-orange-500", accentColor: "#F59E0B" },
    { label: "Báo cáo chờ xử lý", value: 3, delta: 0, sparklineData: [5, 4, 6, 5, 3, 4, 3, 5, 3], icon: "x", iconGradient: "from-rose-500 to-rose-600", accentColor: "#F43F5E" },
  ];

  const handleHide = (p: AdminPost) => {
    hidePost(p.id);
    showToast(`Đã ẩn bài viết của ${p.author}`, "warning");
  };
  const handleRestore = (p: AdminPost) => {
    restorePost(p.id);
    showToast(`Đã khôi phục bài viết của ${p.author}`, "success");
  };
  const handleRemove = (p: AdminPost) => {
    removePost(p.id);
    showToast(`Đã xóa vĩnh viễn bài viết của ${p.author}`, "error");
  };

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
            <h3 className="text-base font-extrabold text-slate-900">Bài viết cộng đồng</h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Kiểm duyệt nội dung theo chính sách của VetGen
            </p>
          </div>
          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
            {tabs.map(t => {
              const count = t.id === "all" ? posts.length : posts.filter(p => p.status === t.id).length;
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

        <DataTable<AdminPost>
          data={filtered}
          rowKey={p => p.id}
          searchKeys={["author", "content", "badge"]}
          columns={[
            {
              key: "author",
              header: "Tác giả",
              width: "20%",
              render: p => (
                <div className="flex items-center gap-3">
                  <Avatar size="sm">{p.author[0]}</Avatar>
                  <div>
                    <div className="font-extrabold text-slate-900">{p.author}</div>
                    <div className="text-[11px] text-slate-500 font-semibold">{p.badge}</div>
                  </div>
                </div>
              ),
            },
            {
              key: "content",
              header: "Nội dung",
              render: p => (
                <div className={`text-sm leading-relaxed ${p.status === "hidden" ? "text-slate-400 italic" : "text-slate-700"}`}>
                  {p.content.length > 80 ? p.content.slice(0, 80) + "..." : p.content}
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400 font-semibold">
                    <span>❤️ {p.likes}</span>
                    <span>💬 {p.comments}</span>
                    <span>🕐 {p.time}</span>
                  </div>
                </div>
              ),
            },
            {
              key: "status",
              header: "Trạng thái",
              render: p => <Badge variant={variantFor[p.status].tone}>{variantFor[p.status].label}</Badge>,
            },
            {
              key: "actions",
              header: "Thao tác",
              align: "right",
              render: p => (
                <div className="flex gap-1.5 justify-end">
                  {p.status === "approved" && (
                    <Button variant="outline" onClick={() => handleHide(p)} className="text-xs px-2.5 py-1.5 inline-flex items-center gap-1">
                      <Icon n="warn" size={12} /> Ẩn
                    </Button>
                  )}
                  {p.status === "hidden" && (
                    <Button variant="outline" onClick={() => handleRestore(p)} className="text-xs px-2.5 py-1.5 inline-flex items-center gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                      <Icon n="tick" size={12} /> Khôi phục
                    </Button>
                  )}
                  <Button variant="ghost" onClick={() => handleRemove(p)} className="text-xs px-2.5 py-1.5 inline-flex items-center gap-1 text-rose-600 hover:bg-rose-50">
                    <Icon n="x" size={12} /> Xóa
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </motion.div>
    </div>
  );
};

export default AdminPostsPage;