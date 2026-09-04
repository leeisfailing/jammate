import { create } from "zustand";
import type { PlaybackState } from "@/types";

interface PlayerState {
  playback: PlaybackState | null;
  isHost: boolean;
  spotifyAccessToken: string | null;

  setPlayback: (playback: PlaybackState | null) => void;
  setIsHost: (isHost: boolean) => void;
  setSpotifyAccessToken: (token: string | null) => void;
  reset: () => void;
}

export const usePlayerStore = create<PlayerState>()((set) => ({
  playback: null,
  isHost: false,
  spotifyAccessToken: null,

  setPlayback: (playback) => set({ playback }),
  setIsHost: (isHost) => set({ isHost }),
  setSpotifyAccessToken: (token) => set({ spotifyAccessToken: token }),
  reset: () =>
    set({
      playback: null,
      isHost: false,
      spotifyAccessToken: null,
    }),
}));
