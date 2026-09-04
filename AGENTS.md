# AGENTS.md — Engineering Contract

## Project

**JamMate** is a Windows x64 desktop application for collaborative remote Spotify listening. One host connects Spotify; others join a room to manage a shared queue with voting.

## Platform Scope

- **Support**: Windows 10/11, x86_64 only
- **Framework**: Tauri 2
- **Target**: `x86_64-pc-windows-msvc`

**Do NOT add support for**: macOS, Linux, Android, iOS, web client, browser extension, mobile client, QR codes.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Desktop | Tauri 2 |
| Frontend | React 19, TypeScript (strict), Vite |
| State | Zustand |
| Backend | Supabase (PostgreSQL, Auth, Realtime) |
| Music | Spotify Web API (official only) |
| Native | Rust |

## Architecture Rules

1. **JamMate does NOT stream audio.** It coordinates playback via Spotify's API.
2. **Host-authoritative playback.** Only the host's Spotify is controlled.
3. **No client secrets in frontend.** Spotify PKCE flow only. Secrets stay in Rust.
4. **RLS on every table.** Never rely on frontend authorization alone.
5. **Separate identities.** JamMate user (Supabase Auth) is separate from Spotify user.
6. **Smallest correct implementation.** No premature optimization, no speculative architecture.
7. **Strong typing.** TypeScript strict mode. Typed Supabase client. Typed Rust structs.
8. **Centralized integrations.** All Spotify calls go through `src/lib/spotify/api.ts`. All Supabase calls go through `src/lib/supabase/`.

## Folder Structure

```
JamMate/
  src/                    # React/TypeScript frontend
    app/                  # App shell, routing
    features/             # Feature modules
      auth/               # Authentication pages and logic
      spotify/            # Spotify integration components
      rooms/              # Room creation and management
      queue/              # Queue management
    components/
      ui/                 # Shared UI components
      layout/             # Layout components
    lib/
      supabase/           # Supabase client and services
      spotify/            # Spotify config and API
      tauri/              # Tauri command bridge
    stores/               # Zustand stores (auth, room, player)
    types/                # TypeScript types and database schema
    styles/               # Global CSS

  src-tauri/              # Rust backend
    src/
      commands/           # Tauri command handlers
      auth/               # PKCE, OAuth
      spotify/            # Token exchange
      storage/            # Keychain (keyring)
    capabilities/         # Tauri v2 permissions

  supabase/
    migrations/           # Database migrations
    functions/            # Edge functions
    config.toml           # Local dev config

  docs/                   # Architecture, database, spotify, development docs
  tests/                  # Tests
```

## Naming Conventions

- **Files**: `camelCase.ts`, `PascalCase.tsx` for components
- **Components**: `PascalCase` function names
- **Functions**: `camelCase`
- **Types/Interfaces**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Database tables**: `snake_case`
- **Database columns**: `snake_case`
- **Rust files**: `snake_case.rs`
- **CSS variables**: `--kebab-case`
- **Zustand stores**: `use<Name>Store` (e.g., `useAuthStore`)

## Security Rules

- **Never** commit `.env` files, API keys, tokens, or secrets
- **Never** put Spotify client secret in frontend code
- **Never** store tokens in localStorage or Zustand
- **Always** use RLS policies on Supabase tables
- **Always** validate user input on the server side
- **Always** check room membership before allowing operations
- **Always** use HTTPS for Spotify API calls (enforced by Spotify)

## Spotify Compliance Rules

- Use only official Spotify Web API endpoints
- Use Authorization Code with PKCE (no client secret in app)
- Redirect URI must use `http://127.0.0.1:PORT` (NOT `localhost`)
- Respect Spotify rate limits
- Do not cache or redistribute Spotify content
- Do not transport audio — Spotify handles playback
- Required scopes: `user-read-playback-state`, `user-modify-playback-state`, `user-read-currently-playing`, `user-read-email`, `user-read-private`

## Testing Rules

- Test room creation, joining, permissions, queue, voting
- Test Spotify auth boundaries (token refresh, expiry)
- Test realtime updates
- Test reconnection behavior
- Run `npm run typecheck` and `npm run lint` before commits
- Run `cargo check` in `src-tauri/` for Rust validation

## Development Commands

```bash
# Frontend
npm run dev              # Vite dev server
npm run build            # Build frontend
npm run typecheck        # TypeScript check
npm run lint             # ESLint check
npm run test             # Run tests

# Full app
npm run tauri dev        # Development mode
npm run tauri build      # Production build

# Rust
cd src-tauri && cargo check
cd src-tauri && cargo test
```

## Things Agents Must NOT Do

1. Do NOT add macOS, Linux, iOS, Android, or web support
2. Do NOT add chat, social, AI, subscription, or advertising features
3. Do NOT add microservices, Kubernetes, or Redis (unless proven necessary)
4. Do NOT create custom realtime infrastructure (use Supabase Realtime)
5. Do NOT add dependencies without justification
6. Do NOT create large files (>300 lines). Split into smaller modules.
7. Do NOT store secrets in React, Zustand, or environment variables exposed to frontend
8. Do NOT assume undocumented Spotify endpoints exist
9. Do NOT rewrite existing code without understanding dependencies
10. Do NOT create competing implementations for the same functionality
11. Do NOT add comments unless explicitly asked
12. Do NOT create files without a clear responsibility
13. Do NOT use `localhost` in Spotify redirect URIs (use `127.0.0.1`)
14. Do NOT bypass RLS policies — every table must have them

## For Agent 2

Agent 1 has established:
- Project structure and configuration
- Supabase schema with RLS
- Zustand stores (auth, room, player)
- Spotify service layer (auth, search, player)
- Rust OAuth/PKCE foundation
- Secure token storage
- Type definitions
- Documentation

Agent 2 should:
- Implement room creation and joining UI
- Implement Spotify connection flow (using Rust commands)
- Implement queue management UI
- Implement voting
- Implement playback controls
- Implement realtime subscriptions
- Add proper error handling and loading states
- Connect the LoginPage to Supabase Auth
- Connect the DashboardPage to room management

When finished with a component, leave a clear note in the documentation.
