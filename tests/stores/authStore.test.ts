import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "@/stores/authStore";

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({
      userId: null,
      email: null,
      displayName: null,
      isAuthenticated: false,
      isLoading: true,
    });
  });

  it("should have initial state", () => {
    const state = useAuthStore.getState();
    expect(state.userId).toBeNull();
    expect(state.email).toBeNull();
    expect(state.displayName).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(true);
  });

  it("setAuth should set user data and authenticate", () => {
    const user = { id: "user-1", email: "test@test.com", display_name: "Test User" };
    useAuthStore.getState().setAuth(user);

    const state = useAuthStore.getState();
    expect(state.userId).toBe("user-1");
    expect(state.email).toBe("test@test.com");
    expect(state.displayName).toBe("Test User");
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it("clearAuth should reset state", () => {
    useAuthStore.getState().setAuth({ id: "user-1", email: "test@test.com", display_name: "Test User" });
    useAuthStore.getState().clearAuth();

    const state = useAuthStore.getState();
    expect(state.userId).toBeNull();
    expect(state.email).toBeNull();
    expect(state.displayName).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });

  it("setLoading should update loading state", () => {
    useAuthStore.getState().setLoading(false);
    expect(useAuthStore.getState().isLoading).toBe(false);
  });
});
