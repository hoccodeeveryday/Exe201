import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { getHomePathByRole } from "@/utils/routing";

type Mode = "login" | "register";

interface LocationState {
  from?: { pathname?: string };
  /** Được Landing truyền vào: true = mở mode đăng ký, false/undefined = login. */
  register?: boolean;
}

/**
 * Trang Đăng nhập / Đăng ký riêng (full-page).
 * - Layout chia 2 cột: bên trái là brand + illustration; bên phải là form.
 * - Mobile: collapse cột trái xuống thành banner nhỏ.
 * - User tự nhập email + mật khẩu, không có phím tắt.
 */
const LoginPage: React.FC = () => {
  const { loginWithCredentials, registerWithCredentials, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState<"dog" | "cat" | "other">("dog");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Nếu đã login → redirect về dashboard (vd user vô `/login` khi đã đăng nhập)
  useEffect(() => {
    if (user) {
      const from = (location.state as LocationState | null)?.from?.pathname;
      navigate(from && from !== "/login" ? from : getHomePathByRole(user.role), { replace: true });
    }
  }, [user, navigate, location.state]);

  // Đọc query: nếu Landing truyền `register: true` → mở tab Đăng ký.
  useEffect(() => {
    const state = location.state as LocationState | null;
    if (state?.register) {
      setMode("register");
      // Xoá state để F5 không revert mode
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "register") {
      if (!name.trim() || !petName.trim()) {
        setError("Vui lòng điền đầy đủ họ tên và tên thú cưng.");
        return;
      }
    }
    if (!email.trim() || !password) {
      setError("Vui lòng điền email và mật khẩu.");
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 700));

    if (mode === "register") {
      const result = registerWithCredentials({ name, email, password, petName });
      setLoading(false);
      if (!result.ok) {
        setError(result.error);
        showToast(result.error, "error");
        return;
      }
      showToast(`Đăng ký thành công! Chào mừng ${name} 🐾`, "success");
      navigate("/dashboard/overview", { replace: true });
      return;
    }

    const result = loginWithCredentials(email, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      showToast(result.error, "error");
      return;
    }
    // Dùng user vừa trả về (closure `user` còn stale trong batched updates).
    const role = result.user.role;
    showToast(role === "admin" ? "Chào mừng Admin quay lại! 🛡️" : "Đăng nhập thành công! 🐾", "success");
    const from = (location.state as LocationState | null)?.from?.pathname;
    navigate(from && from !== "/login" ? from : getHomePathByRole(role), { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 relative overflow-hidden">
      {/* Decorative blobs nền */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <motion.div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-rose-300 to-pink-400 opacity-30 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-300 to-orange-400 opacity-25 blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-[280px] h-[280px] rounded-full bg-gradient-to-br from-violet-300 to-fuchsia-300 opacity-20 blur-3xl"
          animate={{ x: [0, 20, -20, 0], y: [0, 15, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Cột trái: brand */}
      <div className="lg:flex-[1.1] relative z-10 hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary via-rose-400 to-pink-500 text-white overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-white/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-20 right-10 w-96 h-96 rounded-full bg-white/15 blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <Link to="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white text-xs font-bold uppercase tracking-widest">
          ← Về trang chủ
        </Link>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-7xl font-extrabold tracking-tight"
          >
            VetGen<span className="text-amber-300">.</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-3xl xl:text-4xl font-extrabold leading-tight"
          >
            Chăm sóc thú cưng<br />
            <span className="text-amber-200">thông minh hơn,</span><br />
            yêu thương nhiều hơn.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm xl:text-base text-white/85 leading-relaxed max-w-md"
          >
            AI chẩn đoán, nhắc lịch tiêm, đặt khám, cộng đồng yêu pet — tất cả trong một nơi.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="grid grid-cols-3 gap-4 pt-4 max-w-md"
          >
            {[
              { value: "12k+", label: "Pet hạnh phúc" },
              { value: "48", label: "Bác sĩ" },
              { value: "98%", label: "Hài lòng" },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 px-3 py-3 text-center">
                <div className="text-2xl font-extrabold text-amber-200">{s.value}</div>
                <div className="text-[10px] uppercase tracking-wider font-bold opacity-90 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="flex items-center gap-3 text-xs text-white/80 font-semibold">
          <span>© 2026 VetGen</span>
          <span className="opacity-50">·</span>
          <span>Được yêu thương bởi cộng đồng thú cưng Việt Nam</span>
        </div>
      </div>

      {/* Cột phải: form */}
      <div className="flex-1 lg:flex-1 flex items-center justify-center p-6 sm:p-10 relative z-10">
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-primary/10 border border-white/60 p-7 sm:p-9 space-y-6">
            {/* Mobile back link */}
            <Link to="/" className="lg:hidden text-xs text-muted font-bold inline-flex items-center gap-1 hover:text-primary">
              ← Về trang chủ
            </Link>

            <div className="text-center space-y-2">
              <motion.span
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="inline-block text-5xl"
              >
                {mode === "login" ? "🐾" : "✨"}
              </motion.span>
              <h2 className="text-2xl font-extrabold text-darkbg">
                {mode === "login" ? "Chào mừng quay lại!" : "Tạo tài khoản mới"}
              </h2>
              <p className="text-sm text-muted font-semibold">
                {mode === "login"
                  ? "Đăng nhập để tiếp tục chăm sóc Boss 💕"
                  : "Bắt đầu hành trình chăm Boss thông minh"}
              </p>
            </div>

            {/* Form đăng nhập / đăng ký — user tự nhập email & mật khẩu */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="popLayout">
                {mode === "register" && (
                  <motion.div
                    key="register-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <Input
                      label="Họ và tên"
                      placeholder="Nguyễn Văn A"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                    <Input
                      label="Tên thú cưng"
                      placeholder="Bé Mít, Mimi, ..."
                      value={petName}
                      onChange={e => setPetName(e.target.value)}
                    />
                    <div>
                      <label className="block text-xs font-bold text-darkbg mb-2 uppercase tracking-wide">
                        Loại thú cưng
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: "dog", emoji: "🐶", label: "Chó" },
                          { value: "cat", emoji: "🐱", label: "Mèo" },
                          { value: "other", emoji: "🐰", label: "Khác" },
                        ].map(opt => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setPetType(opt.value as typeof petType)}
                            className={`p-3 rounded-xl border-2 transition-all ${
                              petType === opt.value
                                ? "border-primary bg-primary-light"
                                : "border-gray-200 bg-white hover:border-primary/40"
                            }`}
                          >
                            <div className="text-2xl">{opt.emoji}</div>
                            <div className="text-xs font-bold mt-1">{opt.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Input
                label="Email"
                type="email"
                placeholder="email@vetgen.vn"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
              <div className="relative">
                <Input
                  label="Mật khẩu"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-10 text-muted hover:text-primary p-1 cursor-pointer"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  tabIndex={-1}
                >
                  <span className="text-lg">{showPassword ? "🙈" : "👀"}</span>
                </button>
              </div>

              {mode === "login" && (
                <div className="flex items-center justify-between text-xs font-bold">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded accent-primary" />
                    <span className="text-muted">Ghi nhớ</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => showToast("Liên hệ CSKH để khôi phục mật khẩu nhé 🐾", "info")}
                    className="text-primary hover:underline cursor-pointer"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-bold flex items-start gap-2"
                >
                  <span>⚠</span>
                  <span>{error}</span>
                </motion.div>
              )}

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full py-3.5 text-base shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-shadow"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      ⚡
                    </motion.span>
                    Đang xử lý...
                  </span>
                ) : mode === "login" ? (
                  "Đăng nhập ngay →"
                ) : (
                  "Tạo tài khoản ✨"
                )}
              </Button>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setError(null);
                }}
                className="text-xs text-muted font-bold hover:text-primary cursor-pointer"
              >
                {mode === "login" ? (
                  <>
                    Chưa có tài khoản?{" "}
                    <span className="text-primary font-extrabold">Đăng ký ngay</span>
                  </>
                ) : (
                  <>
                    Đã có tài khoản?{" "}
                    <span className="text-primary font-extrabold">Đăng nhập</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-center text-[10px] text-muted border-t border-gray-100 pt-4">
              Bảo mật bởi <span className="font-extrabold text-darkbg">VetGen Secure 🔒</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
