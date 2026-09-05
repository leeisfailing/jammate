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
  boxShadow?: string;
}

const variants: Record<string, VariantStyle> = {
  primary: {
    background: "var(--color-primary)",
    color: "#000",
    hoverBg: "var(--color-primary-hover)",
    boxShadow: "0 0 20px var(--color-glow)",
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
    hoverBg: "var(--color-danger-hover)",
  },
  ghost: {
    background: "transparent",
    color: "var(--color-text-muted)",
    hoverBg: "var(--color-surface)",
  },
};

const sizes = {
  sm: { padding: "6px 12px", fontSize: "13px", borderRadius: "var(--radius-sm)" },
  md: { padding: "8px 16px", fontSize: "14px", borderRadius: "var(--radius-md)" },
  lg: { padding: "12px 24px", fontSize: "15px", borderRadius: "var(--radius-lg)" },
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
        fontWeight: 600,
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: props.disabled ? "not-allowed" : "pointer",
        opacity: props.disabled ? 0.4 : 1,
        background: v.background,
        color: v.color,
        border: v.border ?? "none",
        boxShadow: v.boxShadow,
        letterSpacing: "-0.01em",
        ...s,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!props.disabled) {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.background = v.hoverBg;
          el.style.transform = "translateY(-1px)";
          if (v.boxShadow) el.style.boxShadow = v.boxShadow;
        }
      }}
      onMouseLeave={(e) => {
        if (!props.disabled) {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.background = v.background;
          el.style.transform = "translateY(0)";
          if (v.boxShadow) el.style.boxShadow = v.boxShadow;
        }
      }}
      onMouseDown={(e) => {
        if (!props.disabled) {
          e.currentTarget.style.transform = "translateY(0) scale(0.98)";
        }
      }}
      onMouseUp={(e) => {
        if (!props.disabled) {
          e.currentTarget.style.transform = "translateY(-1px) scale(1)";
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}
