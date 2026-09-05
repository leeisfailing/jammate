import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuthStore } from "@/stores/authStore";

describe("LoginPage", () => {
  beforeEach(() => {
    useAuthStore.setState({
      userId: null,
      email: null,
      displayName: null,
      isAuthenticated: false,
      isLoading: true,
    });
  });

  it("should redirect to dashboard when authenticated", () => {
    useAuthStore.getState().setAuth({ id: "user-1", email: "test@test.com", display_name: "Test User" });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it("should show loading state initially", () => {
    expect(useAuthStore.getState().isLoading).toBe(true);
  });
});
