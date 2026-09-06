import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "soft";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-slate-950 text-white shadow-sm hover:bg-slate-800 focus-visible:ring-slate-400",
  secondary: "border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-300",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-slate-300",
  soft: "bg-blue-50 text-blue-700 hover:bg-blue-100 focus-visible:ring-blue-200",
};

export function Button({ className = "", variant = "primary", ...props }: Props) {
  return (
    <button
      className={`inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
