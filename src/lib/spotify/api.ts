import { SPOTIFY_CONFIG } from "@/lib/spotify/config";

export const spotifyApi = {
  async search(
    accessToken: string,
    query: string,
    limit = 20
  ): Promise<{
    tracks: {
      items: Array<{
        id: string;
        uri: string;
        name: string;
        artists: { id: string; name: string }[];
        album: {
          id: string;
          name: string;
          images: { url: string; height: number; width: number }[];
        };
        duration_ms: number;
        preview_url: string | null;
      }>;
      total: number;
    };
  }> {
    const params = new URLSearchParams({
      q: query,
      type: "track",
      limit: limit.toString(),
    });

    const response = await fetch(
      `${SPOTIFY_CONFIG.apiBase}/search?${params}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to search Spotify.");
    }

    return response.json();
  },

  async getPlaybackState(accessToken: string): Promise<{
    is_playing: boolean;
    item: {
      id: string;
      uri: string;
      name: string;
      artists: { id: string; name: string }[];
      album: {
        id: string;
        name: string;
        images: { url: string; height: number; width: number }[];
      };
      duration_ms: number;
    } | null;
    progress_ms: number;
    shuffle_state: boolean;
    repeat_state: string;
    device: { volume_percent: number };
  } | null> {
    const response = await fetch(`${SPOTIFY_CONFIG.apiBase}/me/player`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 204) return null;
    if (!response.ok) return null;

    return response.json();
  },

  async play(
    accessToken: string,
    uris?: string[],
    deviceId?: string
  ): Promise<void> {
    const body: Record<string, unknown> = {};
    if (uris) body.uris = uris;

    const params = deviceId ? `?device_id=${deviceId}` : "";

    const response = await fetch(
      `${SPOTIFY_CONFIG.apiBase}/me/player/play${params}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok && response.status !== 204) {
      throw new Error("Failed to start playback.");
    }
  },

  async pause(accessToken: string): Promise<void> {
    const response = await fetch(`${SPOTIFY_CONFIG.apiBase}/me/player/pause`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok && response.status !== 204) {
      throw new Error("Failed to pause playback.");
    }
  },

  async next(accessToken: string): Promise<void> {
    const response = await fetch(
      `${SPOTIFY_CONFIG.apiBase}/me/player/next`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok && response.status !== 204) {
      throw new Error("Failed to skip track.");
    }
  },

  async previous(accessToken: string): Promise<void> {
    const response = await fetch(
      `${SPOTIFY_CONFIG.apiBase}/me/player/previous`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok && response.status !== 204) {
      throw new Error("Failed to go to previous track.");
    }
  },

  async seek(accessToken: string, positionMs: number): Promise<void> {
    const params = new URLSearchParams({
      position_ms: positionMs.toString(),
    });

    const response = await fetch(
      `${SPOTIFY_CONFIG.apiBase}/me/player/seek?${params}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok && response.status !== 204) {
      throw new Error("Failed to seek.");
    }
  },

  async getDevices(accessToken: string): Promise<
    {
      id: string;
      name: string;
      type: string;
      is_active: boolean;
    }[]
  > {
    const response = await fetch(`${SPOTIFY_CONFIG.apiBase}/me/player/devices`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) return [];

    const data = await response.json();
    return data.devices ?? [];
  },
};
