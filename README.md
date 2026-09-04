# JamMate

A Windows desktop application for collaborative remote Spotify listening. One host connects Spotify; others join a room to manage a shared queue with voting.

## Features

- **Room System**: Create or join rooms with unique 6-digit codes
- **Spotify Integration**: Host connects Spotify via PKCE OAuth; controls playback
- **Shared Queue**: All members can search Spotify and add songs to the queue
- **Voting**: Members vote on songs; highest votes play next
- **Realtime**: Live updates for queue, playback, and member status via Supabase Realtime

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Desktop | Tauri 2 (Rust backend) |
| Frontend | React 19, TypeScript, Vite |
| State | Zustand |
| Backend | Supabase (PostgreSQL, Auth, Realtime) |
| Music | Spotify Web API |

## Prerequisites

- Windows 10/11 (x64)
- Node.js 18+
- pnpm
- Rust toolchain (stable)
- Windows SDK (for RC.EXE)
- Supabase project
- Spotify Developer app

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SPOTIFY_CLIENT_ID=your-spotify-client-id
VITE_SPOTIFY_REDIRECT_URI=jammate://callback
```

### 3. Setup Supabase

Run the migration in `supabase/migrations/001_initial_schema.sql` against your Supabase project.

### 4. Development

```bash
# Frontend only
pnpm dev

# Full Tauri app
$env:RC = "C:\Program Files (x86)\Windows Kits\10\bin\10.0.26100.0\x64\rc.exe"
pnpm tauri dev
```

### 5. Build

```bash
$env:RC = "C:\Program Files (x86)\Windows Kits\10\bin\10.0.26100.0\x64\rc.exe"
pnpm tauri build
```

## Project Structure

```
src/
  app/           # App shell, routing
  features/      # Auth, rooms, queue, spotify components
  components/    # Shared UI, layout
  lib/           # Supabase, Spotify, Tauri integrations
  stores/        # Zustand state management
  types/         # TypeScript types
  styles/        # Global CSS
src-tauri/       # Rust backend
supabase/        # Database migrations
```

## Architecture

See `docs/ARCHITECTURE.md` for detailed architecture documentation.

## Database

See `docs/DATABASE.md` for schema documentation.

## Spotify Integration

See `docs/SPOTIFY.md` for Spotify integration details.
