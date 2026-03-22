// Route: /vocabulary (nằm trong dashboard layout)
// Server Component theo mặc định trong App Router
// Tương tự: Angular component, nhưng render ở server

export default function VocabularyPage() {
    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                }}
            >
                <div>
                    <h1
                        style={{
                            fontSize: '1.5rem',
                            fontWeight: 600,
                            color: '#0f172a',
                        }}
                    >
                        My Vocabulary
                    </h1>
                    <p
                        style={{
                            color: '#64748b',
                            fontSize: '0.875rem',
                            marginTop: '0.25rem',
                        }}
                    >
                        Manage and review your word collection
                    </p>
                </div>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                Vocabulary list UI sẽ được build ở phase Vocabulary với TanStack
                Query
            </p>
        </div>
    );
}
