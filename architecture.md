# Frontend Architecture — English Vocabulary App

> **Stack**: Nx 22 · Next.js 16 · React 19 · TypeScript 5.9 · TanStack Query v5 · Zustand v5

---

## 1. Tổng quan kiến trúc dự án

```
┌─────────────────────────────────────────────────────────────────┐
│                    NX MONOREPO WORKSPACE                        │
│                  frontend-workspace/                            │
│                                                                 │
│  ┌─────────────────────────┐   ┌───────────────────────────┐   │
│  │        apps/            │   │       packages/           │   │
│  │                         │   │                           │   │
│  │  ┌───────────────────┐  │   │  ┌─────────────────────┐  │   │
│  │  │   english-app/    │  │   │  │        ui/          │  │   │
│  │  │   (Next.js 16)    │◄─┼───┼──│  (Shared Component  │  │   │
│  │  │                   │  │   │  │      Library)       │  │   │
│  │  │  ┌─────────────┐  │  │   │  │  @english-app/ui   │  │   │
│  │  │  │  App Router  │  │  │   │  └─────────────────────┘  │   │
│  │  │  │  (SSR/SSG)  │  │  │   │                           │   │
│  │  │  └─────────────┘  │  │   │  ┌─────────────────────┐  │   │
│  │  └───────────────────┘  │   │  │  (future packages)  │  │   │
│  │                         │   │  └─────────────────────┘  │   │
│  └─────────────────────────┘   └───────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    SHARED CONFIG                         │  │
│  │  tsconfig.base.json · nx.json · package.json · .prettier │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Tại sao dùng Nx Monorepo?**

```
Monorepo vs Multi-repo:

Monorepo (Nx)                    Multi-repo
──────────────────────           ──────────────────────
✅ Share code dễ dàng            ❌ Copy/paste code
✅ 1 lần install dependencies    ❌ npm install ở nhiều nơi
✅ Chạy parallel builds          ❌ Build tuần tự
✅ Nx cache → build nhanh hơn    ❌ Không có cache
✅ Thay đổi UI → ảnh hưởng app   ❌ Phải publish npm package
✅ Quản lý version tập trung     ❌ Version hell
```

---

## 2. Mô tả chi tiết từng thư mục & file

### 2.1 Cấp độ Root Workspace

```
frontend-workspace/
│
├── nx.json                    ← Trái tim của Nx workspace
│   • Khai báo plugins (Next.js, TypeScript)
│   • Cấu hình build targets mặc định
│   • Cài đặt affected (chỉ build những gì thay đổi)
│
├── package.json               ← Root package manager
│   • Khai báo workspaces: ["packages/*", "apps/*"]
│   • Shared devDependencies (Nx, TypeScript, Sass...)
│   • Scripts: dev, build, graph, format
│
├── tsconfig.base.json         ← TypeScript config dùng chung
│   • strict: true (bắt lỗi type nghiêm ngặt nhất)
│   • target: es2022 (JavaScript output hiện đại)
│   • Path aliases cho packages
│
├── tsconfig.json              ← TypeScript project references
│   • Danh sách tất cả projects trong workspace
│   • Cho phép TypeScript biên dịch cross-project
│
└── .prettierrc                ← Code formatter config
    • singleQuote: true
    • tabWidth: 4
