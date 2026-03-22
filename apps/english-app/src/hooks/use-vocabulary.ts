// ============================================================
// CUSTOM HOOKS — Vocabulary API hooks
//
// Angular analogue: Service methods gọi HttpClient
// Nhưng ở đây hooks tích hợp sẵn caching, loading, error state
//
// Pattern: 1 hook = 1 API operation
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import type {
    VocabularyEntry,
    CreateVocabularyDto,
    UpdateVocabularyDto,
    PaginatedResponse,
    ApiResponse,
} from '../types/vocabulary';

// Query keys — centralize để tránh typo và dễ invalidate
// Giống enum action types trong NgRx
export const vocabularyKeys = {
    all: ['vocabulary'] as const,
    lists: () => [...vocabularyKeys.all, 'list'] as const,
    list: (params: Record<string, unknown>) =>
        [...vocabularyKeys.lists(), params] as const,
    detail: (id: string) => [...vocabularyKeys.all, 'detail', id] as const,
};

// ============================================================
// useVocabularyList — Lấy danh sách từ vựng có phân trang
// ============================================================

interface UseVocabularyListParams {
    page?: number;
    limit?: number;
    search?: string;
    wordType?: string;
}

export function useVocabularyList(params: UseVocabularyListParams = {}) {
    const { page = 1, limit = 20, search, wordType } = params;

    return useQuery({
        // Query key thay đổi khi params thay đổi → tự động refetch
        queryKey: vocabularyKeys.list({ page, limit, search, wordType }),

        queryFn: () =>
            apiClient.get<PaginatedResponse<VocabularyEntry>>('/vocabulary', {
                page,
                limit,
                ...(search ? { search } : {}),
                ...(wordType ? { wordType } : {}),
            }),
    });
}

// ============================================================
// useVocabularyDetail — Lấy chi tiết 1 từ theo ID
// ============================================================

export function useVocabularyDetail(id: string) {
    return useQuery({
        queryKey: vocabularyKeys.detail(id),
        queryFn: () =>
            apiClient.get<ApiResponse<VocabularyEntry>>(`/vocabulary/${id}`),
        // Chỉ fetch khi có ID — tránh gọi API với undefined
        enabled: Boolean(id),
    });
}

// ============================================================
// useCreateVocabulary — Thêm từ mới
// ============================================================

export function useCreateVocabulary() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateVocabularyDto) =>
            apiClient.post<ApiResponse<VocabularyEntry>>('/vocabulary', data),

        // Sau khi tạo thành công → invalidate list để refetch data mới
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: vocabularyKeys.lists() });
        },
    });
}

// ============================================================
// useUpdateVocabulary — Cập nhật từ
// ============================================================

export function useUpdateVocabulary(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateVocabularyDto) =>
            apiClient.patch<ApiResponse<VocabularyEntry>>(
                `/vocabulary/${id}`,
                data,
            ),

        onSuccess: () => {
            // Invalidate cả list và detail của từ đó
            queryClient.invalidateQueries({ queryKey: vocabularyKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: vocabularyKeys.detail(id),
            });
        },
    });
}

// ============================================================
// useDeleteVocabulary — Xóa từ
// ============================================================

export function useDeleteVocabulary() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => apiClient.delete<void>(`/vocabulary/${id}`),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: vocabularyKeys.lists() });
        },
    });
}
