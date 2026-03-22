// Root Layout — Wrap TOÀN BỘ app
// Đây là entry point của Next.js App Router
//
// Angular analogue: AppComponent + app.module.ts providers
// - metadata = SEO meta tags
// - Providers đặt ở đây áp dụng cho toàn app
import type { Metadata } from 'next';
import { QueryProvider } from '../providers/query-provider';
import './global.scss';

// Metadata cho SEO — Next.js tự inject vào <head>
export const metadata: Metadata = {
    title: {
        default: 'English Vocabulary App',
        template: '%s | English App', // "Vocabulary | English App"
    },
    description: 'Build your English vocabulary with spaced repetition',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                {/*
          QueryProvider — wrap toàn app với TanStack Query context
          Giống BrowserModule + HttpClientModule trong Angular app.module.ts
        */}
                <QueryProvider>{children}</QueryProvider>
            </body>
        </html>
    );
}
