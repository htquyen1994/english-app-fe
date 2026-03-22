// Layout cho toàn bộ dashboard (sau khi đăng nhập)
// File này wrap tất cả pages trong (dashboard)/
// Tương tự: Angular có thể dùng nested router-outlet với 1 layout component

// Trong thực tế sẽ thêm:
// - Auth guard (check token, redirect về /login nếu chưa đăng nhập)
// - Sidebar navigation
// - Header với user info

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar sẽ được build sau */}
            <aside
                style={{
                    width: 240,
                    background: '#1e293b',
                    color: '#fff',
                    padding: '1.5rem 1rem',
                    flexShrink: 0,
                }}
            >
                <h2
                    style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        marginBottom: '1.5rem',
                        color: '#94a3b8',
                    }}
                >
                    ENGLISH APP
                </h2>
                <nav
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem',
                    }}
                >
                    <a
                        href="/vocabulary"
                        style={{
                            color: '#e2e8f0',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '0.375rem',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                        }}
                    >
                        📚 Vocabulary
                    </a>
                    <a
                        href="/flashcard"
                        style={{
                            color: '#e2e8f0',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '0.375rem',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                        }}
                    >
                        🃏 Flashcard
                    </a>
                </nav>
            </aside>

            {/* Main content */}
            <main style={{ flex: 1, padding: '2rem', background: '#f8fafc' }}>
                {children}
            </main>
        </div>
    );
}
