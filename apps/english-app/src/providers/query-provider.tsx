'use client'; // Provider phải là Client Component vì dùng React state

// ============================================================
// QUERY PROVIDER — Setup TanStack Query cho toàn app
//
// Angular analogue: Cấu hình HttpClientModule + interceptors
// ở root module (app.module.ts)
//
// TanStack Query cache data từ server, tự động:
// - Refetch khi window focus lại
// - Retry khi request thất bại
// - Background sync để giữ data mới nhất
// ============================================================

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
    // useState để QueryClient không bị re-create khi component re-render
    // Mỗi user session có 1 QueryClient riêng (quan trọng cho SSR / multi-user)
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Sau 5 phút data được coi là "stale" → tự refetch
                        staleTime: 5 * 60 * 1000,
                        // Cache tồn tại 10 phút sau khi không có component nào dùng
                        gcTime: 10 * 60 * 1000,
                        // Retry 1 lần khi lỗi (tránh spam API)
                        retry: 1,
                        // Refetch khi user quay lại tab
                        refetchOnWindowFocus: true,
                    },
                    mutations: {
                        // Không retry mutation (POST/PUT/DELETE) — tránh duplicate
                        retry: 0,
                    },
                },
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
