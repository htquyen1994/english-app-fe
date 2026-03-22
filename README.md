# English App — Frontend Workspace

Monorepo quản lý bằng **Nx 22**, chứa Next.js app và shared packages cho dự án English Vocabulary App.

---

## Tech Stack

| Công nghệ | Version | Vai trò |
|---|---|---|
| Nx | 22.6.x | Monorepo tool, task runner |
| Next.js | 16.x (App Router) | Framework chính |
| TypeScript | 5.9.x | Type-safe code |
| TanStack Query | v5 | Server state / data fetching |
| Zustand | v5 | Client state management |
| React Hook Form | v7 | Form management |
| Zod | v4 | Schema validation |

---

## Cấu trúc project

```
frontend-workspace/
├── apps/
│   └── english-app/          ← Next.js 16 App Router
│       └── src/app/          ← App Router pages & layouts
├── packages/                 ← Shared libraries (publishable)
├── nx.json                   ← Nx workspace config
├── package.json              ← Root dependencies
└── tsconfig.base.json        ← Shared TypeScript paths
```

---

## Yêu cầu môi trường

- **Node.js** ≥ 20.x ([download](https://nodejs.org))
- **npm** ≥ 10.x (đi kèm Node)

Kiểm tra:
```sh
node -v   # v20.x.x hoặc cao hơn
npm -v    # 10.x.x hoặc cao hơn
```

---

## Setup từ đầu (Scratch)

### 1. Clone repo và cài dependencies

```sh
git clone <repo-url>
cd frontend-workspace
npm install
```

### 2. Chạy Next.js app ở dev mode

```sh
npx nx dev english-app
```

Mở trình duyệt: **http://localhost:3000**

---

## Tạo workspace mới từ đầu (nếu chưa có)

> Dùng khi muốn setup lại hoàn toàn từ con số 0.

```sh
# Bước 1: Tạo Nx workspace chỉ với @nx/js (no app)
npx create-nx-workspace@latest frontend-workspace \
  --preset=ts \
  --nxCloud=skip

cd frontend-workspace

# Bước 2: Cài plugin Next.js (phải cùng version với nx)
npm install --save-dev @nx/next@$(node -e "console.log(require('./package.json').devDependencies.nx)")

# Bước 3: Generate Next.js app vào thư mục apps/
npx nx g @nx/next:app apps/english-app \
  --style=css \
  --src=true \
  --appDir=true \
  --unitTestRunner=none \
  --e2eTestRunner=none \
  --no-interactive

# Bước 4: Cài tech stack
npm install @tanstack/react-query@5 zustand react-hook-form zod @hookform/resolvers
```

---

## Nx Commands thường dùng

### Chạy app

```sh
# Dev server (hot reload)
npx nx dev english-app

# Build production
npx nx build english-app

# Start production server (cần build trước)
npx nx start english-app
```

### Quản lý project

```sh
# Xem tất cả projects trong workspace
npx nx show projects

# Xem chi tiết targets của 1 project
npx nx show project english-app

# Visualize dependency graph
npx nx graph
```

### Tạo shared library (packages/)

```sh
# Tạo publishable TypeScript library
npx nx g @nx/js:lib packages/ui-components \
  --publishable \
  --importPath=@english-app/ui-components

# Build library
npx nx build ui-components
```

### Nx caching (tăng tốc build)

```sh
# Xóa cache local
npx nx reset

# Chạy lại task bỏ qua cache
npx nx build english-app --skip-nx-cache
```

---

## Thêm dependencies cho 1 app cụ thể

Khi cài package chỉ dùng cho `english-app`:

```sh
# Cài vào root (recommended với Nx monorepo)
npm install <package-name>

# Hoặc cài riêng vào app (nếu muốn isolate)
cd apps/english-app && npm install <package-name>
```

---

## Troubleshooting

**Lỗi: `Cannot find module '@nx/next'`**
```sh
npm install --save-dev @nx/next@$(node -e "console.log(require('./package.json').devDependencies.nx)")
```

**Lỗi port 3000 đã dùng**
```sh
npx nx dev english-app -- --port 3001
```

**TypeScript paths không hoạt động**
```sh
npx nx sync
```
