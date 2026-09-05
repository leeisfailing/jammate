import { useState, useEffect, useCallback, useRef } from "react";
import { usePlayerStore } from "@/stores/playerStore";
import { useRoomStore } from "@/stores/roomStore";
import { spotifyApi } from "@/lib/spotify/api";
import type { PlaybackState } from "@/types";

export function NowPlaying() {
  const { playback, isHost, spotifyAccessToken, setPlayback } = usePlayerStore();
  const { currentRoom } = useRoomStore();
  const [isPolling, setIsPolling] = useState(false);
  const pollingRef = useRef(false);

  const fetchPlayback = useCallback(async () => {
    if (!spotifyAccessToken) return;

    try {
      const state = await spotifyApi.getPlaybackState(spotifyAccessToken);
      if (state) {
        const mapped: PlaybackState = {
          is_playing: state.is_playing,
          track: state.item
            ? {
                id: state.item.id,
                uri: state.item.uri,
                name: state.item.name,
                artists: state.item.artists,
                album: state.item.album,
                duration_ms: state.item.duration_ms,
                preview_url: null,
              }
            : null,
          progress_ms: state.progress_ms,
          shuffle_state: state.shuffle_state,
          repeat_state: state.repeat_state as PlaybackState["repeat_state"],
          volume_percent: state.device.volume_percent,
        };
        setPlayback(mapped);
      } else {
        setPlayback(null);
      }
    } catch {
      // Ignore polling errors
    }
  }, [spotifyAccessToken, setPlayback]);

  useEffect(() => {
    if (!isHost || !spotifyAccessToken || !currentRoom) return;

    fetchPlayback();
    const interval = setInterval(fetchPlayback, 3000);
    if (!pollingRef.current) {
      pollingRef.current = true;
      setIsPolling(true);
    }

    return () => {
      clearInterval(interval);
      pollingRef.current = false;
      setIsPolling(false);
    };
  }, [isHost, spotifyAccessToken, currentRoom, fetchPlayback]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const track = playback?.track;
  const albumImage = track?.album.images[0]?.url;
  const artistName = track?.artists.map((a) => a.name).join(", ") ?? "Unknown Artist";
  const trackName = track?.name ?? "No track playing";
  const duration = track?.duration_ms ?? 0;
  const progress = playback?.progress_ms ?? 0;
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 0",
      }}
    >
      <div
        style={{
          width: "220px",
          height: "220px",
          borderRadius: "var(--radius-xl)",
          background: "var(--color-surface)",
          overflow: "hidden",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.5)",
          border: "1px solid var(--color-border)",
        }}
      >
        {albumImage ? (
          <img
            src={albumImage}
            alt={trackName}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <span style={{ fontSize: "40px", color: "var(--color-text-muted)" }}>
            ♪
          </span>
        )}
      </div>

      <h2
        style={{
          fontSize: "20px",
          fontWeight: 700,
          marginBottom: "6px",
          textAlign: "center",
          letterSpacing: "-0.3px",
        }}
      >
        {trackName}
      </h2>
      <p
        style={{
          fontSize: "14px",
          color: "var(--color-text-muted)",
          marginBottom: "16px",
        }}
      >
        {artistName}
      </p>

      <div
        style={{
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "4px",
            background: "var(--color-surface-hover)",
            borderRadius: "2px",
            overflow: "hidden",
            marginBottom: "8px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: "100%",
              background: "var(--color-primary)",
              borderRadius: "2px",
              transition: "width 1s linear",
              boxShadow: "0 0 8px var(--color-glow)",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "12px",
            color: "var(--color-text-muted)",
          }}
        >
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {isPolling && (
        <div
          style={{
            marginTop: "8px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "11px",
            color: "var(--color-text-muted)",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--color-primary)",
            }}
          />
          Live
        </div>
      )}
    </div>
  );
}
