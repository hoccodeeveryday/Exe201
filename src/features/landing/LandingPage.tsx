import React, { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { TESTIMONIALS } from "@/data/mock/testimonials";
import { DEMO_ACCOUNTS } from "@/data/mock/accounts";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { getHomePathByRole, getHomeLabelByRole } from "@/utils/routing";

const STATS = [
  { value: "12k+", label: "Thú cưng hạnh phúc", icon: "🐾" },
  { value: "48", label: "Bác sĩ thú y", icon: "👨‍⚕️" },
  { value: "98%", label: "Hài lòng", icon: "⭐" },
  { value: "24/7", label: "Hỗ trợ AI", icon: "🤖" },
];

const SERVICES = [
  { icon: "🧠", title: "AI Chẩn đoán", desc: "Phân tích triệu chứng bằng AI trong 30 giây", gradient: "from-rose-400 to-pink-500" },
  { icon: "💉", title: "Tiêm chủng thông minh", desc: "Tự động nhắc lịch tiêm, theo dõi lịch sử", gradient: "from-violet-400 to-purple-500" },
  { icon: "📅", title: "Đặt lịch dễ dàng", desc: "Chọn bác sĩ, khung giờ chỉ với 2 chạm", gradient: "from-amber-400 to-orange-500" },
  { icon: "👥", title: "Cộng đồng thú cưng", desc: "Chia sẻ, học hỏi cùng cộng đồng yêu pet", gradient: "from-emerald-400 to-teal-500" },
  { icon: "📊", title: "Theo dõi sức khỏe", desc: "Biểu đồ tăng trưởng, cân nặng, vắc-xin", gradient: "from-cyan-400 to-blue-500" },
  { icon: "🛒", title: "Mua sắm thú y", desc: "Thức ăn, phụ kiện chính hãng giao tận nhà", gradient: "from-pink-400 to-rose-500" },
];

const LandingPage: React.FC = () => {
  const { user, loginWithCredentials } = useAuth();
  const navigate = useNavigate();
  const [autoLogging, setAutoLogging] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();
  const yBlob1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const yBlob2 = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const handleLoginSuccess = (role: "admin" | "user") => {
    navigate(getHomePathByRole(role));
  };

  const handleOpenAuth = (register: boolean) => {
    navigate("/login", { state: { register } });
  };

  const handleOpenDashboard = () => {
    // User chưa đăng nhập → đưa tới trang /login riêng.
    // Nếu đã có session (vd từ tab khác), vào thẳng dashboard theo role.
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/dashboard/overview" } } });
      return;
    }
    navigate(getHomePathByRole(user.role));
  };

  /**
   * 1-click login từ grid demo: KHÔNG qua modal, login trực tiếp rồi điều hướng.
   * Tránh UX 2 bước (mở modal + bấm đăng nhập) cho demo.
   */
  const handleQuickLogin = (acc: typeof DEMO_ACCOUNTS[number]) => {
    setAutoLogging(acc.email);
    const result = loginWithCredentials(acc.email, acc.password);
    setAutoLogging(null);
    if (!result.ok) return;
    setTimeout(() => handleLoginSuccess(acc.role), 50);
  };

  return (
    <div className="min-h-screen bg-mesh text-darkbg overflow-hidden">
      {/* Nav */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex items-center justify-between px-6 md:px-12 py-4 sticky top-0 z-50 glass-cosmic border-b border-white/40"
      >
        <div className="flex items-center gap-2 select-none">
          <motion.span
            whileHover={{ rotate: -12, scale: 1.15 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-3xl cursor-pointer animate-pet-bounce"
          >
            🐾
          </motion.span>
          <span className="font-extrabold text-2xl text-gradient">VetGen</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["Trang chủ", "Dịch vụ", "Bác sĩ", "Cộng đồng", "Về chúng tôi"].map(l => (
            <button
              key={l}
              type="button"
              className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors cursor-pointer outline-none"
            >
              {l}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {user ? (
            <Button
              variant="primary"
              onClick={handleOpenDashboard}
              className={
                user.role === "admin"
                  ? "!bg-gradient-to-r !from-indigo-600 !to-purple-600 !shadow-lg"
                  : ""
              }
            >
              {user.role === "admin" ? "🛡️ " : ""}{getHomeLabelByRole(user.role)} →
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => handleOpenAuth(false)}>Đăng nhập</Button>
              <Button variant="primary" onClick={() => handleOpenAuth(true)} className="btn-rainbow">
                ✨ Đăng ký miễn phí
              </Button>
            </>
          )}
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative pt-16 md:pt-24 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Animated background blobs */}
        <motion.div
          style={{ y: yBlob1 }}
          className="absolute top-[10%] -right-32 w-[34rem] h-[34rem] bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl pointer-events-none animate-blob-morph"
        />
        <motion.div
          style={{ y: yBlob2, animationDelay: "3s" }}
          className="absolute top-[20%] -left-32 w-96 h-96 bg-gradient-to-br from-violet-300/30 to-transparent rounded-full blur-3xl pointer-events-none animate-blob-morph"
        />
        <motion.div
          style={{ animationDelay: "6s" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] bg-gradient-to-br from-pink-200/20 to-transparent rounded-full blur-3xl pointer-events-none animate-blob-morph"
        />
        {/* Floating pet emojis */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[8%] left-[8%] text-6xl pointer-events-none select-none hidden md:block drop-shadow-2xl"
        >🐶</motion.div>
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [2, -2, 2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[20%] right-[6%] text-5xl pointer-events-none select-none hidden md:block drop-shadow-2xl"
        >🐱</motion.div>
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[20%] left-[12%] text-5xl pointer-events-none select-none hidden md:block drop-shadow-2xl"
        >🐰</motion.div>
        <motion.div
          animate={{ y: [0, 10, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute bottom-[35%] right-[12%] text-5xl pointer-events-none select-none hidden md:block drop-shadow-2xl"
        >🦜</motion.div>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative z-20 mb-10 md:mb-12 flex justify-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary-light to-amber-50 border border-primary/30 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-xs font-extrabold tracking-wider uppercase text-primary">
              🚀 Trợ lý sức khỏe thú cưng AI thế hệ mới
            </span>
          </span>
        </motion.div>

        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex-1 space-y-7 relative z-10 max-w-2xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] text-darkbg tracking-tight">
            Chăm sóc{" "}
            <span className="text-gradient-conic inline-block">
              thú cưng
            </span>
            <br />
            <span className="text-4xl md:text-6xl">thông minh hơn,</span>
            <br />
            <span className="text-gradient-rainbow">yêu thương hơn.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium max-w-xl">
            Nền tảng <strong className="text-primary">AI-first</strong> giúp bạn chăm sóc thú cưng toàn diện — từ chẩn đoán bệnh, theo dõi sức khỏe, đến kết nối bác sĩ thú y 24/7.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            {user ? (
              <Button
                variant="primary"
                onClick={handleOpenDashboard}
                className="px-7 py-3.5 text-base btn-glow-pink"
              >
                {getHomeLabelByRole(user.role)} →
              </Button>
            ) : (
              <>
                <Button variant="primary" onClick={() => handleOpenAuth(true)} className="px-7 py-3.5 text-base btn-glow-pink">
                  ✨ Bắt đầu miễn phí
                </Button>
                <Button variant="outline" onClick={() => handleOpenAuth(false)} className="px-7 py-3.5 text-base">
                  🛡️ Tôi là Admin
                </Button>
              </>
            )}
          </div>

          {/* Trust indicators */}
          <div className="flex items-center gap-6 pt-4 text-xs font-semibold text-muted">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-500 text-base">✓</span> Không cần thẻ tín dụng
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-500 text-base">✓</span> Dùng thử 30 ngày
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-500 text-base">✓</span> Hỗ trợ 24/7
            </div>
          </div>
        </motion.div>

        {/* Hero right - Pet card with floating */}
        <motion.div
          initial={{ x: 40, opacity: 0, scale: 0.95 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex-1 relative hidden md:flex items-center justify-center"
        >
          <PetHeroVisual />
        </motion.div>
      </section>

      {/* Stats marquee */}
      <section className="py-8 overflow-hidden bg-gradient-to-r from-primary/5 via-violet-500/5 to-blue-500/5 border-y border-primary/10">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {[...STATS, ...STATS, ...STATS].map((s, i) => (
            <div key={i} className="flex items-center gap-3 stat-counter px-6 py-3 rounded-2xl">
              <span className="text-3xl">{s.icon}</span>
              <div>
                <div className="text-2xl font-extrabold text-gradient">{s.value}</div>
                <div className="text-xs font-bold text-muted uppercase tracking-wider">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 border border-violet-200 mb-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-violet-700">
              ✨ Dịch vụ toàn diện
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-darkbg tracking-tight">
            Mọi thứ thú cưng của bạn cần,
            <br />
            <span className="text-gradient">trong một ứng dụng.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="glass-cosmic p-6 rounded-2xl cursor-pointer group shine-effect"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                {s.icon}
              </div>
              <h3 className="text-lg font-extrabold text-darkbg mt-5">{s.title}</h3>
              <p className="text-sm text-muted font-medium mt-1.5 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Demo accounts section */}
      <section className="py-16 px-6 md:px-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 mb-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700">
              🎭 Tài khoản demo
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-darkbg tracking-tight">
            Thử ngay — <span className="text-gradient">không cần đăng ký</span>
          </h2>
          <p className="text-sm text-muted font-semibold mt-2">Click vào bất kỳ tài khoản nào để đăng nhập nhanh</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {DEMO_ACCOUNTS.map((acc, i) => (
            <motion.button
              key={acc.email}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6, scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleQuickLogin(acc)}
              disabled={autoLogging === acc.email}
              className="glass-cosmic p-5 rounded-2xl cursor-pointer group shine-effect text-center disabled:opacity-60"
            >
              <div className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br ${acc.gradient ?? "from-rose-400 to-pink-500"} flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                {acc.petEmoji ?? acc.avatar}
              </div>
              <div className="font-extrabold text-sm text-darkbg mt-3 truncate">{acc.name}</div>
              <div className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${acc.role === "admin" ? "text-indigo-600" : "text-primary"}`}>
                {autoLogging === acc.email ? "⏳ Đang đăng nhập..." : acc.role === "admin" ? "🛡️ Admin" : "👤 Chủ nuôi"}
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 border border-pink-200 mb-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-pink-700">
              💕 Cộng đồng yêu thương
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-darkbg tracking-tight">
            <span className="text-gradient">12,000+</span> thú cưng đang hạnh phúc
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-cosmic p-6 rounded-2xl hover-lift"
            >
              <div className="flex items-center gap-3 mb-4">
                <Avatar size="md">{t.name[0]}</Avatar>
                <div>
                  <div className="font-extrabold text-sm text-darkbg">{t.name}</div>
                  <div className="text-xs text-amber-500 font-bold">⭐ {t.rating}.0</div>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed italic">"{t.content}"</p>
              <div className="mt-3 text-2xl">{t.petEmoji}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="pet-hero-card glass-cosmic p-12 md:p-16 text-center relative"
        >
          <div className="relative z-10">
            <div className="text-6xl mb-4 animate-float-y inline-block">🐾</div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-darkbg tracking-tight">
              Sẵn sàng <span className="text-gradient">yêu thương</span> thú cưng của bạn?
            </h2>
            <p className="text-gray-600 mt-3 max-w-md mx-auto font-medium">
              Tham gia cùng 12,000+ gia đình đã tin tưởng VetGen chăm sóc thú cưng.
            </p>
            {!user && (
              <Button variant="primary" onClick={() => handleOpenAuth(true)} className="mt-7 px-8 py-3.5 text-base btn-rainbow">
                ✨ Bắt đầu miễn phí →
              </Button>
            )}
          </div>
        </motion.div>
      </section>

      <footer className="text-center py-8 text-xs text-muted font-semibold">
        © 2026 VetGen · Made with 🐾 bởi VetGen Team
      </footer>
    </div>
  );
};

const PetHeroVisual: React.FC = () => {
  const [petIdx, setPetIdx] = useState(0);
  const pets = [
    { emoji: "🐶", name: "Bé Mít", bg: "from-rose-400 to-pink-500", mood: "Playful" },
    { emoji: "🐱", name: "Pudding", bg: "from-violet-400 to-purple-500", mood: "Sleepy" },
    { emoji: "🐰", name: "Táo", bg: "from-emerald-400 to-teal-500", mood: "Happy" },
  ];

  useEffect(() => {
    const t = setInterval(() => setPetIdx(i => (i + 1) % pets.length), 3000);
    return () => clearInterval(t);
  }, [pets.length]);

  const current = pets[petIdx];

  return (
    <div className="relative">
      {/* Floating decoration */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br from-primary/30 to-violet-500/30 blur-2xl"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-gradient-to-br from-amber-400/30 to-pink-400/30 blur-2xl"
      />

      <motion.div
        key={petIdx}
        initial={{ scale: 0.7, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative"
      >
        <div className={`w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-br ${current.bg} flex items-center justify-center shadow-2xl animate-blob-morph`}>
          <div className="text-[10rem] md:text-[14rem] animate-pet-bounce drop-shadow-2xl">{current.emoji}</div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-2xl shadow-2xl border border-white/60"
        >
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-lg">✨</span>
            <div>
              <div className="font-extrabold text-sm text-darkbg">{current.name}</div>
              <div className="text-[10px] font-bold text-muted uppercase tracking-wider">Mood: {current.mood}</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingPage;