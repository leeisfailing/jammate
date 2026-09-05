import { describe, it, expect } from "vitest";
import type { Database } from "@/types/database";
import type { Room } from "@/types";
import type { SpotifyTrack, SpotifySearchResult, PlaybackState } from "@/types";

describe("Type definitions", () => {
  it("should have correct type structure for Room", () => {
    const room: Room = {
      id: "room-1",
      room_code: "ABC123",
      host_user_id: "host-1",
      status: "active",
      is_locked: false,
      created_at: "2025-01-01",
      updated_at: "2025-01-01",
      expires_at: null,
    };
    expect(room.id).toBe("room-1");
    expect(room.room_code).toBe("ABC123");
  });

  it("should have correct type structure for SpotifyTrack", () => {
    const track: SpotifyTrack = {
      id: "track-1",
      uri: "spotify:track:track-1",
      name: "Test Song",
      artists: [{ id: "artist-1", name: "Test Artist" }],
      album: {
        id: "album-1",
        name: "Test Album",
        images: [{ url: "https://example.com/image.jpg", height: 300, width: 300 }],
      },
      duration_ms: 180000,
      preview_url: null,
    };
    expect(track.name).toBe("Test Song");
  });

  it("should have correct type structure for PlaybackState", () => {
    const playback: PlaybackState = {
      is_playing: true,
      track: null,
      progress_ms: 30000,
      shuffle_state: false,
      repeat_state: "off",
      volume_percent: 50,
    };
    expect(playback.is_playing).toBe(true);
    expect(playback.volume_percent).toBe(50);
  });
});