```

### 2.2 apps/english-app/ — Next.js Application

```
apps/english-app/
│
├── next.config.js             ← Next.js + Nx integration
│   • withNx plugin: tích hợp Nx build system
│   • transpilePackages: cho phép dùng @english-app/ui trực tiếp từ src
│
├── .swcrc                     ← SWC compiler (thay Babel)
│   • Nhanh hơn Babel ~20x vì viết bằng Rust
│   • Transform JSX/TSX → JavaScript
│
├── tsconfig.json              ← TypeScript cho app này
│   • Extend tsconfig.base.json
│   • Path alias @/* → ./src/*
│   • jsx: "preserve" (để Next.js xử lý JSX)
│
└── src/
    │
    ├── app/                   ← App Router (Next.js 13+)
    │   │   [File-based routing: file = route]
    │   │
    │   ├── layout.tsx         ← Root Layout
    │   │   • Bao toàn bộ ứng dụng
    │   │   • Khai báo <html>, <body>
    │   │   • Setup QueryProvider (TanStack Query)
    │   │   • Import global.scss
    │   │   • <Metadata> cho SEO
    │   │
    │   ├── page.tsx           ← Trang Home (route: /)
    │   │
    │   ├── global.scss        ← CSS reset + base styles
    │   │
    │   ├── (auth)/            ← Route Group [không tạo URL segment]
    │   │   ├── login/
    │   │   │   └── page.tsx   ← Route: /login
    │   │   └── register/
    │   │       └── page.tsx   ← Route: /register
    │   │
    │   ├── (dashboard)/       ← Route Group [không tạo URL segment]
    │   │   ├── layout.tsx     ← Dashboard Layout (sidebar + main)
    │   │   ├── vocabulary/
    │   │   │   └── page.tsx   ← Route: /vocabulary
    │   │   └── flashcard/
    │   │       └── page.tsx   ← Route: /flashcard
    │   │
    │   └── api/               ← API Routes (chạy trên server)
    │       └── hello/
    │           └── route.ts   ← GET /api/hello
    │
    ├── components/            ← UI components riêng của app
    │   • Khác với packages/ui: components này app-specific
    │   • VD: VocabularyCard, FlashcardDeck, Navbar...
    │
    ├── hooks/                 ← Custom React hooks
    │   └── use-vocabulary.ts  ← Data fetching với TanStack Query
    │       • useVocabularyList() - lấy danh sách từ
    │       • useCreateVocabulary() - thêm từ mới
    │       • useUpdateVocabulary() - cập nhật từ
    │       • useDeleteVocabulary() - xóa từ
    │
    ├── lib/                   ← Utilities & helpers
    │   ├── api-client.ts      ← HTTP client wrapper
    │   │   • BASE_URL từ env: NEXT_PUBLIC_API_URL
    │   │   • Auto attach JWT token vào mỗi request
    │   │   • Xử lý error thống nhất
    │   └── utils.ts           ← Helper functions
    │       • cn() - merge CSS class names
    │       • formatDate() - "22 Mar 2026"
    │       • formatRelativeTime() - "2 days ago"
    │
    ├── providers/             ← React Context Providers
    │   └── query-provider.tsx ← Setup TanStack QueryClient
    │       • staleTime: 5 phút
    │       • retry: 1 lần khi query lỗi
    │
    ├── stores/                ← Global state (Zustand)
    │   └── app-store.ts
    │       • useAuthStore: user, isAuthenticated, login/logout
    │       • useUIStore: theme (dark/light), sidebar toggle
    │       • useVocabularyFilterStore: search, filter theo ngày/loại từ
    │
    ├── styles/                ← SCSS design tokens
    │   ├── _variables.scss    ← Colors, spacing, typography, breakpoints
    │   └── _mixins.scss       ← Reusable SCSS snippets
    │
    └── types/                 ← TypeScript type definitions
        └── vocabulary.ts
            • VocabularyEntry, WordType, MasteryLevel
            • CreateVocabularyDto, UpdateVocabularyDto
            • ApiResponse<T>, PaginatedResponse<T>
            • User, AuthTokens, LoginDto, RegisterDto
```

### 2.3 packages/ui/ — Shared Component Library

```
packages/ui/
│
├── package.json               ← Library config
│   • name: "@english-app/ui"
│   • type: "module" (ES modules)
│   • Exports: điều hướng imports đến src/ (không cần build)
│
└── src/
    ├── index.ts               ← Barrel export (cổng vào duy nhất)
    │   export * from './components/button'
    │   export * from './components/input'  (tương lai)
    │
    └── components/
        └── button/
            ├── button.tsx     ← Component chính
            │   • React.forwardRef (hỗ trợ ref)
            │   • Variants: primary/secondary/outline/ghost/danger
            │   • Sizes: sm/md/lg
            │   • Loading state (spinner)
            │   • leftIcon/rightIcon support
            ├── button.module.scss ← Scoped CSS
            └── index.ts       ← Re-export
```

---

## 3. Luồng hoạt động (Flow Diagrams)

### 3.1 Luồng Bootstrap — Khi chạy `npm run dev`

```
npm run dev
    │
    ▼
nx dev english-app          ← Nx điều phối
    │
    ▼
next dev                    ← Next.js dev server khởi động
    │
    ├─ Đọc next.config.js   ← Load cấu hình + Nx plugin
    ├─ Compile TypeScript    ← SWC compiler (Rust, cực nhanh)
    ├─ Build route tree      ← Scan tất cả file trong src/app/
    ├─ Setup HMR             ← Hot Module Replacement (auto reload)
    └─ Ready at localhost:3000
```

```
NX BUILD CACHE:
┌─────────────────────────────────────────┐
│  Lần đầu build: compile từ đầu          │
│  Lần 2+: Nx kiểm tra hash của files     │
│  Nếu không thay đổi → dùng cache        │
│  → Build nhanh hơn ~10x                 │
└─────────────────────────────────────────┘
```

### 3.2 Luồng Request — Khi User Nhập URL (Next.js SSR)

```
User nhập: https://app.com/vocabulary
                │
                ▼
        ┌───────────────┐
        │  DNS Resolve  │
        └───────┬───────┘
                │
                ▼
        ┌───────────────┐
        │  Next.js      │   ← Chạy trên Node.js server
        │  Server       │
        └───────┬───────┘
                │
                ▼
    ┌───────────────────────┐
    │   Route Matching      │
    │  /vocabulary          │
    │  → (dashboard)/       │
    │    vocabulary/page.tsx │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐         ┌──────────────────┐
    │  Server Component     │─fetch──▶│  Spring Boot API  │
    │  Rendering (SSR)      │◀─data───│  localhost:8080   │
    │                       │         └──────────────────┘
    │  1. Execute layout.tsx │
    │  2. Execute page.tsx   │
    │  3. Fetch data (server)│
    │  4. Generate HTML      │
    └───────────┬───────────┘
                │ HTML + CSS
                ▼
        ┌───────────────┐
        │    Browser    │
        │  Nhận HTML    │
        │  (hiển thị    │
        │   ngay lập tức│
        │   không cần   │
        │   chờ JS)     │
        └───────┬───────┘
                │
                ▼
    ┌───────────────────────┐
    │    Hydration          │
    │  React "tiếp quản"    │
    │  HTML tĩnh → App động │
    │  Event handlers gắn   │
    │  vào DOM              │
    └───────────────────────┘
```

### 3.3 Server Component vs Client Component

```
Next.js App Router phân loại 2 loại component:

┌────────────────────────────────┬────────────────────────────────┐
│    SERVER COMPONENT (default)  │    CLIENT COMPONENT            │
│                                │    (cần thêm "use client")     │
├────────────────────────────────┼────────────────────────────────┤
│  • Chạy trên server            │  • Chạy trên browser           │
│  • Fetch data trực tiếp từ DB  │  • Dùng useState, useEffect    │
│  • Không gửi JS xuống client   │  • Handle events (onClick...)  │
│  • Tốt cho SEO                 │  • Dùng browser APIs           │
│  • Không dùng hooks            │  • TanStack Query hooks        │
│  • Không dùng event handlers   │  • Zustand store               │
├────────────────────────────────┼────────────────────────────────┤
│  VD: layout.tsx, page.tsx      │  VD: VocabularyForm,           │
│      (khi không cần user       │      FlashcardDeck,            │
│       interaction)             │      LoginForm                 │
└────────────────────────────────┴────────────────────────────────┘

Quy tắc: Push "use client" xuống càng sâu càng tốt
→ Maximize phần chạy trên server
→ Giảm JS bundle gửi về browser
```

### 3.4 Luồng Data — Từ API đến UI

```
┌─────────────────────────────────────────────────────────┐
│                    DATA FLOW                            │
└─────────────────────────────────────────────────────────┘

Spring Boot API (port 8080)
        │
        │ HTTP / JSON
        ▼
api-client.ts              ← Wrapper fetch + JWT token
        │
        │ TypeScript types
        ▼
hooks/use-vocabulary.ts    ← TanStack Query (cache, refetch, loading)
        │
        │ { data, isLoading, error }
        ▼
page.tsx / components      ← UI render

─────────────────────────────────────────────────────────
GLOBAL STATE FLOW (Zustand):

User Login
    │
    ▼
useAuthStore.setUser()     ← Lưu user info + token
    │
    │ sessionStorage
    ▼
api-client.ts              ← Auto đính token vào headers
    │                         Authorization: Bearer <token>
    ▼
Spring Boot API            ← Xác thực JWT
```

### 3.5 Route Structure Map

```
URL                    File                                Layout
─────────────────────────────────────────────────────────────────
/                      app/page.tsx                        root layout
/login                 app/(auth)/login/page.tsx           root layout
/register              app/(auth)/register/page.tsx        root layout
/vocabulary            app/(dashboard)/vocabulary/page.tsx root + dashboard
/flashcard             app/(dashboard)/flashcard/page.tsx  root + dashboard
/api/hello             app/api/hello/route.ts              (API, no layout)
```

---

## 4. Phân tích Package Libraries

### 4.1 TanStack Query v5 — Server State Management

**Đang dùng**: `@tanstack/react-query` v5

**Giải quyết bài toán**: Quản lý "server state" (data từ API) — caching, loading states, refetching, pagination.

```
So sánh các alternatives:

┌─────────────────┬──────────┬────────────┬──────────┬────────────────┐
│ Library         │ Bundle   │ Learning   │ Cache    │ Devtools       │
│                 │ Size     │ Curve      │          │                │
├─────────────────┼──────────┼────────────┼──────────┼────────────────┤
│ TanStack Query  │ ~13KB    │ Trung bình │ ★★★★★   │ ★★★★★ Tuyệt    │
│ (đang dùng)     │          │            │          │                │
├─────────────────┼──────────┼────────────┼──────────┼────────────────┤
│ SWR (Vercel)    │ ~5KB     │ Dễ         │ ★★★★    │ ★★★           │
├─────────────────┼──────────┼────────────┼──────────┼────────────────┤
│ RTK Query       │ ~20KB    │ Khó        │ ★★★★    │ ★★★★          │
│ (Redux Toolkit) │ (+Redux) │            │          │                │
├─────────────────┼──────────┼────────────┼──────────┼────────────────┤
│ Apollo Client   │ ~30KB    │ Khó        │ ★★★★    │ ★★★★          │
│ (GraphQL only)  │          │            │          │                │
├─────────────────┼──────────┼────────────┼──────────┼────────────────┤
│ Zustand fetch   │ ~1KB     │ Dễ         │ ★★      │ ★★            │
│ (tự viết)       │          │            │          │                │
└─────────────────┴──────────┴────────────┴──────────┴────────────────┘

✅ TanStack Query: Lựa chọn tốt nhất cho REST API với features phong phú
⚡ SWR: Nếu cần lightweight, ít features
⚠️  RTK Query: Chỉ nên dùng nếu đã dùng Redux
❌ Apollo: Chỉ cho GraphQL
```

**Ưu điểm TanStack Query v5**:
- Auto cache + invalidate
- Background refetching
- Optimistic updates
- Infinite queries (load more)
- Prefetching (load trước khi user navigate)
- Devtools cực kỳ mạnh

**Nhược điểm**: Learning curve với các khái niệm như `queryKey`, `staleTime`, `gcTime`

---

### 4.2 Zustand v5 — Client State Management

**Đang dùng**: `zustand` v5

**Giải quyết bài toán**: Quản lý "client state" — UI state, auth info, user preferences.

```
So sánh các alternatives:

┌─────────────────┬──────────┬────────────┬──────────────┬────────────┐
│ Library         │ Bundle   │ Boilerplate │ DevTools    │ TypeScript │
├─────────────────┼──────────┼────────────┼──────────────┼────────────┤
│ Zustand         │ ~1KB     │ Rất ít     │ ★★★★        │ ★★★★★     │
│ (đang dùng)     │          │            │              │            │
├─────────────────┼──────────┼────────────┼──────────────┼────────────┤
│ Redux Toolkit   │ ~20KB    │ Nhiều      │ ★★★★★       │ ★★★★      │
├─────────────────┼──────────┼────────────┼──────────────┼────────────┤
│ Jotai           │ ~3KB     │ Ít         │ ★★★         │ ★★★★★     │
├─────────────────┼──────────┼────────────┼──────────────┼────────────┤
│ Recoil          │ ~20KB    │ Ít         │ ★★★         │ ★★★       │
│ (Facebook)      │ (deprecated)│          │              │            │
├─────────────────┼──────────┼────────────┼──────────────┼────────────┤
│ Context API     │ 0KB      │ Nhiều      │ ❌           │ ★★★       │
│ (built-in)      │          │ (boilerplate)│             │            │
└─────────────────┴──────────┴────────────┴──────────────┴────────────┘

✅ Zustand: Tốt nhất cho project vừa/nhỏ - đơn giản, type-safe
✅ Redux Toolkit: Dự án lớn, nhiều dev, cần time-travel debugging
✅ Jotai: Atomic state (Recoil replacement), state phân tán
⚠️  Context API: Dùng cho static config (theme), KHÔNG phải dynamic state
❌ Recoil: Facebook đã ngừng phát triển
```

---

### 4.3 React Hook Form + Zod — Form Management & Validation

**Đang dùng**: `react-hook-form` + `zod` (planned, chưa implement)

**Giải quyết bài toán**: Xây form phức tạp với validation type-safe.

```
So sánh alternatives:

┌─────────────────┬────────────┬────────────┬──────────┬────────────┐
│ Library         │ Re-renders │ Bundle     │ Validate │ TypeScript │
├─────────────────┼────────────┼────────────┼──────────┼────────────┤
│ React Hook Form │ Tối thiểu  │ ~25KB      │ Zod/Yup  │ ★★★★★     │
│ + Zod           │ (uncontrolled)│         │ (external)│           │
├─────────────────┼────────────┼────────────┼──────────┼────────────┤
│ Formik          │ Nhiều      │ ~30KB      │ Yup      │ ★★★       │
│ (legacy)        │ (controlled)│           │ (external)│           │
├─────────────────┼────────────┼────────────┼──────────┼────────────┤
│ TanStack Form   │ Tối thiểu  │ ~7KB       │ Built-in │ ★★★★★     │
│ (mới)           │            │            │          │            │
└─────────────────┴────────────┴────────────┴──────────┴────────────┘

✅ React Hook Form + Zod: Standard de-facto của industry (2024-2025)
⚠️  Formik: Cũ, nhiều re-render, nên tránh cho project mới
🆕 TanStack Form: Mới và promising nhưng ecosystem nhỏ hơn
```

---

### 4.4 Next.js 16 — Framework

```
So sánh alternatives:

┌───────────────┬──────────┬────────────┬──────────┬────────────────┐
│ Framework     │ Rendering│ Learning   │ SEO      │ Khi nào dùng   │
├───────────────┼──────────┼────────────┼──────────┼────────────────┤
│ Next.js       │ SSR/SSG  │ Trung bình │ ★★★★★   │ Production web │
│ (đang dùng)   │ /CSR     │            │          │ apps, SEO cần  │
├───────────────┼──────────┼────────────┼──────────┼────────────────┤
│ Vite + React  │ CSR only │ Dễ nhất    │ ★★      │ SPA, Admin     │
│               │          │            │          │ dashboards     │
├───────────────┼──────────┼────────────┼──────────┼────────────────┤
│ Remix         │ SSR focus│ Khó        │ ★★★★★   │ Data-heavy apps│
├───────────────┼──────────┼────────────┼──────────┼────────────────┤
│ Astro         │ MPA/SSG  │ Trung bình │ ★★★★★   │ Content sites  │
│               │ (partial │            │          │ blogs          │
│               │ hydration)│           │          │                │
└───────────────┴──────────┴────────────┴──────────┴────────────────┘

✅ Next.js: Đúng lựa chọn cho English Vocabulary App
   (SEO quan trọng nếu public, SSR tốt cho performance)
```

---

### 4.5 SCSS Modules — Styling

```
So sánh alternatives:

┌───────────────┬────────────┬────────────┬────────────┬────────────┐
│ Approach      │ Scoping    │ Dynamic    │ Bundle     │ DX         │
│               │            │ Styles     │            │            │
├───────────────┼────────────┼────────────┼────────────┼────────────┤
│ SCSS Modules  │ ★★★★★      │ Hạn chế    │ Tốt        │ ★★★★      │
│ (đang dùng)   │ (compile)  │ (CSS vars) │            │            │
├───────────────┼────────────┼────────────┼────────────┼────────────┤
│ Tailwind CSS  │ ★★★★       │ Hạn chế    │ Tốt nhất   │ ★★★★★     │
│               │ (naming)   │            │ (purging)  │ (nhanh nhất)│
├───────────────┼────────────┼────────────┼────────────┼────────────┤
│ CSS-in-JS     │ ★★★★★      │ ★★★★★     │ Kém hơn    │ ★★★★      │
│ (styled-      │ (runtime)  │ (props)    │ (runtime)  │            │
│ components)   │            │            │            │            │
├───────────────┼────────────┼────────────┼────────────┼────────────┤
│ Vanilla CSS   │ ★★         │ Hạn chế    │ Tốt        │ ★★        │
│               │ (global!)  │            │            │            │
└───────────────┴────────────┴────────────┴────────────┴────────────┘

SCSS Modules vs Tailwind — Trade-off quan trọng:

SCSS Modules:                    Tailwind:
• Code CSS dài hơn               • className="flex items-center gap-4"
• Tách biệt styles/markup        • Styles ngay trong JSX
• Dễ đọc class names             • Khó đọc khi className dài
• Cần đặt tên class              • Không cần đặt tên
• Dễ tùy biến phức tạp           • Cần config khi thoát khỏi system
```

---

## 5. ReactJS — Kiến thức Nâng cao

### 5.1 Component Lifecycle (React 18+)

```
FUNCTIONAL COMPONENT LIFECYCLE:

  Mount                    Update                   Unmount
  ─────                    ──────                   ───────

  Component được tạo       Props/State thay đổi     Component bị xóa
       │                          │                      │
       ▼                          ▼                      ▼
  render() [JSX]           render() [re-render]     Cleanup functions
       │                          │                 trong useEffect
       ▼                          ▼                      │
  DOM được tạo             DOM được cập nhật              ▼
       │                          │                 Memory freed
       ▼                          ▼
  useEffect chạy           useEffect chạy
  ([] = chỉ 1 lần)        (nếu deps thay đổi)
```

**Hooks Lifecycle chi tiết**:

```typescript
function MyComponent({ userId }: { userId: string }) {
    // 1. RENDER PHASE — chạy mỗi lần render
    const [count, setCount] = useState(0);

    // 2. AFTER PAINT — sau khi browser vẽ xong
    useEffect(() => {
        // Mount: userId được load lần đầu
        console.log('Component mounted hoặc userId thay đổi');
        const subscription = subscribeToUser(userId);

        // Cleanup: chạy TRƯỚC khi effect chạy lại + khi unmount
        return () => {
            subscription.unsubscribe(); // Quan trọng! Tránh memory leak
        };
    }, [userId]); // deps array — effect chạy lại khi userId thay đổi

    // 3. BEFORE PAINT — đồng bộ, block browser paint
    // Dùng cho: đo DOM, set scroll position
    useLayoutEffect(() => {
        // Hiếm khi dùng — chỉ khi cần đọc layout trước khi user thấy
    }, []);

    return <div>{count}</div>;
}
```

**Hooks hay dùng nhất (2024-2025)**:

```
Hook                  Mục đích                         Tần suất dùng
────────────────────────────────────────────────────────────────────
useState              Local state                       ★★★★★
useEffect             Side effects, data fetch          ★★★★★
useCallback           Memoize functions                 ★★★★
useMemo               Memoize computed values           ★★★
useRef                DOM refs, mutable values          ★★★★
useContext            Consume Context                   ★★★
useReducer            Complex state logic               ★★
useLayoutEffect       DOM measurement (trước paint)     ★
useId                 Unique IDs (SSR-safe)             ★★
useTransition         Non-urgent state updates          ★★
useDeferredValue      Defer expensive renders           ★★
useOptimistic         Optimistic UI (React 19)          ★★★ (mới)
```

---

### 5.2 Best Practices (2024-2025)

#### Rule 1: Composition over Props Drilling

```tsx
// ❌ BAD — Props drilling (truyền qua nhiều tầng)
<Page user={user}>
  <Sidebar user={user}>
    <Avatar user={user} />
  </Sidebar>
</Page>

// ✅ GOOD — Composition pattern
<Page>
  <Sidebar>
    <Avatar /> {/* Avatar tự lấy từ useAuthStore */}
  </Sidebar>
