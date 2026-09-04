import { create } from "zustand";
import type { Room, RoomMember, QueueItem } from "@/types";

interface RoomState {
  currentRoom: Room | null;
  members: RoomMember[];
  queue: QueueItem[];
  isConnected: boolean;

  setRoom: (room: Room | null) => void;
  setMembers: (members: RoomMember[]) => void;
  setQueue: (queue: QueueItem[]) => void;
  addQueueItem: (item: QueueItem) => void;
  removeQueueItem: (itemId: string) => void;
  updateQueueItem: (itemId: string, updates: Partial<QueueItem>) => void;
  setConnected: (connected: boolean) => void;
  leaveRoom: () => void;
}

export const useRoomStore = create<RoomState>()((set) => ({
  currentRoom: null,
  members: [],
  queue: [],
  isConnected: false,

  setRoom: (room) => set({ currentRoom: room }),

  setMembers: (members) => set({ members }),

  setQueue: (queue) => set({ queue }),

  addQueueItem: (item) =>
    set((state) => ({ queue: [...state.queue, item] })),

  removeQueueItem: (itemId) =>
    set((state) => ({
      queue: state.queue.filter((item) => item.id !== itemId),
    })),

  updateQueueItem: (itemId, updates) =>
    set((state) => ({
      queue: state.queue.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      ),
    })),

  setConnected: (connected) => set({ isConnected: connected }),

  leaveRoom: () =>
    set({
      currentRoom: null,
      members: [],
      queue: [],
      isConnected: false,
    }),
}));
