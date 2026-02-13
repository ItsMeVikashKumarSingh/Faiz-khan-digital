import { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    hover?: boolean;
}

export function Card({ children, className = "", hover = true, ...props }: CardProps) {
    return (
        <div
            className={`glass-card p-6 ${hover ? "hover:scale-[1.02]" : ""} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