</Page>
```

#### Rule 2: Tách Server và Client Components đúng cách

```tsx
// ✅ Pattern: Server Component lấy data, Client Component hiển thị
// vocabulary/page.tsx — SERVER COMPONENT
async function VocabularyPage() {
    const words = await fetchWords(); // Chạy trên server, không gửi JS về client
    return <VocabularyList initialData={words} />;
    //      ↑ Client component nhận initial data
}

// vocabulary-list.tsx — CLIENT COMPONENT
'use client';
function VocabularyList({ initialData }: Props) {
    const { data } = useVocabularyList({ initialData }); // Hydrates từ server data
    return <ul>...</ul>;
}
```

#### Rule 3: Custom Hooks — Tách logic khỏi UI

```tsx
// ❌ BAD — Logic và UI lẫn lộn
function VocabularyPage() {
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch('/api/vocabulary').then(r => r.json()).then(setWords);
        setLoading(false);
    }, []);
    return loading ? <Spinner /> : <List data={words} />;
}

// ✅ GOOD — Hook tách biệt
function useVocabularyList() {
    return useQuery({ queryKey: ['vocabulary'], queryFn: fetchWords });
}

function VocabularyPage() {
    const { data, isLoading } = useVocabularyList();
    return isLoading ? <Spinner /> : <List data={data} />;
}
```

#### Rule 4: Tránh useEffect cho data transformation

```tsx
// ❌ BAD — dùng useEffect để transform data
const [filtered, setFiltered] = useState([]);
useEffect(() => {
    setFiltered(words.filter(w => w.type === selectedType));
}, [words, selectedType]);

