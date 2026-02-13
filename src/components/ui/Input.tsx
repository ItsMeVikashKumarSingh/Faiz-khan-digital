import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
    return (
        <div className="space-y-2">
            {label && (
                <label className="text-sm font-medium text-gray-300 ml-1">
                    {label}
                </label>
            )}
            <input
                className={`w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all ${className} ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/50" : ""
                    }`}
                {...props}
            />
            {error && <p className="text-red-400 text-sm ml-1">{error}</p>}
        </div>
    );
}
