import type { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "ghost" | "danger";
}

export function Button({ children, variant = "ghost", className = "", ...props }: Props) {
  const styles = {
    primary: "bg-primary text-white hover:opacity-90",
    ghost: "bg-transparent hover:bg-black/5 dark:hover:bg-white/10",
    danger: "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-300"
  };
  return (
    <button
      className={`rounded-xl px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}