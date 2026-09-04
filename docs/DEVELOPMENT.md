# Development

## Prerequisites

- Windows 10/11 x64
- Node.js 18+
- Rust 1.70+ (with `x86_64-pc-windows-msvc` target)
- Tauri CLI 2.x
- Supabase CLI (for local dev)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env` and fill in:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SPOTIFY_CLIENT_ID=your-spotify-client-id
VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:8080/callback
```

### 3. Supabase local development (optional)

```bash
npx supabase init
npx supabase start
npx supabase db push
```

## Commands

### Frontend only (no Tauri)
```bash
npm run dev          # Start Vite dev server
npm run build        # Build frontend
npm run typecheck    # TypeScript check
npm run lint         # ESLint check
npm run test         # Run tests
npm run test:watch   # Watch mode tests
```

### Full Tauri app
```bash
npm run tauri dev     # Development mode (frontend + Rust)
npm run tauri build   # Production build (creates Windows installer)
```

### Rust only
```bash
cd src-tauri
cargo check           # Type check Rust code
cargo build           # Build Rust code
cargo test            # Run Rust tests
```

## Project Structure

See `docs/ARCHITECTURE.md` for the full structure overview.

## State Management

Three Zustand stores:
- `authStore` - User authentication state
- `roomStore` - Current room, members, queue
- `playerStore` - Spotify playback state

Never store secrets in Zustand.

## Adding Features

1. Create feature folder under `src/features/<name>/`
2. Add pages, services, components as needed
3. Export from `src/features/<name>/index.ts`
4. Add routes in `src/app/App.tsx`
5. Add types in `src/types/`

## Database Changes

1. Create migration in `supabase/migrations/`
2. Use sequential numbering: `002_add_feature.sql`
3. Test locally with `npx supabase db push`
4. Update `src/types/database.ts` with new types

## Building for Production

```bash
npm run tauri build
```

Output: Windows x64 installer in `src-tauri/target/release/bundle/`

## Troubleshooting

### TypeScript errors
```bash
npm run typecheck
```

### Rust build errors
```bash
cd src-tauri && cargo check
```

### Port already in use
Change the port in `vite.config.ts` and update `tauri.conf.json` `devUrl` accordingly.
