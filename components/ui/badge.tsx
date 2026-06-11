import * as React from "react";

type Variant = "default" | "outline" | "secondary";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: Variant;
};

const VARIANTS: Record<Variant, string> = {
  default: "bg-indigo-100 text-indigo-700",
  secondary: "bg-neutral-100 text-neutral-700",
  outline: "border border-neutral-300 text-neutral-700",
};

export function Badge({ variant = "default", className = "", ...rest }: BadgeProps) {
  return (
    <span
      {...rest}
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${VARIANTS[variant]} ${className}`}
    />
  );
}
