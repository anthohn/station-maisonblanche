'use client'

import Link from 'next/link';

interface ModernButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    href?: string;
    className?: string;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'outlined' | 'glass';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    showArrow?: boolean;
    icon?: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    target?: string;
}

export default function ModernButton({
    children,
    onClick,
    href,
    className = '',
    disabled = false,
    variant = 'primary',
    size = 'lg',
    showArrow = true,
    icon,
    type = 'button',
    target
}: ModernButtonProps) {
    const baseClasses = "group relative font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer inline-flex items-center justify-center";

    const variantClasses = {
        primary: "bg-[#303F9F] text-white",
        secondary: "bg-gray-600 text-white",
        outlined: "bg-transparent border-2 border-[#303F9F] text-[#303F9F] hover:bg-[#303F9F] hover:text-white",
        glass: "bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 text-white"
    };

    const sizeClasses = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
        icon: "p-4 h-[60px] w-[60px]"
    };

    const disabledClasses = disabled
        ? "opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-lg"
        : "";

    const content = (
        <>
            <span className="relative z-10 flex items-center">
                {icon && <span className="mr-2">{icon}</span>}
                <span>{children}</span>
                {showArrow && (
                    <svg className="w-5 h-5 ml-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                )}
            </span>
            {/* Effet de brillance au hover */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </>
    );

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;

    // Si href est fourni, utiliser Link de Next.js
    if (href && !disabled) {
        return (
            <Link href={href} className={classes} target={target}>
                {content}
            </Link>
        );
    }

    // Sinon, utiliser un bouton classique
    return (
        <button
            type={type}
            className={classes}
            onClick={onClick}
            disabled={disabled}
        >
            {content}
        </button>
    );
}
