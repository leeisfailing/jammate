import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Layout } from "@/components/layout/Layout";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { DashboardPage } from "@/features/auth/pages/DashboardPage";
import { SettingsPage } from "@/features/auth/pages/SettingsPage";
import { RoomPage } from "@/features/rooms/pages/RoomPage";

export function App() {
  const { isAuthenticated, isLoading, setAuth, clearAuth, setLoading } =
    useAuthStore();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { supabase } = await import("@/lib/supabase/client");
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setAuth({
            id: session.user.id,
            email: session.user.email ?? "",
            display_name:
              session.user.user_metadata?.display_name ?? null,
          });
        } else {
          clearAuth();
        }
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [setAuth, clearAuth, setLoading]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "var(--color-bg)",
          color: "var(--color-text-muted)",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route element={<Layout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/room/:roomCode" element={<RoomPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
