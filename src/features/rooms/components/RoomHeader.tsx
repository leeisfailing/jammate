import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useRoomStore } from "@/stores/roomStore";
import { roomService } from "@/lib/supabase/rooms";
import { Button } from "@/components/ui/Button";

interface RoomHeaderProps {
  onSearch: () => void;
}

export function RoomHeader({ onSearch }: RoomHeaderProps) {
  const navigate = useNavigate();
  const { userId } = useAuthStore();
  const { currentRoom, members, setConnected, leaveRoom } = useRoomStore();
  const isHost = currentRoom?.host_user_id === userId;

  const handleLeave = async () => {
    if (!currentRoom || !userId) return;
    try {
      await roomService.leaveRoom(currentRoom.id, userId);
    } catch {
      // Ignore errors
    }
    leaveRoom();
    navigate("/");
  };

  const handleClose = async () => {
    if (!currentRoom) return;
    try {
      await roomService.closeRoom(currentRoom.id);
    } catch {
      // Ignore errors
    }
    leaveRoom();
    setConnected(false);
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        borderBottom: "1px solid var(--color-border)",
        flexShrink: 0,
        background: "var(--color-bg)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          onClick={handleLeave}
          style={{
            fontSize: "13px",
            color: "var(--color-text-muted)",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-text)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-text-muted)"; }}
        >
          ← Back
        </button>

        {currentRoom && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                fontSize: "12px",
                fontFamily: "monospace",
                color: "var(--color-primary)",
                background: "var(--color-primary-dim)",
                padding: "4px 12px",
                borderRadius: "var(--radius-sm)",
                letterSpacing: "1.5px",
                fontWeight: 600,
              }}
            >
              {currentRoom.room_code}
            </span>
            {currentRoom.is_locked && (
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--color-warning)",
                }}
              >
                Locked
              </span>
            )}
            <span
              style={{
                fontSize: "12px",
                color: "var(--color-text-muted)",
              }}
            >
              {members.length} member{members.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Button variant="secondary" size="sm" onClick={onSearch}>
          Search
        </Button>
        {isHost && (
          <Button variant="danger" size="sm" onClick={handleClose}>
            Close Room
          </Button>
        )}
      </div>
    </div>
  );
}
