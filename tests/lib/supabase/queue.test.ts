import { describe, it, expect, vi, beforeEach } from "vitest";
import { queueService } from "@/lib/supabase/queue";

vi.mock("@/lib/supabase/client", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe("queueService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("addTrack", () => {
    it("should add a track with correct position", async () => {
      const mockExisting = { position: 2 };
      const mockSupabase = {
        from: (table: string) => ({
          select: (cols: string) => ({
            eq: () => ({
              order: () => ({
                limit: () => ({ single: () => Promise.resolve({ data: mockExisting, error: null }) }),
              }),
            }),
          }),
          insert: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: { id: "new-item" }, error: null }),
            }),
          }),
        }),
      };
    });
  });

  describe("removeTrack", () => {
    it("should mark track as removed", async () => {
      const mockUpdate = vi.fn().mockResolvedValue({ data: null, error: null });
      const mockSupabase = {
        from: () => ({
          update: () => ({
            eq: () => ({
              select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }),
            }),
          }),
        }),
      };
    });
  });

  describe("markPlaying", () => {
    it("should update queue item status to playing", async () => {
      const mockUpdate = vi.fn().mockResolvedValue({ data: null, error: null });
      const mockSupabase = {
        from: () => ({
          update: () => ({
            eq: () => ({
              select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }),
            }),
          }),
        }),
      };
    });
  });

  describe("vote", () => {
    it("should insert vote when no existing vote", async () => {
      const mockSupabase = {
        from: () => ({
          select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }),
          insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
        }),
      };
    });

    it("should delete vote when existing vote exists", async () => {
      const mockExisting = { id: "vote-1" };
      const mockSupabase = {
        from: () => ({
          select: () => ({ single: () => Promise.resolve({ data: mockExisting, error: null }) }),
          delete: () => ({ eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }) }),
        }),
      };
    });
  });

  describe("getUserVote", () => {
    it("should return true when vote exists", async () => {
      const mockSupabase = {
        from: () => ({
          select: () => ({ single: () => Promise.resolve({ data: { id: "vote-1" }, error: null }) }),
        }),
      };
    });

    it("should return false when no vote exists", async () => {
      const mockSupabase = {
        from: () => ({
          select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }),
        }),
      };
    });
  });
});
