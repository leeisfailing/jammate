import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [mode, setMode] = useState<"welcome" | "signup" | "login">("welcome");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailAuth = async (isSignUp: boolean) => {
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = isSignUp
        ? await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { display_name: displayName || email.split("@")[0] },
            },
          })
        : await supabase.auth.signInWithPassword({ email, password });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (result.data.user) {
        setAuth({
          id: result.data.user.id,
          email: result.data.user.email ?? "",
          display_name:
            result.data.user.user_metadata?.display_name ?? null,
        });
        navigate("/");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "var(--color-bg)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          padding: "32px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "var(--color-text)",
              marginBottom: "8px",
            }}
          >
            JamMate
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--color-text-muted)",
            }}
          >
            Listen together, remotely.
          </p>
        </div>

        {mode === "welcome" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Button
              onClick={() => setMode("signup")}
              style={{ width: "100%" }}
              size="lg"
            >
              Get Started
            </Button>
            <Button
              variant="secondary"
              onClick={() => setMode("login")}
              style={{ width: "100%" }}
              size="lg"
            >
              Sign In
            </Button>
          </div>
        )}

        {(mode === "signup" || mode === "login") && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <button
              onClick={() => setMode("welcome")}
              style={{
                fontSize: "13px",
                color: "var(--color-text-muted)",
                textAlign: "left",
              }}
            >
              ← Back
            </button>

            <h2
              style={{
                fontSize: "18px",
                fontWeight: 600,
              }}
            >
              {mode === "signup" ? "Create Account" : "Welcome Back"}
            </h2>

            {mode === "signup" && (
              <Input
                label="Display Name"
                placeholder="Your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            )}

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleEmailAuth(mode === "signup");
                }
              }}
            />

            {error && (
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--color-danger)",
                }}
              >
                {error}
              </p>
            )}

            <Button
              onClick={() => handleEmailAuth(mode === "signup")}
              disabled={loading}
              style={{ width: "100%" }}
              size="lg"
            >
              {loading
                ? "Loading..."
                : mode === "signup"
                ? "Create Account"
                : "Sign In"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
