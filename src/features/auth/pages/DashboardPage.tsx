import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listen } from "@tauri-apps/api/event";
import { useAuthStore } from "@/stores/authStore";
import { useRoomStore } from "@/stores/roomStore";
import { usePlayerStore } from "@/stores/playerStore";
import { roomService } from "@/lib/supabase/rooms";
import { getStoredSpotifyToken, logoutSpotify } from "@/lib/tauri/commands";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import type { Room } from "@/types";

export function DashboardPage() {
  const navigate = useNavigate();
  const { userId, clearAuth } = useAuthStore();
  const { setRoom } = useRoomStore();
  const { setSpotifyAccessToken, setIsHost } = usePlayerStore();

  const [joinCode, setJoinCode] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentRooms, setRecentRooms] = useState<Room[]>([]);
  const [spotifyConnected, setSpotifyConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      try {
        const rooms = await roomService.getUserRooms(userId);
        setRecentRooms(rooms);
      } catch {
        // Ignore errors loading recent rooms
      }

      try {
        const token = await getStoredSpotifyToken();
        if (token) {
          setSpotifyConnected(true);
          setSpotifyAccessToken(token.access_token);
        }
      } catch {
        // Token not available
      }
    };

    load();

    const unlisten = listen<boolean>("spotify-auth-complete", async () => {
      try {
        const token = await getStoredSpotifyToken();
        if (token) {
          setSpotifyConnected(true);
          setSpotifyAccessToken(token.access_token);
        }
      } catch {
        // ignore
      }
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, [userId, setSpotifyAccessToken]);

  const handleCreateRoom = async () => {
    if (!userId) return;
    setLoading(true);
    setError("");

    try {
      const room = await roomService.createRoom(userId);
      setRoom(room);
      setIsHost(true);
      navigate(`/room/${room.room_code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create room.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!userId || !joinCode.trim()) return;
    setLoading(true);
    setError("");

    try {
      const room = await roomService.joinRoom(joinCode.trim(), userId);
      setRoom(room);
      setIsHost(room.host_user_id === userId);
      navigate(`/room/${room.room_code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join room.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutSpotify();
    } catch {
      // Ignore
    }
    clearAuth();
    navigate("/login");
  };

  return (
    <div
      style={{
        maxWidth: "640px",
        margin: "0 auto",
        padding: "48px 24px",
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      <div style={{ marginBottom: "40px" }}>
        <h1
          style={{
            fontSize: "26px",
            fontWeight: 800,
            marginBottom: "6px",
            letterSpacing: "-0.5px",
          }}
        >
          Welcome back
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--color-text-muted)",
          }}
        >
          {spotifyConnected
            ? "Spotify connected"
            : "Connect Spotify from Settings to start listening"}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "36px",
        }}
      >
        <Button
          onClick={handleCreateRoom}
          disabled={loading}
          size="lg"
          style={{ flex: 1 }}
        >
          Create Room
        </Button>
        <Button
          variant="secondary"
          onClick={() => setShowJoinModal(true)}
          size="lg"
          style={{ flex: 1 }}
        >
          Join Room
        </Button>
      </div>

      {error && (
        <p
          style={{
            fontSize: "13px",
            color: "var(--color-danger)",
            marginBottom: "16px",
          }}
        >
          {error}
        </p>
      )}

      {recentRooms.length > 0 && (
        <div>
          <h2
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--color-text-muted)",
              marginBottom: "12px",
            }}
          >
            Recent Rooms
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {recentRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => {
                  setRoom(room);
                  setIsHost(room.host_user_id === userId);
                  navigate(`/room/${room.room_code}`);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  cursor: "pointer",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--color-surface-hover)";
                  e.currentTarget.style.borderColor = "var(--color-primary)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--color-surface)";
                  e.currentTarget.style.borderColor = "var(--color-border)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontFamily: "monospace",
                      color: "var(--color-primary)",
                    }}
                  >
                    {room.room_code}
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {room.host_user_id === userId ? "Host" : "Member"}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {room.is_locked ? "Locked" : "Open"}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {recentRooms.length === 0 && (
        <EmptyState
          title="No rooms yet"
          description="Create a room or join one with a code to get started."
        />
      )}

      <Modal
        isOpen={showJoinModal}
        onClose={() => {
          setShowJoinModal(false);
          setJoinCode("");
          setError("");
        }}
        title="Join Room"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Input
            label="Room Code"
            placeholder="Enter 6-character code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleJoinRoom();
            }}
            maxLength={6}
            style={{ fontFamily: "monospace", letterSpacing: "2px" }}
          />
          {error && (
            <p style={{ fontSize: "13px", color: "var(--color-danger)" }}>
              {error}
            </p>
          )}
          <Button
            onClick={handleJoinRoom}
            disabled={loading || joinCode.length < 6}
            style={{ width: "100%" }}
          >
            Join Room
          </Button>
        </div>
      </Modal>

      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
        }}
      >
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Sign Out
        </Button>
      </div>
    </div>
  );
}
