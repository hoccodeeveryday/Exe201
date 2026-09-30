import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, AuthContext } from "@/app/providers/AuthProvider";
import { useContext } from "react";
import type { AuthContextType } from "@/app/providers/AuthProvider";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe("AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts logged-out on first visit (no localStorage)", () => {
    const { result } = renderHook(
      () => useContext(AuthContext) as AuthContextType,
      { wrapper }
    );
    // Sau khi xoá localStorage và visit lần đầu, user bắt buộc phải đăng nhập thủ công.
    // Luồng: Landing → "Mở Dashboard" → ProtectedRoute → redirect /login.
    expect(result.current.loggedIn).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("loginWithCredentials succeeds with valid admin account", () => {
    const { result } = renderHook(
      () => useContext(AuthContext) as AuthContextType,
      { wrapper }
    );
    let r: ReturnType<typeof result.current.loginWithCredentials>;
    act(() => {
      r = result.current.loginWithCredentials("admin@vetgen.vn", "admin123");
    });
    expect(r!.ok).toBe(true);
    expect(result.current.user?.role).toBe("admin");
    expect(result.current.loggedIn).toBe(true);
  });

  it("loginWithCredentials succeeds with valid user account and includes petOwner", () => {
    const { result } = renderHook(
      () => useContext(AuthContext) as AuthContextType,
      { wrapper }
    );
    let r: ReturnType<typeof result.current.loginWithCredentials>;
    act(() => {
      r = result.current.loginWithCredentials("maithao@vetgen.vn", "123456");
    });
    expect(r!.ok).toBe(true);
    if (r!.ok) {
      expect(r!.user.role).toBe("user");
      expect(r!.user.name).toBe("Nguyễn Hoàng Mai Thảo");
      expect(r!.user.petOwner).toBe("Nguyễn Hoàng Mai Thảo");
    }
  });

  it("loginWithCredentials fails with wrong password", () => {
    const { result } = renderHook(
      () => useContext(AuthContext) as AuthContextType,
      { wrapper }
    );
    // Bắt đầu ở trạng thái logged-out (không auto-login nữa).
    expect(result.current.loggedIn).toBe(false);
    let r: ReturnType<typeof result.current.loginWithCredentials>;
    act(() => {
      r = result.current.loginWithCredentials("admin@vetgen.vn", "wrong-password");
    });
    expect(r!.ok).toBe(false);
    if (!r!.ok) {
      expect(r!.error).toContain("Email hoặc mật khẩu");
    }
    expect(result.current.loggedIn).toBe(false);
  });

  it("logout clears the user", () => {
    const { result } = renderHook(
      () => useContext(AuthContext) as AuthContextType,
      { wrapper }
    );
    act(() => {
      result.current.loginWithCredentials("admin@vetgen.vn", "admin123");
    });
    expect(result.current.loggedIn).toBe(true);
    act(() => {
      result.current.logout();
    });
    expect(result.current.loggedIn).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("persists to localStorage", () => {
    const { result } = renderHook(
      () => useContext(AuthContext) as AuthContextType,
      { wrapper }
    );
    act(() => {
      result.current.loginWithCredentials("admin@vetgen.vn", "admin123");
    });
    const stored = localStorage.getItem("vetgen.auth");
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.email).toBe("admin@vetgen.vn");
    expect(parsed.role).toBe("admin");
  });
});