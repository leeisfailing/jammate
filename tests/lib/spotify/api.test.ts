import { describe, it, expect, vi, beforeEach } from "vitest";
import { spotifyApi } from "@/lib/spotify/api";

vi.mock("@/lib/spotify/config", () => ({
  SPOTIFY_CONFIG: {
    apiBase: "https://api.spotify.com/v1",
  },
}));

describe("spotifyApi", () => {
  const mockAccessToken = "test-token";

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("search", () => {
    it("should fetch search results", async () => {
      const mockResponse = { tracks: { items: [], total: 0 } };
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await spotifyApi.search(mockAccessToken, "test");
      expect(result).toEqual(mockResponse);
      expect(fetchSpy).toHaveBeenCalled();
    });

    it("should throw on failed search", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: false,
        status: 401,
      } as Response);

      await expect(spotifyApi.search(mockAccessToken, "test")).rejects.toThrow("Failed to search Spotify.");
      expect(fetchSpy).toHaveBeenCalled();
    });
  });

  describe("getPlaybackState", () => {
    it("should return playback state", async () => {
      const mockData = { is_playing: true, item: null, progress_ms: 0, shuffle_state: false, repeat_state: "off", device: { volume_percent: 50 } };
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response);

      const result = await spotifyApi.getPlaybackState(mockAccessToken);
      expect(result).toEqual(mockData);
      expect(fetchSpy).toHaveBeenCalled();
    });

    it("should return null for 204 status", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        status: 204,
        ok: false,
      } as Response);

      const result = await spotifyApi.getPlaybackState(mockAccessToken);
      expect(result).toBeNull();
    });
  });

  describe("play", () => {
    it("should call play endpoint", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        status: 204,
      } as Response);

      await expect(spotifyApi.play(mockAccessToken, ["spotify:track:123"])).resolves.not.toThrow();
      expect(fetchSpy).toHaveBeenCalled();
    });

    it("should throw on failed play", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: false,
        status: 403,
      } as Response);

      await expect(spotifyApi.play(mockAccessToken)).rejects.toThrow("Failed to start playback.");
      expect(fetchSpy).toHaveBeenCalled();
    });
  });

  describe("pause", () => {
    it("should call pause endpoint", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        status: 204,
      } as Response);

      await expect(spotifyApi.pause(mockAccessToken)).resolves.not.toThrow();
      expect(fetchSpy).toHaveBeenCalled();
    });
  });

  describe("next", () => {
    it("should call next endpoint", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        status: 204,
      } as Response);

      await expect(spotifyApi.next(mockAccessToken)).resolves.not.toThrow();
      expect(fetchSpy).toHaveBeenCalled();
    });
  });

  describe("previous", () => {
    it("should call previous endpoint", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        status: 204,
      } as Response);

      await expect(spotifyApi.previous(mockAccessToken)).resolves.not.toThrow();
      expect(fetchSpy).toHaveBeenCalled();
    });
  });

  describe("seek", () => {
    it("should call seek endpoint", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        status: 204,
      } as Response);

      await expect(spotifyApi.seek(mockAccessToken, 30000)).resolves.not.toThrow();
      expect(fetchSpy).toHaveBeenCalled();
    });
  });

  describe("getDevices", () => {
    it("should return devices", async () => {
      const data = { devices: [{ id: "d1", name: "Device", type: "Speaker", is_active: true }] };
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(data),
      } as Response);

      const result = await spotifyApi.getDevices(mockAccessToken);
      expect(result).toEqual(data.devices);
    });

    it("should return empty array on failure", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: false,
      } as Response);

      const result = await spotifyApi.getDevices(mockAccessToken);
      expect(result).toEqual([]);
    });
  });
});
