# Architecture

## Overview

JamMate is a collaborative Spotify listening application built with Tauri 2 (Rust + React). The host controls playback; members vote on songs.

## System Architecture

```
┌─────────────────────────────────────────┐
│            Desktop Client (Tauri)        │
│  ┌───────────────┐  ┌─────────────────┐ │
│  │  React/UI     │  │  Rust Backend   │ │
│  │  (Frontend)   │  │  (Tauri Core)   │ │
│  │               │  │                 │ │
│  │  Zustand      │  │  PKCE Auth      │ │
│  │  React Router │  │  Token Storage  │ │
│  └───────┬───────┘  └────────┬────────┘ │
│          │                    │          │
└──────────┼────────────────────┼──────────┘
           │                    │
           ▼                    ▼
    ┌──────────────┐   ┌──────────────┐
    │   Supabase   │   │   Spotify    │
    │   (Backend)  │   │   Web API    │
    └──────────────┘   └──────────────┘
```

## Data Flow

### Authentication
1. User signs up/in via Supabase Auth (email + password)
2. User connects Spotify via PKCE OAuth flow
3. Rust backend handles PKCE code exchange and token refresh
4. Tokens stored in Windows Credential Manager (via keyring)

### Room Creation
1. Host creates room → Supabase `rooms` table
2. Room code generated (6 chars, alphanumeric)
3. Host added as `room_members` with role `host`
4. Other members join via code → added as `member`

### Playback Control
1. Host's Spotify tokens used for API calls
2. Frontend calls Spotify Web API for playback actions
3. `setInterval` polls playback state every 3 seconds
4. Realtime broadcasts keep member views synchronized

### Queue Management
1. Any member searches Spotify → results displayed
2. Member adds track → `queue_items` row created
3. Other members vote → `queue_votes` table updated
4. Host plays next track → Spotify API called → `queue_items.status` set to `playing`

## Realtime

Supabase Realtime uses PostgreSQL CDC (Change Data Capture) to broadcast events:
- `queue_item_added` — new song added to queue
- `queue_item_removed` — song removed from queue
- `queue_item_played` — song started playing
- `vote_changed` — vote added or removed
- `room_locked` / `room_unlocked` — lock state changed
- `member_joined` / `member_left` — membership changes

## Security

- RLS enabled on all tables
- Users can only modify their own votes
- Host-only actions (play, skip, lock) enforced by RLS policies
- Spotify tokens never leave the desktop client
- Supabase anon key is public; RLS handles authorization
