import { useAuthStore } from "@/stores/authStore";
import { useRoomStore } from "@/stores/roomStore";
import { roomService } from "@/lib/supabase/rooms";

export function Members() {
  const { userId } = useAuthStore();
  const { members, currentRoom } = useRoomStore();
  const isHost = currentRoom?.host_user_id === userId;

  const handleRemoveMember = async (memberUserId: string) => {
    if (!currentRoom || !isHost) return;
    if (memberUserId === userId) return;

    try {
      await roomService.removeMember(currentRoom.id, memberUserId);
    } catch {
      // Ignore
    }
  };

  return (
    <div>
      <h3
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "var(--color-text-muted)",
          marginBottom: "12px",
        }}
      >
        Members ({members.length})
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {members.map((member) => {
          const isCurrentUser = member.user_id === userId;
          const isMemberHost = member.role === "host";
          const profile = member.profiles;

          return (
            <div
              key={member.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
                background: isCurrentUser
                  ? "rgba(29, 185, 84, 0.05)"
                  : "transparent",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "var(--color-primary)",
                  flexShrink: 0,
                }}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {profile?.display_name ?? "Unknown"}
                  {isCurrentUser && (
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--color-text-muted)",
                        fontWeight: 400,
                      }}
                    >
                      {" "}
                      (you)
                    </span>
                  )}
                </div>
              </div>

              {isMemberHost && (
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "var(--color-primary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Host
                </span>
              )}

              {isHost && !isCurrentUser && !isMemberHost && (
                <button
                  onClick={() => handleRemoveMember(member.user_id)}
                  style={{
                    fontSize: "12px",
                    color: "var(--color-danger)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "2px 4px",
                  }}
                  title="Remove member"
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
