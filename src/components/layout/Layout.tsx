import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useRoomStore } from "@/stores/roomStore";

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { displayName } = useAuthStore();
  const { currentRoom } = useRoomStore();

  const isInRoom = location.pathname.startsWith("/room/");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "var(--color-bg)",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          height: "52px",
          borderBottom: "1px solid var(--color-border)",
          flexShrink: 0,
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: "24px" }}
        >
          <button
            onClick={() => navigate("/")}
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--color-primary)",
              letterSpacing: "-0.3px",
            }}
          >
            JamMate
          </button>

          {!isInRoom && (
            <nav style={{ display: "flex", gap: "4px" }}>
              <NavButton
                active={location.pathname === "/"}
                onClick={() => navigate("/")}
              >
                Home
              </NavButton>
              <NavButton
                active={location.pathname === "/settings"}
                onClick={() => navigate("/settings")}
              >
                Settings
              </NavButton>
            </nav>
          )}

          {isInRoom && currentRoom && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--color-text-muted)",
                  fontFamily: "monospace",
                  background: "var(--color-surface)",
                  padding: "2px 8px",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                {currentRoom.room_code}
              </span>
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {displayName && (
            <span
              style={{
                fontSize: "13px",
                color: "var(--color-text-muted)",
              }}
            >
              {displayName}
            </span>
          )}
          <ConnectionDot />
        </div>
      </header>

      <main
        style={{
          flex: 1,
          overflow: "auto",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}

function NavButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 12px",
        borderRadius: "var(--radius-sm)",
        fontSize: "13px",
        fontWeight: 500,
        color: active ? "var(--color-text)" : "var(--color-text-muted)",
        background: active ? "var(--color-surface)" : "transparent",
        transition: "background 0.15s, color 0.15s",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = "var(--color-surface-hover)";
          e.currentTarget.style.color = "var(--color-text)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--color-text-muted)";
        }
      }}
    >
      {children}
    </button>
  );
}

function ConnectionDot() {
  return (
    <div
      style={{
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        background: "var(--color-primary)",
      }}
    />
  );
}
