import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

interface VariantStyle {
  background: string;
  color: string;
  hoverBg: string;
  border?: string;
}

const variants: Record<string, VariantStyle> = {
  primary: {
    background: "var(--color-primary)",
    color: "#000",
    hoverBg: "var(--color-primary-hover)",
  },
  secondary: {
    background: "var(--color-surface)",
    color: "var(--color-text)",
    hoverBg: "var(--color-surface-hover)",
    border: "1px solid var(--color-border)",
  },
  danger: {
    background: "var(--color-danger)",
    color: "#fff",
    hoverBg: "#dc2626",
  },
  ghost: {
    background: "transparent",
    color: "var(--color-text-muted)",
    hoverBg: "var(--color-surface)",
  },
};

const sizes = {
  sm: { padding: "6px 12px", fontSize: "13px" },
  md: { padding: "8px 16px", fontSize: "14px" },
  lg: { padding: "12px 24px", fontSize: "15px" },
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  style,
  ...props
}: ButtonProps) {
  const v: VariantStyle = variants[variant] ?? variants.primary;
  const s = sizes[size];

  return (
    <button
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        borderRadius: "var(--radius-md)",
        fontWeight: 500,
        transition: "background 0.15s, opacity 0.15s",
        cursor: props.disabled ? "not-allowed" : "pointer",
        opacity: props.disabled ? 0.5 : 1,
        background: v.background,
        color: v.color,
        border: v.border ?? "none",
        ...s,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!props.disabled) {
          (e.currentTarget as HTMLButtonElement).style.background = v.hoverBg;
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = v.background;
      }}
      {...props}
    >
      {children}
    </button>
  );
}
