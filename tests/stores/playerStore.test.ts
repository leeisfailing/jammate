import { describe, it, expect, beforeEach } from "vitest";
import { usePlayerStore } from "@/stores/playerStore";

describe("usePlayerStore", () => {
  beforeEach(() => {
    usePlayerStore.setState({
      playback: null,
      isHost: false,
      spotifyAccessToken: null,
    });
  });

  it("should have initial state", () => {
    const state = usePlayerStore.getState();
    expect(state.playback).toBeNull();
    expect(state.isHost).toBe(false);
    expect(state.spotifyAccessToken).toBeNull();
  });

  it("setPlayback should update playback state", () => {
    const playback = { is_playing: true, track: null, progress_ms: 30000, shuffle_state: false, repeat_state: "off", volume_percent: 50 };
    usePlayerStore.getState().setPlayback(playback);
    expect(usePlayerStore.getState().playback).toEqual(playback);
  });

  it("setIsHost should update host status", () => {
    usePlayerStore.getState().setIsHost(true);
    expect(usePlayerStore.getState().isHost).toBe(true);
    usePlayerStore.getState().setIsHost(false);
    expect(usePlayerStore.getState().isHost).toBe(false);
  });

  it("setSpotifyAccessToken should update token", () => {
    usePlayerStore.getState().setSpotifyAccessToken("token-123");
    expect(usePlayerStore.getState().spotifyAccessToken).toBe("token-123");
  });

  it("reset should clear all state", () => {
    usePlayerStore.getState().setPlayback({ is_playing: true, track: null, progress_ms: 0, shuffle_state: false, repeat_state: "off", volume_percent: 0 });
    usePlayerStore.getState().setIsHost(true);
    usePlayerStore.getState().setSpotifyAccessToken("token-123");
    usePlayerStore.getState().reset();

    const state = usePlayerStore.getState();
    expect(state.playback).toBeNull();
    expect(state.isHost).toBe(false);
    expect(state.spotifyAccessToken).toBeNull();
  });
});
