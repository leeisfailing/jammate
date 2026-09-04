export interface SpotifyTokenData {
  access_token: string;
  refresh_token: string | null;
  expires_at: number;
  scope: string;
}

export interface User {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface SpotifyConnection {
  id: string;
  user_id: string;
  spotify_user_id: string;
  display_name: string | null;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  scopes: string[];
  connected_at: string;
}

export type RoomStatus = "active" | "paused" | "closed";
export type RoomMemberRole = "host" | "member";

export interface Room {
  id: string;
  room_code: string;
  host_user_id: string;
  status: string;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
}

export interface RoomMember {
  id: string;
  room_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  last_seen_at: string;
  profiles?: Profile | null;
}

export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export type QueueItemStatus = "queued" | "playing" | "completed" | "removed";

export interface QueueItem {
  id: string;
  room_id: string;
  spotify_track_id: string;
  spotify_track_uri: string;
  track_name: string;
  artist_name: string;
  album_name: string | null;
  album_image_url: string | null;
  added_by: string;
  vote_count: number;
  position: number;
  status: string;
  created_at: string;
}

export interface Vote {
  id: string;
  queue_item_id: string;
  user_id: string;
  created_at: string;
}

export interface SpotifyTrack {
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
}

export interface SpotifySearchResult {
  tracks: {
    items: SpotifyTrack[];
    total: number;
  };
}

export interface SpotifyTokenData {
  access_token: string;
  refresh_token: string | null;
  expires_at: number;
  scope: string;
}

export interface PlaybackState {
  is_playing: boolean;
  track: SpotifyTrack | null;
  progress_ms: number;
  shuffle_state: boolean;
  repeat_state: string;
  volume_percent: number;
}

export interface RealtimeEvent {
  type: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

export type RealtimeEventType =
  | "ROOM_MEMBER_JOINED"
  | "ROOM_MEMBER_LEFT"
  | "QUEUE_ADDED"
  | "QUEUE_REMOVED"
  | "QUEUE_UPDATED"
  | "VOTE_UPDATED"
  | "PLAYBACK_UPDATED"
  | "ROOM_LOCKED"
  | "ROOM_CLOSED";
