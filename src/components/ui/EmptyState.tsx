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
        <div style={{ fontSize: "32px", marginBottom: "12px" }}>{icon}</div>
      )}
      <h3
        style={{
          fontSize: "16px",
          fontWeight: 600,
          color: "var(--color-text)",
          marginBottom: "4px",
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            fontSize: "14px",
            color: "var(--color-text-muted)",
            marginBottom: "16px",
          }}
        >
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
