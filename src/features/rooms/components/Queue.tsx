import { useState, useEffect, useCallback, useRef } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRoomStore } from "@/stores/roomStore";
import { usePlayerStore } from "@/stores/playerStore";
import { queueService } from "@/lib/supabase/queue";
import { spotifyApi } from "@/lib/spotify/api";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import type { QueueItem } from "@/types";

interface QueueProps {
  onAddSong: () => void;
}

export function Queue({ onAddSong }: QueueProps) {
  const { userId } = useAuthStore();
  const { queue, currentRoom } = useRoomStore();
  const { isHost, spotifyAccessToken } = usePlayerStore();
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());
  const [voting, setVoting] = useState<string | null>(null);
  const votesLoadedRef = useRef(false);

  const loadUserVotes = useCallback(async () => {
    if (!currentRoom || !userId) return;
    try {
      const votes = await queueService.getUserVotes(currentRoom.id, userId);
      setUserVotes(votes);
      votesLoadedRef.current = true;
    } catch {
      // Ignore
    }
  }, [currentRoom, userId]);

  useEffect(() => {
    if (!votesLoadedRef.current) {
      loadUserVotes();
    }
  }, [loadUserVotes]);

  const handleVote = async (itemId: string) => {
    if (!userId || voting) return;
    setVoting(itemId);
    try {
      await queueService.vote(itemId, userId);
      await loadUserVotes();
    } catch {
      // Ignore
    } finally {
      setVoting(null);
    }
  };

  const handlePlayNext = async (item: QueueItem) => {
    if (!isHost || !spotifyAccessToken) return;
    try {
      await spotifyApi.play(spotifyAccessToken, [item.spotify_track_uri]);
      await queueService.markPlaying(item.id);
    } catch {
      // Ignore
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      await queueService.removeTrack(itemId);
    } catch {
      // Ignore
    }
  };

  if (queue.length === 0) {
    return (
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--color-text-muted)",
            }}
          >
            Queue
          </h3>
          <Button variant="secondary" size="sm" onClick={onAddSong}>
            + Add Song
          </Button>
        </div>
        <EmptyState
          title="Queue is empty"
          description="Search for songs to add them to the queue."
          action={
            <Button size="sm" onClick={onAddSong}>
              Search Spotify
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <h3
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--color-text-muted)",
          }}
        >
          Queue ({queue.length})
        </h3>
        <Button variant="secondary" size="sm" onClick={onAddSong}>
          + Add Song
        </Button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {queue.map((item, index) => {
          const hasVoted = userVotes.has(item.id);
          const albumImage = item.album_image_url;

          return (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 12px",
                borderRadius: "var(--radius-lg)",
                background: "var(--color-surface)",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-surface-hover)";
                e.currentTarget.style.transform = "translateX(2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--color-surface)";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--color-text-muted)",
                  width: "20px",
                  textAlign: "right",
                }}
              >
                {index + 1}
              </span>

              {albumImage ? (
                <img
                  src={albumImage}
                  alt={item.track_name}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "var(--radius-sm)",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--color-bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    color: "var(--color-text-muted)",
                  }}
                >
                  ♪
                </div>
              )}

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
                  {item.track_name}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--color-text-muted)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.artist_name}
                </div>
              </div>

              <button
                onClick={() => handleVote(item.id)}
                disabled={voting === item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "4px 10px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: hasVoted
                    ? "var(--color-primary)"
                    : "var(--color-text-muted)",
                  background: hasVoted
                    ? "var(--color-primary-dim)"
                    : "transparent",
                  border: hasVoted
                    ? "1px solid var(--color-primary)"
                    : "1px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                ▲ {item.vote_count}
              </button>

              {isHost && (
                <div style={{ display: "flex", gap: "4px" }}>
                  <button
                    onClick={() => handlePlayNext(item)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "12px",
                      color: "var(--color-text-muted)",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                    title="Play next"
                  >
                    ▶
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "12px",
                      color: "var(--color-danger)",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
