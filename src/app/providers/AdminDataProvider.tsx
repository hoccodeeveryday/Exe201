import React, { createContext, useState, useCallback, useEffect } from "react";
import { POSTS } from "@/data/mock/posts";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  pet: string;
  plan: "Premium" | "Free";
  status: "active" | "blocked";
}

export interface AdminPost {
  id: string;
  author: string;
  badge: string;
  time: string;
  emoji: string;
  content: string;
  img: string;
  likes: number;
  comments: number;
  status: "approved" | "hidden" | "removed";
}

export interface AdminAppointment {
  id: string;
  user: string;
  pet: string;
  doctor: string;
  date: string;
  status: "confirmed" | "pending" | "cancelled";
}

interface AdminDataState {
  users: AdminUser[];
  posts: AdminPost[];
  appointments: AdminAppointment[];
}

export interface AdminDataContextType extends AdminDataState {
  toggleUserBlock: (id: string) => void;
  hidePost: (id: string) => void;
  restorePost: (id: string) => void;
  removePost: (id: string) => void;
  confirmAppointment: (id: string) => void;
  cancelAppointment: (id: string) => void;
  resetData: () => void;
}

const STORAGE_KEY = "vetgen.admin";

const INITIAL_USERS: AdminUser[] = [
  { id: "VG-001", name: "Yến Nhi", email: "yennhi@gmail.com", pet: "Bé Mít (Corgi)", plan: "Premium", status: "active" },
  { id: "VG-002", name: "Mai Anh", email: "maianh@gmail.com", pet: "Bông (Poodle)", plan: "Premium", status: "active" },
  { id: "VG-003", name: "Hoàng Nam", email: "hoangnam@gmail.com", pet: "Cang (Corgi)", plan: "Free", status: "active" },
  { id: "VG-004", name: "Thanh Thảo", email: "thanhthao@gmail.com", pet: "Pudding (Mèo Anh)", plan: "Premium", status: "active" },
  { id: "VG-005", name: "Minh Nhật", email: "minhnhat@gmail.com", pet: "Mochi (Mèo Ba Tư)", plan: "Free", status: "blocked" },
];

const INITIAL_APPOINTMENTS: AdminAppointment[] = [
  { id: "APT-001", user: "Yến Nhi", pet: "Bé Mít", doctor: "BS. Nguyễn Văn A", date: "24/07/2026 09:00", status: "confirmed" },
  { id: "APT-002", user: "Mai Anh", pet: "Bông", doctor: "BS. Trần Thị B", date: "24/07/2026 10:30", status: "pending" },
  { id: "APT-003", user: "Hoàng Nam", pet: "Cang", doctor: "BS. Lê Văn C", date: "25/07/2026 14:00", status: "confirmed" },
];

const INITIAL_POSTS: AdminPost[] = POSTS.map((p, i) => ({
  ...p,
  status: "approved" as const,
  id: `POST-${i + 1}`,
}));

export const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

const readPersisted = (): AdminDataState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdminDataState;
    if (!parsed || !parsed.users || !parsed.appointments) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AdminDataState>(() => {
    const persisted = readPersisted();
    if (persisted) return persisted;
    return {
      users: INITIAL_USERS,
      posts: INITIAL_POSTS,
      appointments: INITIAL_APPOINTMENTS,
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const toggleUserBlock = useCallback((id: string) => {
    setState(s => ({
      ...s,
      users: s.users.map(u => (u.id === id ? { ...u, status: u.status === "active" ? "blocked" : "active" } : u)),
    }));
  }, []);

  const hidePost = useCallback((id: string) => {
    setState(s => ({
      ...s,
      posts: s.posts.map(p => (p.id === id ? { ...p, status: "hidden" as const } : p)),
    }));
  }, []);

  const restorePost = useCallback((id: string) => {
    setState(s => ({
      ...s,
      posts: s.posts.map(p => (p.id === id ? { ...p, status: "approved" as const } : p)),
    }));
  }, []);

  const removePost = useCallback((id: string) => {
    setState(s => ({
      ...s,
      posts: s.posts.map(p => (p.id === id ? { ...p, status: "removed" as const } : p)),
    }));
  }, []);

  const confirmAppointment = useCallback((id: string) => {
    setState(s => ({
      ...s,
      appointments: s.appointments.map(a => (a.id === id ? { ...a, status: "confirmed" as const } : a)),
    }));
  }, []);

  const cancelAppointment = useCallback((id: string) => {
    setState(s => ({
      ...s,
      appointments: s.appointments.map(a => (a.id === id ? { ...a, status: "cancelled" as const } : a)),
    }));
  }, []);

  const resetData = useCallback(() => {
    setState({
      users: INITIAL_USERS,
      posts: INITIAL_POSTS,
      appointments: INITIAL_APPOINTMENTS,
    });
  }, []);

  return (
    <AdminDataContext.Provider
      value={{
        ...state,
        toggleUserBlock,
        hidePost,
        restorePost,
        removePost,
        confirmAppointment,
        cancelAppointment,
        resetData,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};