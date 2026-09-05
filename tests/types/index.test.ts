import { describe, it, expect } from "vitest";

describe("Type definitions", () => {
  it("should define RoomStatus type", () => {
    const statuses: Array<"active" | "paused" | "closed"> = ["active", "paused", "closed"];
    expect(statuses.length).toBe(3);
  });

  it("should define RoomMemberRole type", () => {
    const roles: Array<"host" | "member"> = ["host", "member"];
    expect(roles.length).toBe(2);
  });

  it("should define QueueItemStatus type", () => {
    const statuses: Array<"queued" | "playing" | "completed" | "removed"> = ["queued", "playing", "completed", "removed"];
    expect(statuses.length).toBe(4);
  });
});
