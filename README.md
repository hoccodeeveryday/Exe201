# VetGen Frontend

Chăm sóc thú cưng thông minh cùng AI. SPA viết bằng React + TypeScript + Vite + Tailwind + Framer Motion.

## 🚀 Tech Stack

- **React 18** + **TypeScript 5** + **Vite 5**
- **Tailwind CSS 3** (glassmorphism + gradient + animation)
- **Framer Motion** (motion mềm mượt)
- **React Router DOM 6**
- **React Hook Form + Zod** (validation)
- **Lucide React** (icons)
- **Vitest + Testing Library** (unit tests)

## 📦 Scripts

```bash
npm install        # Cài đặt dependencies
npm run dev        # Chạy dev server (http://localhost:5173)
npm run build      # Build production
npm run preview    # Xem bản build
npm run lint       # ESLint (max-warnings 0)
npm test           # Chạy unit tests (Vitest)
npm run test:watch # Watch mode
npm run format     # Prettier
```

## 🔐 Demo Accounts (phân quyền Admin / User)

| Role  | Email                | Password   |
|-------|----------------------|------------|
| User  | `yennhi@vetgen.vn`   | `123456`   |
| Admin | `admin@vetgen.vn`    | `admin123` |

Trong form đăng nhập có nút **"User demo" / "Admin demo"** để autofill nhanh.

## 🗂 Cấu trúc thư mục

```
src/
├── app/                  # App-level setup
│   ├── routes.tsx        # Router + lazy code-splitting
│   └── providers/        # AuthProvider, ToastProvider, AdminDataProvider
├── components/
│   ├── layout/           # DashboardLayout, AdminLayout, Sidebar, NotFound
│   └── ui/               # Button, Card, Modal, Input, Toast, Badge...
├── data/mock/            # Mock data (pet, nav, doctors, vaccines, posts, accounts)
├── features/             # Feature-based: auth, landing, overview, pet-profile, ai-check, vaccination, appointment, community, admin
├── hooks/                # useToast, useAdminData
├── test/                 # Vitest tests
├── types/                # Global TS types
└── styles/global.css     # Tailwind + custom CSS (glass, gradient, keyframes)
```

## ✨ Tính năng chính

### Public
- **Landing Page** với hero, services, testimonials, footer
- **Auth Modal** (đăng nhập / đăng ký) với Zod validation

### User Dashboard
- **Tổng quan** — stat cards + health summary
- **Hồ sơ thú cưng** — chỉnh sửa thông tin
- **Kiểm tra AI** — upload ảnh, AI phân tích
- **Tiêm chủng** — lịch tiêm, vaccine
- **Lịch hẹn** — đặt lịch với bác sĩ
- **Cộng đồng** — bài viết

### Admin Panel (route `/admin`, role-protected)
- **Tổng quan hệ thống** — stats + activity feed
- **Quản lý chủ nuôi** — khóa / mở khóa tài khoản
- **Quản lý bài viết** — ẩn / khôi phục / xóa
- **Quản lý vaccine** — tổng hợp overdue/upcoming
- **Quản lý lịch hẹn** — duyệt / hủy

## 🛣 Route map

```
/                          → Landing Page (public)
/dashboard/*               → User dashboard (auth required)
  /dashboard/overview
  /dashboard/profile
  /dashboard/ai
  /dashboard/vax
  /dashboard/appt
  /dashboard/community
/admin/*                   → Admin panel (admin role only)
  /admin/overview
  /admin/users
  /admin/posts
  /admin/vax
  /admin/appt
*                          → 404 NotFound
```

## ♿ Accessibility (A11y)

- **Skip to main content** link (Tab đầu tiên trên trang)
- **Focus trap** trong Modal + restore focus khi đóng
- **Focus-visible** outline toàn cục
- **aria-invalid / aria-describedby** cho Input + Textarea khi lỗi
- **role="dialog" aria-modal="true"** cho Modal
- **prefers-reduced-motion** tôn trọng setting của user
- Tất cả icon button có `aria-label`

## 🧪 Tests

```bash
npm test
```

Hiện có 18 tests:
- `schemas.test.ts` — Zod validation cho login/register/pet-info
- `auth.test.tsx` — AuthProvider: login/logout/persistence
- `nav.test.ts` — Cấu trúc navigation + role-based filtering

## ⚙️ Performance

- **Code splitting**: mỗi page là 1 chunk riêng, lazy load qua `React.lazy`
- **Manual chunks**: `react` / `motion` / `forms` / `icons` tách hẳn
- **Initial bundle**: ~40 kB gzip 13 kB
- **Tree-shaking** + ESM only

## 🔧 Env Configuration

Xem `.env.example`. Tạo file `.env` nếu muốn override:

```env
VITE_APP_NAME=VetGen
VITE_APP_DESCRIPTION=Chăm sóc thú cưng thông minh cùng AI
VITE_API_BASE_URL=http://localhost:3000/api
```

## 📋 Bundle breakdown

Build output (sau khi split):

| Chunk | Size | Gzipped |
|-------|------|---------|
| react | 205 kB | 67 kB |
| motion (framer) | 130 kB | 43 kB |
| forms (RHF + zod) | 90 kB | 27 kB |
| index (app shell) | 40 kB | 13 kB |
| icons (lucide) | 11 kB | 3 kB |
| mỗi page | 2-9 kB | 1-3 kB |

## 🚧 Roadmap

- [ ] Thay mock data bằng API backend thật
- [ ] Upload ảnh lên cloud (S3/Cloudinary)
- [ ] Payment cho gói Premium
- [ ] Real-time chat với bác sĩ (WebSocket)
- [ ] PWA + offline mode
- [ ] Storybook cho design system

---

Made with 🐾 bởi VetGen Team
