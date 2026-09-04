import type { PlaybackState } from "@/types";
import { SPOTIFY_CONFIG } from "@/lib/spotify/config";

export async function getCurrentPlayback(
  accessToken: string
): Promise<PlaybackState | null> {
  const response = await fetch(
    `${SPOTIFY_CONFIG.apiBase}/me/player`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (response.status === 204) return null;
  if (!response.ok) {
    throw new Error(`Failed to get playback state: ${response.status}`);
  }

  const data = await response.json();
  return {
    is_playing: data.is_playing,
    track: data.item,
    progress_ms: data.progress_ms,
    shuffle_state: data.shuffle_state,
    repeat_state: data.repeat_state,
    volume_percent: data.device?.volume_percent ?? 50,
  };
}

export async function addToQueue(
  accessToken: string,
  trackUri: string
): Promise<void> {
  const params = new URLSearchParams({ uri: trackUri });
  const response = await fetch(
    `${SPOTIFY_CONFIG.apiBase}/me/player/queue?${params.toString()}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok && response.status !== 204) {
    throw new Error(`Failed to add to queue: ${response.status}`);
  }
}

export async function skipNext(accessToken: string): Promise<void> {
  const response = await fetch(`${SPOTIFY_CONFIG.apiBase}/me/player/next`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok && response.status !== 204) {
    throw new Error(`Failed to skip: ${response.status}`);
  }
}

export async function skipPrevious(accessToken: string): Promise<void> {
  const response = await fetch(`${SPOTIFY_CONFIG.apiBase}/me/player/previous`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok && response.status !== 204) {
    throw new Error(`Failed to skip previous: ${response.status}`);
  }
}

export async function setShuffle(
  accessToken: string,
  state: boolean
): Promise<void> {
  const params = new URLSearchParams({ state: state.toString() });
  const response = await fetch(
    `${SPOTIFY_CONFIG.apiBase}/me/player/shuffle?${params.toString()}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok && response.status !== 204) {
    throw new Error(`Failed to set shuffle: ${response.status}`);
  }
}

export async function setRepeat(
  accessToken: string,
  state: "off" | "track" | "context"
): Promise<void> {
  const params = new URLSearchParams({ state });
  const response = await fetch(
    `${SPOTIFY_CONFIG.apiBase}/me/player/repeat?${params.toString()}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok && response.status !== 204) {
    throw new Error(`Failed to set repeat: ${response.status}`);
  }
}
