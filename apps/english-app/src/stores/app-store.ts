// ============================================================
// ZUSTAND STORE — Global client state
//
// Angular analogue: NgRx Store / BehaviorSubject trong Service
//
// Zustand đơn giản hơn NgRx rất nhiều:
// - Không có actions, reducers, effects riêng biệt
// - Tất cả trong 1 chỗ: state + actions
// - Không cần Provider (store là global singleton)
// ============================================================

import { create } from 'zustand';
import type { User } from '../types/vocabulary';

// ============================================================
// AUTH SLICE — Trạng thái đăng nhập
// ============================================================

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    // Actions — đặt cùng state, không tách riêng như NgRx
    setUser: (user: User) => void;
    clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    // Initial state
    user: null,
    isAuthenticated: false,

    // Actions — gọi trực tiếp: useAuthStore.getState().setUser(user)
    setUser: (user) => set({ user, isAuthenticated: true }),
    clearUser: () => set({ user: null, isAuthenticated: false }),
}));

// ============================================================
// UI SLICE — Trạng thái giao diện (sidebar, theme, v.v.)
// ============================================================

type Theme = 'light' | 'dark' | 'system';

interface UIState {
    theme: Theme;
    isSidebarOpen: boolean;
    setTheme: (theme: Theme) => void;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
    // Initial state
    theme: 'light',
    isSidebarOpen: true,

    // Actions
    setTheme: (theme) => set({ theme }),
    toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSidebarOpen: (open) => set({ isSidebarOpen: open }),
}));

// ============================================================
// VOCABULARY FILTER SLICE — Filter/search state
// (server state = TanStack Query, client filter = Zustand)
// ============================================================

interface VocabularyFilterState {
    searchQuery: string;
    selectedWordType: string | null;
    selectedDate: string | null;
    setSearchQuery: (query: string) => void;
    setWordTypeFilter: (wordType: string | null) => void;
    setDateFilter: (date: string | null) => void;
    resetFilters: () => void;
}

export const useVocabularyFilterStore = create<VocabularyFilterState>(
    (set) => ({
        searchQuery: '',
        selectedWordType: null,
        selectedDate: null,

        setSearchQuery: (query) => set({ searchQuery: query }),
        setWordTypeFilter: (wordType) => set({ selectedWordType: wordType }),
        setDateFilter: (date) => set({ selectedDate: date }),
        resetFilters: () =>
            set({
                searchQuery: '',
                selectedWordType: null,
                selectedDate: null,
            }),
    }),
);
