import { type ReactNode } from "react";
import { clsx } from "clsx";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "category";

const VARIANTS: Record<BadgeVariant, string> = {
  default: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  danger: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  category: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400",
};

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
