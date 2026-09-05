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
          padding: "0 24px",
          height: "56px",
          borderBottom: "1px solid var(--color-border)",
          flexShrink: 0,
          background: "var(--color-bg)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: "28px" }}
        >
          <button
            onClick={() => navigate("/")}
            style={{
              fontSize: "17px",
              fontWeight: 800,
              color: "var(--color-primary)",
              letterSpacing: "-0.5px",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            JamMate
          </button>

          {!isInRoom && (
            <nav style={{ display: "flex", gap: "2px" }}>
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
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--color-primary)",
                  fontFamily: "monospace",
                  background: "var(--color-primary-dim)",
                  padding: "3px 10px",
                  borderRadius: "var(--radius-sm)",
                  letterSpacing: "1.5px",
                  fontWeight: 600,
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
                fontWeight: 500,
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
        padding: "6px 14px",
        borderRadius: "var(--radius-md)",
        fontSize: "13px",
        fontWeight: 500,
        color: active ? "var(--color-text)" : "var(--color-text-muted)",
        background: active ? "var(--color-surface)" : "transparent",
        transition: "all 0.15s",
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
        boxShadow: "0 0 8px var(--color-glow)",
      }}
    />
  );
}
