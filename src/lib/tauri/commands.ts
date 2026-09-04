import { invoke } from "@tauri-apps/api/core";

interface SpotifyTokenData {
  access_token: string;
  refresh_token: string | null;
  expires_at: number;
  scope: string;
}

interface AuthStartResult {
  auth_url: string;
  code_verifier: string;
}

export async function startSpotifyAuth(
  clientId: string,
  redirectUri: string
): Promise<AuthStartResult> {
  return invoke<AuthStartResult>("start_spotify_auth", {
    clientId,
    redirectUri,
  });
}

export async function completeSpotifyAuth(
  code: string,
  codeVerifier: string,
  redirectUri: string,
  clientId: string
): Promise<{ id: string; display_name: string | null; email: string | null }> {
  return invoke("complete_spotify_auth", {
    code,
    codeVerifier,
    redirectUri,
    clientId,
  });
}

export async function refreshSpotifyToken(clientId: string): Promise<string> {
  return invoke<string>("refresh_spotify_token", { clientId });
}

export async function getStoredSpotifyToken(): Promise<SpotifyTokenData | null> {
  return invoke<SpotifyTokenData | null>("get_stored_spotify_token");
}

export async function logoutSpotify(): Promise<void> {
  return invoke("logout_spotify");
}
