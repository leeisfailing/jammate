import { describe, it, expect, vi, beforeEach } from "vitest";
import { roomService } from "@/lib/supabase/rooms";
import { supabase } from "@/lib/supabase/client";

vi.mock("@/lib/supabase/client", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

const mockFromReturn = {
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  in: vi.fn().mockReturnThis(),
  throw: vi.fn(),
};

const mockSelectReturn = {
  single: vi.fn().mockResolvedValue({ data: null, error: { message: "Not found" } }),
};

describe("roomService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createRoom", () => {
    it("should create a room with host member", async () => {
      const mockRoom = { id: "room-1", room_code: "ABC123", host_user_id: "host-1", status: "active" };
      const insertRoom = vi.fn().mockResolvedValue({ data: mockRoom, error: null });
      const insertMember = vi.fn().mockResolvedValue({ data: null, error: null });

      vi.mocked(supabase.from).mockReturnValue({
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        insert: insertRoom,
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockRoom, error: null }),
      } as any);

      const supabaseMock = {
        from: (table: string) => {
          if (table === "rooms") {
            return {
              insert: insertRoom,
              select: () => ({
                single: () => Promise.resolve({ data: mockRoom, error: null }),
              }),
            };
          }
          if (table === "room_members") {
            return {
              insert: insertMember,
            };
          }
          return {};
        },
      };
    });
  });
});
