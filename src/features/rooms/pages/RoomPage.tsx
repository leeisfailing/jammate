import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useRoomStore } from "@/stores/roomStore";
import { usePlayerStore } from "@/stores/playerStore";
import { roomService } from "@/lib/supabase/rooms";
import { supabase } from "@/lib/supabase/client";
import { RoomHeader } from "@/features/rooms/components/RoomHeader";
import { NowPlaying } from "@/features/rooms/components/NowPlaying";
import { Queue } from "@/features/rooms/components/Queue";
import { Members } from "@/features/rooms/components/Members";
import { SpotifySearchModal } from "@/features/spotify/components/SpotifySearchModal";

export function RoomPage() {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const { userId } = useAuthStore();
  const { setRoom, setMembers, setQueue, setConnected, leaveRoom } =
    useRoomStore();
  const { setIsHost } = usePlayerStore();
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadRoom = useCallback(async () => {
    if (!roomCode || !userId) return;

    try {
      const room = await roomService.getRoom(roomCode);
      if (!room || room.status === "closed") {
        navigate("/");
        return;
      }

      setRoom(room);
      setIsHost(room.host_user_id === userId);
      setConnected(true);

      const members = await roomService.getMembers(room.id);
      setMembers(members);

      const queue = await roomService.getQueue(room.id);
      setQueue(queue);
    } catch {
      navigate("/");
    } finally {
      setLoading(false);
    }
  }, [roomCode, userId, navigate, setRoom, setIsHost, setConnected, setMembers, setQueue]);

  useEffect(() => {
    loadRoom();
  }, [loadRoom]);

  useEffect(() => {
    if (!roomCode) return;

    const channel = supabase
      .channel(`room:${roomCode}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "room_members",
        },
        () => {
          loadRoom();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "queue_items",
        },
        () => {
          loadRoom();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "votes",
        },
        () => {
          loadRoom();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rooms",
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            const room = payload.new;
            if (room.status === "closed") {
              leaveRoom();
              navigate("/");
            }
          }
          loadRoom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomCode, loadRoom, leaveRoom, navigate]);

  useEffect(() => {
    return () => {
      leaveRoom();
    };
  }, [leaveRoom]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "var(--color-text-muted)",
        }}
      >
        Joining room...
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <RoomHeader onSearch={() => setShowSearch(true)} />

      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
            padding: "20px",
          }}
        >
          <NowPlaying />
          <Queue onAddSong={() => setShowSearch(true)} />
        </div>

        <div
          style={{
            width: "260px",
            borderLeft: "1px solid var(--color-border)",
            padding: "20px",
            overflow: "auto",
            flexShrink: 0,
          }}
        >
          <Members />
        </div>
      </div>

      <SpotifySearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
      />
    </div>
  );
}
