# Frontend Workspace — Architecture Guide

## Tổng quan

```
frontend-workspace/          ← Nx Monorepo root
├── apps/
│   └── english-app/         ← Next.js 16 Application
├── packages/
│   └── ui/                  ← Shared UI Component Library
├── nx.json                  ← Nx workspace config
├── tsconfig.base.json       ← TypeScript base config (shared)
├── tsconfig.json            ← TypeScript project references
└── package.json             ← Root dependencies (shared)
```

---

## 1. Config Files — Giải thích chi tiết

### `nx.json` — Não của Nx
```
Quyết định:
- Cách Nx chạy tasks (build, dev, test)
- Caching strategy (cache gì, bao lâu)
- Plugins nào được load
- defaultBase: branch mặc định để so sánh "affected"
```
Quan trọng: `plugins[@nx/js/typescript]` → Nx tự detect TypeScript projects và tạo targets

### `tsconfig.base.json` — TypeScript dùng chung
```
- Cấu hình strict TypeScript cho toàn workspace
- customConditions: ["@frontend-workspace/source"]
  → Khi import @english-app/ui, TypeScript resolve đến src/ (source)
  → Không cần build library trước khi dùng
- Các app/package extends từ file này
```

### `tsconfig.json` (root) — Project References
```
- Liệt kê tất cả TypeScript projects (apps/ và packages/)
- "references" giúp TypeScript hiểu dependency graph
- npx nx sync tự cập nhật file này khi thêm project mới
```

### `package.json` (root) — Shared Dependencies
```
- "workspaces": ["packages/*", "apps/*"]
  → npm link tất cả packages và apps vào node_modules/
  → @english-app/ui available everywhere mà không cần npm install
- dependencies: React, Next.js, TanStack Query, Zustand, ...
  → Dùng chung cho tất cả apps (tránh version mismatch)
```

---

## 2. Next.js App Structure — `apps/english-app/`

```
apps/english-app/
├── next.config.js           ← Next.js config (xem bên dưới)
├── tsconfig.json            ← Extends tsconfig.base.json
├── next-env.d.ts            ← Auto-generated Next.js types (KHÔNG SỬA)
├── index.d.ts               ← CSS module type declarations
└── src/
    ├── app/                 ← App Router (Next.js 13+)
    │   ├── layout.tsx       ← Root Layout
    │   ├── page.tsx         ← Home page (/)
    │   ├── global.css       ← Global CSS
    │   ├── (auth)/          ← Route Group: auth pages
    │   │   ├── login/page.tsx      → /login
    │   │   └── register/page.tsx   → /register
    │   ├── (dashboard)/     ← Route Group: protected pages
    │   │   ├── layout.tsx          ← Dashboard layout (sidebar)
    │   │   ├── vocabulary/page.tsx → /vocabulary
    │   │   └── flashcard/page.tsx  → /flashcard
    │   └── api/             ← API Routes (BFF pattern)
    │       └── health/route.ts → GET /api/health
    ├── components/          ← App-specific React components
    │   ├── vocabulary/      ← Feature components
    │   └── layout/          ← Layout components (Navbar, Sidebar)
    ├── hooks/               ← Custom React hooks
    │   └── use-vocabulary.ts
    ├── stores/              ← Zustand stores (client state)
    │   └── app-store.ts
    ├── providers/           ← React Context Providers
    │   └── query-provider.tsx
    ├── lib/                 ← Utilities & helpers
    │   ├── api-client.ts    ← fetch() wrapper
    │   └── utils.ts         ← cn(), formatDate(), ...
    └── types/               ← TypeScript interfaces
        └── vocabulary.ts
```

### `next.config.js` — Next.js Configuration
```javascript
const nextConfig = {
  nx: {},  // Nx plugin integration
  transpilePackages: ['@english-app/ui'],
  // Cho phép Next.js compile TypeScript source của packages/ui
  // Không cần build library trước khi dùng
};
```

### `apps/english-app/tsconfig.json`
```
- extends tsconfig.base.json (inherit strict settings)
- module: "esnext" + moduleResolution: "bundler" → Next.js/Turbopack style
- paths: { "@/*": ["./src/*"] } → import '@/components/...' thay vì '../../../'
- jsx: "preserve" → Next.js tự transform JSX
```

---

