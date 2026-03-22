// Home Page — Server Component (default trong App Router)
// Trang landing, demo Button từ @english-app/ui
'use client'; // Cần vì dùng onClick (interactivity) → phải là Client Component

import styles from './page.module.css';

export default function HomePage() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.title}>English Vocabulary App</h1>
                    <p className={styles.subtitle}>
                        Xây dựng từ vựng tiếng Anh mỗi ngày với Spaced
                        Repetition
                    </p>
                </div>

                {/* Demo: Button từ @english-app/ui */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        Button Component — <code>@english-app/ui</code>
                    </h2>
                    <p className={styles.sectionDesc}>
                        Import từ shared package, dùng chung cho tất cả apps
                        trong workspace
                    </p>

                    {/* Variants */}
                    <div className={styles.group}>
                        <h3 className={styles.groupLabel}>Variants</h3>
                        <div className={styles.buttonRow}>
                            {/* <Button
                                variant="primary"
                                onClick={() => alert('Primary!')}
                            >
                                Primary
                            </Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="danger">Danger</Button> */}
                        </div>
                    </div>

                    {/* Sizes */}
                    <div className={styles.group}>
                        <h3 className={styles.groupLabel}>Sizes</h3>
                        <div
                            className={styles.buttonRow}
                            style={{ alignItems: 'center' }}
                        >
                            {/* <Button size="sm">Small</Button>
                            <Button size="md">Medium</Button>
                            <Button size="lg">Large</Button> */}
                        </div>
                    </div>

                    {/* States */}
                    <div className={styles.group}>
                        <h3 className={styles.groupLabel}>States</h3>
                        <div className={styles.buttonRow}>
                            {/* <Button loading>Loading...</Button>
                            <Button disabled>Disabled</Button>
                            <Button leftIcon={<span>+</span>} variant="primary">
                                Add Word
                            </Button>
                            <Button
                                rightIcon={<span>→</span>}
                                variant="outline"
                            >
                                View All
                            </Button> */}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <div className={styles.cta}>
                    {/* <Button variant="primary" size="lg">
                        Get Started
                    </Button>
                    <Button variant="outline" size="lg">
                        Learn More
                    </Button> */}
                </div>
            </div>
        </main>
    );
}
