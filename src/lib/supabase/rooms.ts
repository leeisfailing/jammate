import { supabase } from "@/lib/supabase/client";
import type { Room, RoomMember, QueueItem } from "@/types";

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export const roomService = {
  async createRoom(hostUserId: string): Promise<Room> {
    const roomCode = generateRoomCode();

    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .insert({
        room_code: roomCode,
        host_user_id: hostUserId,
        status: "active",
        is_locked: false,
      })
      .select()
      .single();

    if (roomError) throw new Error(roomError.message);

    const { error: memberError } = await supabase
      .from("room_members")
      .insert({
        room_id: room.id,
        user_id: hostUserId,
        role: "host",
      });

    if (memberError) throw new Error(memberError.message);

    return room as unknown as Room;
  },

  async joinRoom(roomCode: string, userId: string): Promise<Room> {
    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .select("*")
      .eq("room_code", roomCode.toUpperCase())
      .eq("status", "active")
      .single();

    if (roomError) throw new Error("Room not found.");
    const typedRoom = room as unknown as Room;
    if (typedRoom.is_locked) throw new Error("This room is locked.");

    const { data: existingMember } = await supabase
      .from("room_members")
      .select("id")
      .eq("room_id", typedRoom.id)
      .eq("user_id", userId)
      .single();

    if (!existingMember) {
      const { error: memberError } = await supabase
        .from("room_members")
        .insert({
          room_id: typedRoom.id,
          user_id: userId,
          role: "member",
        });

      if (memberError) throw new Error(memberError.message);
    }

    return typedRoom;
  },

  async getRoom(roomCode: string): Promise<Room | null> {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("room_code", roomCode.toUpperCase())
      .single();

    if (error) return null;
    return data as unknown as Room;
  },

  async getRoomById(roomId: string): Promise<Room | null> {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", roomId)
      .single();

    if (error) return null;
    return data as unknown as Room;
  },

  async getMembers(roomId: string): Promise<RoomMember[]> {
    const { data, error } = await supabase
      .from("room_members")
      .select("*")
      .eq("room_id", roomId);

    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as RoomMember[];
  },

  async getQueue(roomId: string): Promise<QueueItem[]> {
    const { data, error } = await supabase
      .from("queue_items")
      .select("*")
      .eq("room_id", roomId)
      .eq("status", "queued")
      .order("position", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as QueueItem[];
  },

  async toggleLock(roomId: string, isLocked: boolean): Promise<void> {
    const { error } = await supabase
      .from("rooms")
      .update({ is_locked: isLocked })
      .eq("id", roomId);

    if (error) throw new Error(error.message);
  },

  async closeRoom(roomId: string): Promise<void> {
    const { error } = await supabase
      .from("rooms")
      .update({ status: "closed" })
      .eq("id", roomId);

    if (error) throw new Error(error.message);
  },

  async removeMember(roomId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("room_members")
      .delete()
      .eq("room_id", roomId)
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
  },

  async leaveRoom(roomId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("room_members")
      .delete()
      .eq("room_id", roomId)
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
  },

  async getUserRooms(userId: string): Promise<Room[]> {
    const { data: memberships, error: memberError } = await supabase
      .from("room_members")
      .select("room_id")
      .eq("user_id", userId);

    if (memberError) return [];
    if (!memberships?.length) return [];

    const roomIds = memberships.map((m: { room_id: string }) => m.room_id);

    const { data: rooms, error: roomError } = await supabase
      .from("rooms")
      .select("*")
      .in("id", roomIds)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (roomError) return [];
    return (rooms ?? []) as unknown as Room[];
  },
};
