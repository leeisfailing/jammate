import { describe, it, expect, beforeEach } from "vitest";
import { useRoomStore } from "@/stores/roomStore";
import type { Room, RoomMember, QueueItem } from "@/types";

describe("useRoomStore", () => {
  const mockRoom: Room = {
    id: "room-1",
    room_code: "ABC123",
    host_user_id: "host-1",
    status: "active",
    is_locked: false,
    created_at: "2025-01-01",
    updated_at: "2025-01-01",
    expires_at: null,
  };

  const mockMember: RoomMember = {
    id: "member-1",
    room_id: "room-1",
    user_id: "user-1",
    role: "member",
    joined_at: "2025-01-01",
    last_seen_at: "2025-01-01",
  };

  const mockQueueItem: QueueItem = {
    id: "item-1",
    room_id: "room-1",
    spotify_track_id: "track-1",
    spotify_track_uri: "spotify:track:track-1",
    track_name: "Test Song",
    artist_name: "Test Artist",
    album_name: "Test Album",
    album_image_url: null,
    added_by: "user-1",
    vote_count: 0,
    position: 1,
    status: "queued",
    created_at: "2025-01-01",
  };

  beforeEach(() => {
    useRoomStore.setState({
      currentRoom: null,
      members: [],
      queue: [],
      isConnected: false,
    });
  });

  it("should have initial state", () => {
    const state = useRoomStore.getState();
    expect(state.currentRoom).toBeNull();
    expect(state.members).toEqual([]);
    expect(state.queue).toEqual([]);
    expect(state.isConnected).toBe(false);
  });

  it("setRoom should set the current room", () => {
    useRoomStore.getState().setRoom(mockRoom);
    expect(useRoomStore.getState().currentRoom).toEqual(mockRoom);
  });

  it("setMembers should set members", () => {
    useRoomStore.getState().setMembers([mockMember]);
    expect(useRoomStore.getState().members).toEqual([mockMember]);
  });

  it("setQueue should set queue", () => {
    useRoomStore.getState().setQueue([mockQueueItem]);
    expect(useRoomStore.getState().queue).toEqual([mockQueueItem]);
  });

  it("addQueueItem should append an item", () => {
    useRoomStore.getState().addQueueItem(mockQueueItem);
    expect(useRoomStore.getState().queue).toHaveLength(1);
    expect(useRoomStore.getState().queue[0]).toEqual(mockQueueItem);
  });

  it("removeQueueItem should remove item by id", () => {
    useRoomStore.getState().setQueue([mockQueueItem]);
    useRoomStore.getState().removeQueueItem("item-1");
    expect(useRoomStore.getState().queue).toHaveLength(0);
  });

  it("updateQueueItem should update item by id", () => {
    useRoomStore.getState().setQueue([mockQueueItem]);
    useRoomStore.getState().updateQueueItem("item-1", { vote_count: 5 });
    expect(useRoomStore.getState().queue[0].vote_count).toBe(5);
  });

  it("setConnected should update connection status", () => {
    useRoomStore.getState().setConnected(true);
    expect(useRoomStore.getState().isConnected).toBe(true);
  });

  it("leaveRoom should reset all state", () => {
    useRoomStore.getState().setRoom(mockRoom);
    useRoomStore.getState().setMembers([mockMember]);
    useRoomStore.getState().setQueue([mockQueueItem]);
    useRoomStore.getState().setConnected(true);
    useRoomStore.getState().leaveRoom();

    const state = useRoomStore.getState();
    expect(state.currentRoom).toBeNull();
    expect(state.members).toEqual([]);
    expect(state.queue).toEqual([]);
    expect(state.isConnected).toBe(false);
  });
});