// ✅ GOOD — useMemo, tính toán ngay trong render
const filtered = useMemo(
    () => words.filter(w => w.type === selectedType),
    [words, selectedType]
);
```

#### Rule 5: Error Boundaries cho graceful failures

```tsx
// Bắt lỗi render-time của toàn bộ subtree
<ErrorBoundary fallback={<ErrorPage />}>
    <VocabularySection />
</ErrorBoundary>
```

---

### 5.3 Tính năng mới trong React 18, 19 (2023-2025)

#### React 18 — Concurrent Mode

```
┌─────────────────────────────────────────────────────────────┐
│                    CONCURRENT RENDERING                     │
│                                                             │
│  React 17 (Legacy):          React 18 (Concurrent):        │
│  ─────────────────           ────────────────────────       │
│  Task A: ████████████        Task A: ████░░░░░████          │
│  Task B: ─────────────▶      Task B: ────████──────▶        │
│          (A phải xong        (Interruptible! B urgent       │
│           thì B mới chạy)     thì pause A, chạy B trước)   │
└─────────────────────────────────────────────────────────────┘
```

**useTransition** — Phân biệt urgent vs non-urgent:

```tsx
const [isPending, startTransition] = useTransition();

function handleSearch(query: string) {
    setSearchQuery(query);           // Urgent: cập nhật input ngay
    startTransition(() => {
        setFilteredResults(filter(query)); // Non-urgent: có thể trì hoãn
    });
}
// isPending = true trong khi transition đang xử lý → hiển thị loading
```

**Automatic Batching** — React 18 gom nhiều setState thành 1 re-render:

```tsx
// React 17: 2 re-renders
// React 18: chỉ 1 re-render (auto batching kể cả trong async)
async function handleSubmit() {
    await saveToApi();
    setLoading(false);  // }
    setError(null);     // } → React 18: gom lại, chỉ render 1 lần
    setSuccess(true);   // }
}
```

---

#### React 19 — 2024 (Đang dùng trong project!)

**Actions — Async mutations simplified**:

```tsx
// ❌ React 18 — Manual loading/error state
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

