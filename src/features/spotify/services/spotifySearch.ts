import type { SpotifySearchResult } from "@/types";
import { SPOTIFY_CONFIG } from "@/lib/spotify/config";

export async function searchTracks(
  accessToken: string,
  query: string,
  limit = 20
): Promise<SpotifySearchResult> {
  const params = new URLSearchParams({
    q: query,
    type: "track",
    limit: limit.toString(),
  });

  const response = await fetch(
    `${SPOTIFY_CONFIG.apiBase}/search?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Spotify search failed: ${response.status}`);
  }

  return response.json();
}
