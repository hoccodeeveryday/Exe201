import React, { createContext, useState, useEffect, useCallback } from "react";
import { User } from "@/types";
import { DEMO_ACCOUNTS } from "@/data/mock/accounts";

export interface AuthContextType {
  loggedIn: boolean;
  user: User | null;
  /** Đăng nhập bằng cặp email/password cứng (xác thực với DEMO_ACCOUNTS) */
  loginWithCredentials: (
    email: string,
    password: string
  ) => { ok: true; user: User } | { ok: false; error: string };
  /** Đăng ký user mới: lưu vào memory + localStorage, mặc định petOwner = name. */
  registerWithCredentials: (input: {
    name: string;
    email: string;
    password: string;
    petName?: string;
  }) => { ok: true; user: User } | { ok: false; error: string };
  /** Backward-compat: đăng nhập nhanh với account user mặc định */
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "vetgen.auth";

const readPersisted = (): User | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as User;
    if (!parsed || typeof parsed !== "object" || !parsed.email) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => readPersisted());

  // Persist khi user đổi
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const loginWithCredentials = useCallback(
    (email: string, password: string) => {
      const found = DEMO_ACCOUNTS.find(
        a => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
      );
      if (!found) {
        return { ok: false as const, error: "Email hoặc mật khẩu không đúng" };
      }
      const nextUser: User = {
        name: found.name,
        email: found.email,
        avatar: found.avatar,
        role: found.role,
        petOwner: found.petOwner,
      };
      setUser(nextUser);
      return { ok: true as const, user: nextUser };
    },
    []
  );

  const login = useCallback(() => {
    const fallback = DEMO_ACCOUNTS.find(a => a.role === "user");
    if (fallback) {
      setUser({
        name: fallback.name,
        email: fallback.email,
        avatar: fallback.avatar,
        role: fallback.role,
        petOwner: fallback.petOwner,
      });
    }
  }, []);

  /**
   * Đăng ký user mới — lưu vào bộ nhớ (không persist password, chỉ nhận diện qua email).
   * Mặc định petOwner = name (1 user = 1 pet chính trong demo) để tránh empty state.
   */
  const registerWithCredentials = useCallback(
    (input: { name: string; email: string; password: string; petName?: string }) => {
      const name = input.name.trim();
      const email = input.email.trim().toLowerCase();
      if (!name || !email || !input.password) {
        return { ok: false as const, error: "Vui lòng điền đầy đủ thông tin" };
      }
      if (input.password.length < 6) {
        return { ok: false as const, error: "Mật khẩu tối thiểu 6 ký tự" };
      }
      const exists =
        DEMO_ACCOUNTS.some(a => a.email.toLowerCase() === email) ||
        (() => {
          try {
            const raw = localStorage.getItem("vetgen.registered");
            if (!raw) return false;
            const list = JSON.parse(raw) as Array<{ email?: string }>;
            return Array.isArray(list) && list.some(u => (u.email ?? "").toLowerCase() === email);
          } catch {
            return false;
          }
        })();
      if (exists) {
        return { ok: false as const, error: "Email đã được sử dụng" };
      }

      const avatar = name.trim().charAt(0).toUpperCase();
      const nextUser: User = {
        name,
        email,
        avatar,
        role: "user",
        petOwner: input.petName?.trim() || name,
      };

      // Lưu danh sách user đã đăng ký vào localStorage riêng (chỉ thông tin cơ bản).
      try {
        const raw = localStorage.getItem("vetgen.registered");
        const list = raw ? (JSON.parse(raw) as Array<{ name: string; email: string }>) : [];
        list.push({ name, email });
        localStorage.setItem("vetgen.registered", JSON.stringify(list));
      } catch {
        // Bỏ qua nếu localStorage lỗi — vẫn cho user vào app session.
      }

      setUser(nextUser);
      return { ok: true as const, user: nextUser };
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const loggedIn = !!user;

  return (
    <AuthContext.Provider value={{ loggedIn, user, login, loginWithCredentials, registerWithCredentials, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
