import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { listen } from "@tauri-apps/api/event";
import { useAuthStore } from "@/stores/authStore";
import { usePlayerStore } from "@/stores/playerStore";
import { SPOTIFY_CONFIG } from "@/lib/spotify/config";
import {
  startSpotifyAuth,
  getStoredSpotifyToken,
  logoutSpotify,
  refreshSpotifyToken,
} from "@/lib/tauri/commands";
import { Button } from "@/components/ui/Button";

export function SettingsPage() {
  const navigate = useNavigate();
  const { userId } = useAuthStore();
  const { setSpotifyAccessToken } = usePlayerStore();
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [spotifyName, setSpotifyName] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");
  const connectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearConnectTimeout = () => {
    if (connectTimeoutRef.current) {
      clearTimeout(connectTimeoutRef.current);
      connectTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    const checkSpotify = async () => {
      try {
        const token = await getStoredSpotifyToken();
        if (token) {
          setSpotifyConnected(true);
          setSpotifyAccessToken(token.access_token);
          setSpotifyName("Connected");
        }
      } catch {
        // Not connected
      }
    };
    checkSpotify();

    const unlistenComplete = listen<boolean>("spotify-auth-complete", async () => {
      clearConnectTimeout();
      try {
        const token = await getStoredSpotifyToken();
        if (token) {
          setSpotifyConnected(true);
          setSpotifyAccessToken(token.access_token);
          setSpotifyName("Connected");
          setConnecting(false);
          setError("");
        }
      } catch {
        setConnecting(false);
      }
    });

    const unlistenError = listen<string>("spotify-auth-error", (event) => {
      clearConnectTimeout();
      setError(event.payload);
      setConnecting(false);
    });

    return () => {
      clearConnectTimeout();
      unlistenComplete.then((fn) => fn());
      unlistenError.then((fn) => fn());
    };
  }, [setSpotifyAccessToken]);

  const handleConnectSpotify = async () => {
    setConnecting(true);
    setError("");
    clearConnectTimeout();
    connectTimeoutRef.current = setTimeout(() => {
      setError("Spotify connection timed out. Please try again.");
      setConnecting(false);
    }, 180_000);

    try {
      await startSpotifyAuth(
        SPOTIFY_CONFIG.clientId,
        SPOTIFY_CONFIG.redirectUri
      );
    } catch (err) {
      clearConnectTimeout();
      setConnecting(false);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to start Spotify connection."
      );
    }
  };

  const handleDisconnectSpotify = async () => {
    try {
      await logoutSpotify();
      setSpotifyConnected(false);
      setSpotifyAccessToken(null);
      setSpotifyName(null);
    } catch {
      // Ignore
    }
  };

  const handleRefreshToken = async () => {
    try {
      const newToken = await refreshSpotifyToken(SPOTIFY_CONFIG.clientId);
      setSpotifyAccessToken(newToken);
    } catch {
      // Ignore
    }
  };

  return (
    <div
      style={{
        maxWidth: "480px",
        margin: "0 auto",
        padding: "48px 24px",
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={{
          fontSize: "13px",
          color: "var(--color-text-muted)",
          marginBottom: "24px",
        }}
      >
        Back to Home
      </button>

      <h1
        style={{
          fontSize: "24px",
          fontWeight: 700,
          marginBottom: "32px",
        }}
      >
        Settings
      </h1>

      <section style={{ marginBottom: "32px" }}>
        <h2
          style={{
            fontSize: "16px",
            fontWeight: 600,
            marginBottom: "12px",
          }}
        >
          Spotify Connection
        </h2>

        <div
          style={{
            padding: "16px",
            borderRadius: "var(--radius-md)",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          {spotifyConnected ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "var(--color-primary)",
                    boxShadow: "0 0 8px var(--color-glow)",
                  }}
                />
                <span style={{ fontSize: "14px", fontWeight: 500 }}>
                  {spotifyName ?? "Connected to Spotify"}
                </span>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRefreshToken}
                >
                  Refresh Token
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDisconnectSpotify}
                >
                  Disconnect
                </Button>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--color-text-muted)",
                }}
              >
                Connect your Spotify account to search songs and control
                playback.
              </p>
              <Button
                onClick={handleConnectSpotify}
                disabled={connecting}
                style={{ alignSelf: "flex-start" }}
              >
                {connecting ? "Waiting for Spotify..." : "Connect Spotify"}
              </Button>
              {connecting && (
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--color-text-muted)",
                  }}
                >
                  Finish signing in with Spotify in your browser.
                </p>
              )}
            </div>
          )}

          {error && (
            <p
              style={{
                fontSize: "13px",
                color: "var(--color-danger)",
                marginTop: "8px",
              }}
            >
              {error}
            </p>
          )}
        </div>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2
          style={{
            fontSize: "16px",
            fontWeight: 600,
            marginBottom: "12px",
          }}
        >
          Account
        </h2>

        <div
          style={{
            padding: "16px",
            borderRadius: "var(--radius-md)",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              color: "var(--color-text-muted)",
              marginBottom: "12px",
            }}
          >
            User ID: {userId?.slice(0, 8)}...
          </p>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              navigate("/login");
            }}
          >
            Sign Out
          </Button>
        </div>
      </section>
    </div>
  );
}
