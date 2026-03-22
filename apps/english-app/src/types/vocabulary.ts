// ============================================================
// DOMAIN TYPES — Vocabulary App
// Đây là "source of truth" cho data shape trong toàn bộ app
// ============================================================

// WordType: loại từ theo ngữ pháp tiếng Anh
export type WordType =
    | 'noun'
    | 'verb'
    | 'adjective'
    | 'adverb'
    | 'preposition'
    | 'conjunction'
    | 'phrase';

// VocabularyEntry: một từ vựng người dùng đã thêm
export interface VocabularyEntry {
    id: string;
    word: string; // Từ vựng: "ephemeral"
    pronunciation: string; // Phiên âm: "/ɪˈfem.ər.əl/"
    wordType: WordType; // Loại từ: "adjective"
    definition: string; // Định nghĩa ngắn
    synonyms: string[]; // Từ đồng nghĩa: ["transient", "fleeting"]
    examples: string[]; // Câu ví dụ
    notes?: string; // Ghi chú của người dùng (optional)
    createdAt: string; // ISO date string
    reviewedAt?: string; // Lần ôn tập gần nhất
    masteryLevel: 0 | 1 | 2 | 3; // 0=mới, 1=nhớ lờ mờ, 2=nhớ khá, 3=thuộc
}

// CreateVocabularyDto: data gửi lên khi tạo từ mới
// Bỏ các field server tự tạo (id, createdAt, masteryLevel)
export type CreateVocabularyDto = Omit<
    VocabularyEntry,
    'id' | 'createdAt' | 'reviewedAt' | 'masteryLevel'
>;

// UpdateVocabularyDto: update một phần — mọi field đều optional
export type UpdateVocabularyDto = Partial<CreateVocabularyDto>;

// ============================================================
// API RESPONSE WRAPPERS
// Chuẩn hóa response từ Spring Boot backend
// ============================================================

// Generic wrapper cho mọi API response
export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
    timestamp: string;
}

// Paginated list response
export interface PaginatedResponse<T> {
    data: T[];
    total: number; // Tổng số records
    page: number; // Trang hiện tại (bắt đầu từ 1)
    limit: number; // Số records mỗi trang
    totalPages: number;
}

// ============================================================
// AUTH TYPES
// ============================================================

export interface User {
    id: string;
    email: string;
    displayName: string;
    createdAt: string;
}

export interface AuthTokens {
    accessToken: string; // JWT ngắn hạn (15 phút)
    refreshToken: string; // JWT dài hạn (7 ngày)
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    displayName: string;
}