async function handleSubmit(data) {
    setLoading(true);
    try {
        await createVocabulary(data);
    } catch(e) {
        setError(e);
    } finally {
        setLoading(false);
    }
}

// ✅ React 19 — useActionState
const [state, submitAction, isPending] = useActionState(
    async (prevState, formData) => {
        try {
            await createVocabulary(formData);
            return { success: true };
        } catch(e) {
            return { error: e.message };
        }
    },
    null // initial state
);
// isPending tự động, error handling gọn hơn nhiều!
```

**useOptimistic — Cập nhật UI trước khi API trả về**:

```tsx
// Khi user xóa từ vựng: xóa khỏi UI ngay, không chờ API
const [optimisticWords, deleteOptimistic] = useOptimistic(
    words,
    (currentWords, deletedId) =>
        currentWords.filter(w => w.id !== deletedId)
);

async function handleDelete(id: string) {
    deleteOptimistic(id);          // UI cập nhật ngay lập tức
    await deleteVocabularyApi(id); // API call trong nền
    // Nếu API lỗi → tự động revert
}
```

**use() hook — Đọc Promises và Context**:

```tsx
// Đọc Promise trực tiếp trong component (với Suspense)
function VocabularyCard({ promise }: { promise: Promise<Word> }) {
    const word = use(promise); // Suspends đến khi Promise resolve
    return <div>{word.text}</div>;
}

