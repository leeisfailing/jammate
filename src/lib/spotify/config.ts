const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_REDIRECT_URI) {
  throw new Error(
    "Missing Spotify environment variables. Check VITE_SPOTIFY_CLIENT_ID and VITE_SPOTIFY_REDIRECT_URI in .env"
  );
}

export const SPOTIFY_CONFIG = {
  clientId: SPOTIFY_CLIENT_ID,
  redirectUri: SPOTIFY_REDIRECT_URI,
  scopes: [
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "user-read-email",
    "user-read-private",
  ],
  authEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
  apiBase: "https://api.spotify.com/v1",
} as const;
