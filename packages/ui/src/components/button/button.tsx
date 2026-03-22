import React from 'react';
import styles from './button.module.scss';

// Các loại variant (kiểu dáng) của Button
export type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'danger';

// Các kích cỡ của Button
export type ButtonSize = 'sm' | 'md' | 'lg';

// Props của Button — extends HTMLButtonElement để giữ nguyên tất cả HTML attributes
// (onClick, type, form, aria-*, data-*, v.v.) — giống Angular @Input() nhưng mạnh hơn
export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean; // Hiện spinner, disable button
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

// React.forwardRef: cho phép component cha truyền ref vào DOM button
// Giống như ViewChild trong Angular — dùng khi cần focus, measure, v.v.
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary', // default variant
            size = 'md', // default size
            loading = false,
            leftIcon,
            rightIcon,
            children,
            disabled,
            className,
            ...props // rest spread: onClick, type, form, ... → xuống DOM button
        },
        ref,
    ) => {
        // Ghép CSS class names từ CSS Modules
        // styles.btn → "btn_abc123" (hash tự động, tránh conflict)
        const classes = [
            styles.btn,
            styles[variant],
            styles[size],
            loading ? styles.loading : '',
            className ?? '',
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <button
                ref={ref}
                className={classes}
                disabled={disabled || loading}
                {...props}
            >
                {/* Spinner khi đang loading */}
                {loading && (
                    <span className={styles.spinner} aria-hidden="true" />
                )}

                {/* Icon bên trái (nếu không loading) */}
                {!loading && leftIcon && (
                    <span className={styles.iconWrapper}>{leftIcon}</span>
                )}

                {/* Nội dung chính */}
                <span>{children}</span>

                {/* Icon bên phải (nếu không loading) */}
                {!loading && rightIcon && (
                    <span className={styles.iconWrapper}>{rightIcon}</span>
                )}
            </button>
        );
    },
);

// displayName giúp React DevTools hiện đúng tên component
Button.displayName = 'Button';
