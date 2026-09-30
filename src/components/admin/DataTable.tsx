import React, { useState, useMemo } from "react";
import Icon from "@/components/ui/Icon";

interface Column<T> {
  key: keyof T | string;
  header: string;
  align?: "left" | "right" | "center";
  width?: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  pageSize?: number;
  emptyMessage?: string;
  rowKey: (row: T) => string;
}

function DataTable<T extends object>({
  data,
  columns,
  searchable = true,
  searchKeys,
  pageSize = 8,
  emptyMessage = "Không có dữ liệu",
  rowKey,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    const q = query.toLowerCase();
    return data.filter(row => {
      const keys = (searchKeys ?? (Object.keys(row) as (keyof T)[]));
      return keys.some(k => String((row as Record<string, unknown>)[k as string] ?? "").toLowerCase().includes(q));
    });
  }, [query, data, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return (
    <div>
      {searchable && (
        <div className="relative mb-4 max-w-sm">
          <Icon n="ai" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm kiếm..."
            className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-700 placeholder-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition"
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map(c => (
                <th key={String(c.key)} className={c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : ""} style={c.width ? { width: c.width } : undefined}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center text-slate-400 py-10 text-sm font-semibold">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paged.map(row => (
                <tr key={rowKey(row)}>
                  {columns.map(c => (
                    <td
                      key={String(c.key)}
                      className={c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : ""}
                    >
                      {c.render ? c.render(row) : ((row as Record<string, unknown>)[c.key as string] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > pageSize && (
        <div className="flex items-center justify-between mt-4 text-xs">
          <div className="text-slate-500 font-semibold">
            Hiển thị <span className="text-slate-900 font-extrabold">{start + 1}</span> - <span className="text-slate-900 font-extrabold">{Math.min(start + pageSize, filtered.length)}</span> / {filtered.length}
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold"
            >
              ← Trước
            </button>
            <div className="flex items-center px-3 text-slate-600 font-semibold">
              Trang {safePage} / {totalPages}
            </div>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold"
            >
              Sau →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;