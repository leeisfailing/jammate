import { describe, it, expect, beforeEach } from "vitest";
import { useRoomStore } from "@/stores/roomStore";
import type { Room } from "@/types";

describe("RoomPage", () => {
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

  beforeEach(() => {
    useRoomStore.setState({
      currentRoom: null,
      members: [],
      queue: [],
      isConnected: false,
    });
  });

  it("should set current room", () => {
    useRoomStore.getState().setRoom(mockRoom);
    expect(useRoomStore.getState().currentRoom).toEqual(mockRoom);
  });

  it("should leave room and reset state", () => {
    useRoomStore.getState().setRoom(mockRoom);
    useRoomStore.getState().setConnected(true);
    useRoomStore.getState().leaveRoom();
    expect(useRoomStore.getState().currentRoom).toBeNull();
    expect(useRoomStore.getState().isConnected).toBe(false);
  });
});
