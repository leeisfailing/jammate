# Spotify Integration

## OAuth Flow

JamMate uses **Authorization Code with PKCE** (Proof Key for Code Exchange) for Spotify authentication.

### Flow Diagram

```
1. Frontend requests auth URL from Rust backend
2. Rust generates code_verifier + code_challenge
3. User redirected to Spotify login
4. Spotify returns authorization code
5. Rust exchanges code for tokens (code_verifier included)
6. Tokens stored in Windows Credential Manager
```

### Scopes

```
user-read-playback-state
user-modify-playback-state
user-read-currently-playing
user-read-email
user-read-private
```

### Redirect URI

```
jammate://callback
```

This is a custom deep-link scheme registered by the Tauri app.

## Token Management

### Storage

Tokens are stored in the **Windows Credential Manager** via the `keyring` crate:
- Service: `jammate`
- Account: `spotify_tokens`

### Refresh

- Tokens expire after 1 hour
- Rust backend checks expiry before each API call
- Automatic refresh using the refresh token
- New tokens stored immediately

## API Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `GET /v1/me` | Get current user profile |
| `GET /v1/me/player` | Get playback state |
| `PUT /v1/me/player/play` | Start/resume playback |
| `PUT /v1/me/player/pause` | Pause playback |
| `POST /v1/me/player/next` | Skip to next track |
| `POST /v1/me/player/previous` | Skip to previous track |
| `PUT /v1/me/player/seek` | Seek to position |
| `PUT /v1/me/player/volume` | Set volume |
| `PUT /v1/me/player/shuffle` | Toggle shuffle |
| `PUT /v1/me/player/repeat` | Set repeat mode |
| `GET /v1/me/player/devices` | Get available devices |
| `GET /v1/search` | Search for tracks |

## Rate Limits

Spotify enforces rate limits:
- ~100 requests per minute per user
- 429 response with `Retry-After` header
- JamMate polls playback state every 3 seconds (~20 req/min)

## Security Rules

1. Client secret never leaves the Rust backend
2. PKCE code_verifier never stored in frontend
3. Tokens transmitted via Tauri IPC (not HTTP)
4. Tokens stored in OS credential manager (encrypted)
5. No tokens in localStorage, sessionStorage, or Zustand
