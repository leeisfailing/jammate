# Database Schema

## Tables

### profiles

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | References `auth.users.id` |
| email | text | User email |
| display_name | text | Display name |
| avatar_url | text | Avatar URL |
| created_at | timestamptz | Creation time |
| updated_at | timestamptz | Last update time |

RLS: Users can read all profiles. Users can update only their own profile.

### rooms

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Room ID |
| room_code | text (unique) | 6-char alphanumeric code |
| host_user_id | uuid | References `profiles.id` |
| status | text | `active` or `closed` |
| is_locked | boolean | Whether room is locked |
| created_at | timestamptz | Creation time |
| updated_at | timestamptz | Last update time |
| expires_at | timestamptz | Optional expiration |

RLS: Members can read rooms they belong to. Host can update room settings. Anyone can join active, unlocked rooms.

### room_members

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Membership ID |
| room_id | uuid | References `rooms.id` |
| user_id | uuid | References `profiles.id` |
| role | text | `host` or `member` |
| joined_at | timestamptz | Join time |
| last_seen_at | timestamptz | Last seen time |

RLS: Members can read members of their rooms. Host can remove members. Users can remove themselves.

### queue_items

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Queue item ID |
| room_id | uuid | References `rooms.id` |
| spotify_track_id | text | Spotify track ID |
| spotify_track_uri | text | Spotify track URI |
| track_name | text | Track name |
| artist_name | text | Artist name |
| album_name | text | Album name |
| album_image_url | text | Album image URL |
| added_by | uuid | References `profiles.id` |
| vote_count | integer | Current vote count |
| position | integer | Queue position |
| status | text | `queued`, `playing`, `played`, `removed` |
| created_at | timestamptz | Creation time |

RLS: Members can read queue items. Any member can add. Host can manage all items.

### queue_votes

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Vote ID |
| queue_item_id | uuid | References `queue_items.id` |
| user_id | uuid | References `profiles.id` |
| created_at | timestamptz | Vote time |

Unique constraint: `(queue_item_id, user_id)` — one vote per user per item.

RLS: Members can read votes. Users can add/remove their own votes.

## Triggers

- `update_updated_at` — Updates `updated_at` on row changes
- `update_queue_vote_count` — Updates `vote_count` on vote insert/delete

## Functions

- `check_room_membership(room_id, user_id)` — Checks if user is a member
- `check_is_host(room_id, user_id)` — Checks if user is the host

## RPCs

- `add_vote(queue_item_id)` — Adds vote, updates count atomically
- `remove_vote(queue_item_id)` — Removes vote, updates count atomically
