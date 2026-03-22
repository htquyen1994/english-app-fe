// ============================================================
// UTILITIES — Hàm tiện ích dùng chung trong toàn app
// ============================================================

// cn() — Class Name helper
// Kết hợp nhiều class names, lọc bỏ falsy values
// Dùng khắp nơi: cn("base", isActive && "active", error ? "error" : "normal")
// Tương tự như Angular's ngClass nhưng đơn giản hơn
export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}

// formatDate() — Format ISO date string sang dạng dễ đọc
// Input: "2026-03-22T10:00:00.000Z"
// Output: "22 Mar 2026"
export function formatDate(isoString: string): string {
    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(isoString));
}

// formatRelativeTime() — Hiện "2 days ago", "5 minutes ago", v.v.
export function formatRelativeTime(isoString: string): string {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const diff = (new Date(isoString).getTime() - Date.now()) / 1000;

    if (Math.abs(diff) < 60) return rtf.format(Math.round(diff), 'second');
    if (Math.abs(diff) < 3600)
        return rtf.format(Math.round(diff / 60), 'minute');
    if (Math.abs(diff) < 86400)
        return rtf.format(Math.round(diff / 3600), 'hour');
    return rtf.format(Math.round(diff / 86400), 'day');
}

// truncate() — Cắt chuỗi dài, thêm "..."
export function truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength).trimEnd() + '...';
}

// sleep() — Delay dùng trong tests hoặc demo
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
