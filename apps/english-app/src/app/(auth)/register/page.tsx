// Route: /register
export default function RegisterPage() {
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
                    Create account
                </h1>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    Register form sẽ được build ở phase Auth
                </p>
            </div>
        </main>
    );
}
