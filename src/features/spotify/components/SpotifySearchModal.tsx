import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRoomStore } from "@/stores/roomStore";
import { usePlayerStore } from "@/stores/playerStore";
import { spotifyApi } from "@/lib/spotify/api";
import { queueService } from "@/lib/supabase/queue";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import type { SpotifyTrack } from "@/types";

interface SpotifySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SpotifySearchModal({ isOpen, onClose }: SpotifySearchModalProps) {
  const { userId } = useAuthStore();
  const { currentRoom } = useRoomStore();
  const { spotifyAccessToken } = usePlayerStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim() || !spotifyAccessToken) return;
    setSearching(true);
    try {
      const data = await spotifyApi.search(spotifyAccessToken, query.trim());
      setResults(data.tracks.items);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleAdd = async (track: SpotifyTrack) => {
    if (!currentRoom || !userId || adding) return;
    setAdding(track.id);
    try {
      await queueService.addTrack(
        currentRoom.id,
        {
          spotify_track_id: track.id,
          spotify_track_uri: track.uri,
          track_name: track.name,
          artist_name: track.artists.map((a) => a.name).join(", "),
          album_name: track.album.name,
          album_image_url: track.album.images[0]?.url ?? null,
        },
        userId
      );
    } catch {
      // Ignore
    } finally {
      setAdding(null);
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setQuery("");
        setResults([]);
      }}
      title="Search Spotify"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ flex: 1 }}>
            <Input
              placeholder="Search for songs, artists, or albums..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={searching || !query.trim()}
            style={{
              padding: "10px 20px",
              borderRadius: "var(--radius-md)",
              background: "var(--color-primary)",
              color: "#000",
              fontWeight: 600,
              fontSize: "14px",
              cursor: searching ? "not-allowed" : "pointer",
              opacity: searching || !query.trim() ? 0.5 : 1,
              transition: "all 0.2s",
              border: "none",
            }}
          >
            {searching ? "..." : "Search"}
          </button>
        </div>

        {!spotifyAccessToken && (
          <p
            style={{
              fontSize: "13px",
              color: "var(--color-warning)",
              textAlign: "center",
              padding: "16px",
            }}
          >
            Connect Spotify from Settings to search.
          </p>
        )}

        <div
          style={{
            maxHeight: "400px",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {results.map((track) => (
            <div
              key={track.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 12px",
                borderRadius: "var(--radius-md)",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-surface-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {track.album.images[0] ? (
                <img
                  src={track.album.images[0].url}
                  alt={track.name}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "var(--radius-sm)",
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--color-surface)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: "16px",
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
                  {track.name}
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
                  {track.artists.map((a) => a.name).join(", ")}
                </div>
              </div>

              <span
                style={{
                  fontSize: "12px",
                  color: "var(--color-text-muted)",
                  flexShrink: 0,
                }}
              >
                {formatDuration(track.duration_ms)}
              </span>

              <button
                onClick={() => handleAdd(track)}
                disabled={adding === track.id}
                style={{
                  padding: "7px 14px",
                  borderRadius: "var(--radius-md)",
                  background: adding === track.id ? "var(--color-surface)" : "var(--color-primary)",
                  color: adding === track.id ? "var(--color-text-muted)" : "#000",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: adding === track.id ? "not-allowed" : "pointer",
                  flexShrink: 0,
                  border: "none",
                  transition: "all 0.2s",
                }}
              >
                {adding === track.id ? "Adding..." : "+ Add"}
              </button>
            </div>
          ))}

          {results.length === 0 && !searching && query && (
            <p
              style={{
                textAlign: "center",
                color: "var(--color-text-muted)",
                padding: "24px",
                fontSize: "14px",
              }}
            >
              No results found.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
