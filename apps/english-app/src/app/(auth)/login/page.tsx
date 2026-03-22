// Route: /login
// Route Group (auth) không ảnh hưởng URL — chỉ dùng để nhóm layout
// Dấu ngoặc (auth) = Next.js App Router: group without affecting path
export default function LoginPage() {
    return (
        <main
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div style={{ maxWidth: 400, width: '100%', padding: '2rem' }}>
                <h1
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        marginBottom: '1.5rem',
                    }}
                >
                    Sign in
                </h1>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    Login form sẽ được build ở phase Auth với React Hook Form +
                    Zod
                </p>
            </div>
        </main>
    );
}