## 3. App Router Deep Dive

### Tại sao có dấu ngoặc `(auth)`, `(dashboard)`?

```
URL /login      → app/(auth)/login/page.tsx
URL /vocabulary → app/(dashboard)/vocabulary/page.tsx

Dấu ngoặc () = Route Groups:
- KHÔNG ảnh hưởng URL (không xuất hiện trong path)
- Dùng để nhóm pages dùng chung 1 layout
- (auth) pages dùng auth layout (centered form)
- (dashboard) pages dùng dashboard layout (sidebar + header)
```

### Server Component vs Client Component

```
Mặc định: MỌI file trong app/ đều là Server Component
→ Render ở server, không có JavaScript ở client
→ Không dùng được: useState, useEffect, onClick

'use client' directive → chuyển thành Client Component
→ Giống Angular component thông thường
→ Có interactive state

Rule of thumb:
- Page, Layout → Server Component (SEO, performance)
- Interactive UI (forms, buttons có state) → 'use client'
```

### Metadata

```typescript
// Trong layout.tsx hoặc page.tsx (Server Component only)
export const metadata: Metadata = {
  title: 'Page Title',        // <title>
  description: 'Description', // <meta name="description">
};
// Next.js tự inject vào <head> — không cần <Head> component
```

---

## 4. packages/ui — Shared Component Library

```
packages/ui/
├── package.json             ← name: "@english-app/ui"
├── tsconfig.json            ← extends tsconfig.base.json + jsx
├── tsconfig.lib.json        ← Build config
└── src/
    ├── index.ts             ← Public API: export * from './components/...'
    ├── lib/ui.ts            ← Placeholder (Nx generated)
    └── components/
        └── button/
            ├── button.tsx         ← Component implementation
            ├── button.module.css  ← CSS Modules styles
            └── index.ts           ← Re-export
```

### Cách Nx resolve `@english-app/ui`

```
Bước 1: packages/ui/package.json exports field:
  "@frontend-workspace/source": "./src/index.ts"

Bước 2: tsconfig.base.json:
  customConditions: ["@frontend-workspace/source"]

Kết quả: import { Button } from '@english-app/ui'
  → TypeScript resolve: packages/ui/src/index.ts (source)
  → Next.js (transpilePackages) compile TypeScript trực tiếp

Lợi ích: Không cần "build" packages/ui trước khi dùng!
```

---

## 5. State Management Architecture

```
┌─────────────────────────────────────────────────────┐
│                    DATA FLOW                         │
│                                                     │
│  Server (Spring Boot)                               │
│       ↕  HTTP/REST                                  │
│  TanStack Query  ← "Server State"                   │
│  (cache, loading, error, refetch)                   │
│       ↓                                             │
│  React Components                                   │
│       ↕                                             │
│  Zustand Store   ← "Client State"                   │
│  (UI state, auth, filters)                          │
└─────────────────────────────────────────────────────┘

TanStack Query dùng cho:    Zustand dùng cho:
- Vocabulary list            - User auth state
- Word details               - UI (sidebar, theme)
- API mutations              - Search/filter state
```

---

## 6. Layer Architecture

```
┌─────────────────────────────────────────────┐
│  app/ (pages & layouts)   ← Routing layer   │
├─────────────────────────────────────────────┤
│  components/              ← UI layer        │
├─────────────────────────────────────────────┤
│  hooks/                   ← Data layer      │
│  (useVocabularyList, ...)  (TanStack Query)  │
├─────────────────────────────────────────────┤
│  stores/                  ← State layer     │
│  (Zustand)                (client state)    │
├─────────────────────────────────────────────┤
│  lib/api-client.ts        ← Network layer   │
│  (fetch wrapper)                            │
├─────────────────────────────────────────────┤
│  types/                   ← Contract layer  │
│  (TypeScript interfaces)                    │
└─────────────────────────────────────────────┘
```

---

## 7. Nx Commands thường dùng

```sh
# Chạy dev server
npx nx dev english-app

# Build production
npx nx build english-app

# Sync TypeScript references (sau khi thêm project mới)
npx nx sync

# Xem dependency graph
npx nx graph

# Thêm shared library mới
npx nx g @nx/js:lib packages/shared-types --publishable --importPath=@english-app/shared-types

# Xem tất cả projects
npx nx show projects
```
