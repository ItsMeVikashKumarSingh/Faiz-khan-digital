import { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "glass" | "outline";
    isLoading?: boolean;
    icon?: ReactNode;
    children: ReactNode;
    className?: string; // Allow custom classes
}

export function Button({
    variant = "primary",
    isLoading = false,
    icon,
    children,
    className = "",
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles =
        "py-3 px-6 rounded-xl font-semibold text-center flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed";

    const variants = {
        primary:
            "bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:shadow-lg hover:shadow-cyan-500/25",
        secondary:
            "bg-white/5 border border-white/10 text-white hover:bg-purple-600/20 hover:border-purple-500/50",
        glass:
            "btn-glass", // Using the global css class
        outline:
            "border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading...
                </>
            ) : (
                <>
                    {children}
                    {icon}
                </>
            )}
        </button>
    );
}
