import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        textAlign: "center",
      }}
    >
      {icon && (
        <div style={{ fontSize: "40px", marginBottom: "16px", opacity: 0.6 }}>{icon}</div>
      )}
      <h3
        style={{
          fontSize: "16px",
          fontWeight: 600,
          color: "var(--color-text)",
          marginBottom: "6px",
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            fontSize: "14px",
            color: "var(--color-text-muted)",
            marginBottom: "20px",
            maxWidth: "280px",
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