// Đọc Context linh hoạt hơn useContext
const theme = use(ThemeContext); // Có thể dùng trong if/loops (useContext thì không)
```

**Server Actions — Form submit không cần API route**:

```tsx
// Chạy trên SERVER, gọi từ client form
async function createWordAction(formData: FormData) {
    'use server'; // Đây là Server Action
    const word = formData.get('word');
    await db.vocabulary.create({ word }); // Trực tiếp query DB!
    revalidatePath('/vocabulary');
}

// Trong component
<form action={createWordAction}> {/* Tự submit, tự handle */}
    <input name="word" />
    <button type="submit">Thêm từ</button>
</form>
```

**ref như prop thông thường** (không cần forwardRef nữa):

```tsx
// React 18 — cần forwardRef
const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => (
    <button ref={ref} {...props} />
));

// React 19 — ref là prop bình thường!
function Button({ ref, ...props }: Props & { ref?: Ref<HTMLButtonElement> }) {
    return <button ref={ref} {...props} />;
}
```

---

### 5.4 Sơ đồ tổng kết — Mental Model

```
┌───────────────────────────────────────────────────────────────┐
│                    REACT STATE TAXONOMY                       │
│                                                               │
│  STATE TYPE          WHERE TO PUT IT         EXAMPLE          │
│  ──────────────────────────────────────────────────────────   │
│  Server Data    →    TanStack Query      →   vocabulary list  │
│  (từ API)            (cache, loading)         user profile     │
│                                                               │
│  Global UI      →    Zustand            →   auth user         │
│  State               (persist, share)        theme, sidebar   │
│                                                               │
│  Local UI       →    useState           →   modal open/close  │
│  State               (component-level)       input value      │
│                                                               │
│  Computed       →    useMemo            →   filtered list      │
│  Values              (derived, cached)       total count       │
│                                                               │
│  Form State     →    React Hook Form    →   login form        │
│                      (uncontrolled)          add word form     │
│                                                               │
│  URL State      →    Next.js router     →   page, filters     │
│  (shareable)         (searchParams)          sort order        │
└───────────────────────────────────────────────────────────────┘
```

```
┌───────────────────────────────────────────────────────────────┐
│              NEXT.JS RENDERING STRATEGIES                     │
│                                                               │
│  SSR (Server-Side Rendering)                                  │
│  → HTML tạo mỗi request trên server                           │
│  → Dùng khi: data thay đổi thường xuyên, cần auth            │
│  → VD: /vocabulary (cần user-specific data)                   │
│                                                               │
│  SSG (Static Site Generation)                                 │
│  → HTML tạo lúc build time                                    │
│  → Dùng khi: data ít thay đổi, public content                │
│  → VD: trang giới thiệu, blog posts                           │
│                                                               │
│  ISR (Incremental Static Regeneration)                        │
│  → Static + tự động rebuild sau X giây                        │
│  → Kết hợp tốc độ static + data mới                          │
│                                                               │
│  CSR (Client-Side Rendering)                                  │
│  → Render hoàn toàn trên browser                              │
│  → Dùng với "use client" + useEffect                          │
│  → VD: flashcard animations, interactive UIs                  │
└───────────────────────────────────────────────────────────────┘
```

---

## 6. Tóm tắt — Tech Stack Decision Map

```
Bài toán cần giải          →    Giải pháp trong project
─────────────────────────────────────────────────────────────────
Quản lý nhiều packages     →    Nx Monorepo
Server-side rendering      →    Next.js 16 App Router
Type safety                →    TypeScript 5.9 (strict mode)
Fetch & cache API data     →    TanStack Query v5
Global UI state            →    Zustand v5
Form validation            →    React Hook Form + Zod
Scoped styling             →    SCSS Modules + design tokens
Shared components          →    packages/ui (@english-app/ui)
Fast compilation           →    SWC (Rust-based, ~20x vs Babel)
Code formatting            →    Prettier (4 spaces, single quotes)
```

---

> **Ghi chú**: File này mô tả architecture tại thời điểm 2026-03-24.
> Khi thêm feature mới, hãy cập nhật tương ứng.
