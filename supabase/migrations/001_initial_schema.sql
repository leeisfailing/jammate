-- JamMate Database Schema
-- Version: 001_initial_schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Profiles: users can read all, update own
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', null),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', null)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- SPOTIFY CONNECTIONS
-- ============================================================
create table public.spotify_connections (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  spotify_user_id text not null,
  display_name text,
  access_token text not null,
  refresh_token text not null,
  expires_at timestamptz not null,
  scopes text[] not null default '{}',
  connected_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

alter table public.spotify_connections enable row level security;

create policy "Users can view own spotify connection"
  on public.spotify_connections for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own spotify connection"
  on public.spotify_connections for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own spotify connection"
  on public.spotify_connections for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete own spotify connection"
  on public.spotify_connections for delete
  to authenticated
  using (auth.uid() = user_id);

-- ============================================================
-- ROOMS
-- ============================================================
create table public.rooms (
  id uuid primary key default uuid_generate_v4(),
  room_code text not null unique,
  host_user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'paused', 'closed')),
  is_locked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz
);

alter table public.rooms enable row level security;

-- Rooms: members can read active rooms they belong to
create policy "Room members can view room"
  on public.rooms for select
  to authenticated
  using (
    exists (
      select 1 from public.room_members
      where room_members.room_id = rooms.id
      and room_members.user_id = auth.uid()
    )
  );

-- Rooms: authenticated users can create
create policy "Authenticated users can create rooms"
  on public.rooms for insert
  to authenticated
  with check (auth.uid() = host_user_id);

-- Rooms: host can update own room
create policy "Host can update own room"
  on public.rooms for update
  to authenticated
  using (auth.uid() = host_user_id);

-- Rooms: host can delete own room
create policy "Host can delete own room"
  on public.rooms for delete
  to authenticated
  using (auth.uid() = host_user_id);

-- ============================================================
-- ROOM MEMBERS
-- ============================================================
create table public.room_members (
  id uuid primary key default uuid_generate_v4(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('host', 'member')),
  joined_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  unique(room_id, user_id)
);

alter table public.room_members enable row level security;

-- Room members: members can view other members in same room
create policy "Members can view room members"
  on public.room_members for select
  to authenticated
  using (
    exists (
      select 1 from public.room_members as rm
      where rm.room_id = room_members.room_id
      and rm.user_id = auth.uid()
    )
  );

-- Room members: host can add members
create policy "Host can add members"
  on public.room_members for insert
  to authenticated
  with check (
    exists (
      select 1 from public.rooms
      where rooms.id = room_members.room_id
      and rooms.host_user_id = auth.uid()
    )
  );

-- Room members: users can join rooms (self-insert with role 'member')
create policy "Users can join rooms as members"
  on public.room_members for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and role = 'member'
  );

-- Room members: host can update member roles
create policy "Host can update members"
  on public.room_members for update
  to authenticated
  using (
    exists (
      select 1 from public.rooms
      where rooms.id = room_members.room_id
      and rooms.host_user_id = auth.uid()
    )
  );

-- Room members: host can remove members, users can remove themselves
create policy "Host or self can remove member"
  on public.room_members for delete
  to authenticated
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.rooms
      where rooms.id = room_members.room_id
      and rooms.host_user_id = auth.uid()
    )
  );

-- ============================================================
-- QUEUE ITEMS
-- ============================================================
create table public.queue_items (
  id uuid primary key default uuid_generate_v4(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  spotify_track_id text not null,
  spotify_track_uri text not null,
  track_name text not null,
  artist_name text not null,
  album_name text,
  album_image_url text,
  added_by uuid not null references public.profiles(id) on delete cascade,
  vote_count integer not null default 0,
  position integer not null,
  status text not null default 'queued' check (status in ('queued', 'playing', 'completed', 'removed')),
  created_at timestamptz not null default now()
);

alter table public.queue_items enable row level security;

-- Queue: room members can view queue
create policy "Room members can view queue"
  on public.queue_items for select
  to authenticated
  using (
    exists (
      select 1 from public.room_members
      where room_members.room_id = queue_items.room_id
      and room_members.user_id = auth.uid()
    )
  );

-- Queue: room members can add to queue
create policy "Room members can add to queue"
  on public.queue_items for insert
  to authenticated
  with check (
    auth.uid() = added_by
    and exists (
      select 1 from public.room_members
      where room_members.room_id = queue_items.room_id
      and room_members.user_id = auth.uid()
    )
  );

-- Queue: host or adder can update queue items
create policy "Host or adder can update queue items"
  on public.queue_items for update
  to authenticated
  using (
    auth.uid() = added_by
    or exists (
      select 1 from public.rooms
      where rooms.id = queue_items.room_id
      and rooms.host_user_id = auth.uid()
    )
  );

-- Queue: host or adder can delete queue items
create policy "Host or adder can delete queue items"
  on public.queue_items for delete
  to authenticated
  using (
    auth.uid() = added_by
    or exists (
      select 1 from public.rooms
      where rooms.id = queue_items.room_id
      and rooms.host_user_id = auth.uid()
    )
  );

-- ============================================================
-- VOTES
-- ============================================================
create table public.votes (
  id uuid primary key default uuid_generate_v4(),
  queue_item_id uuid not null references public.queue_items(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(queue_item_id, user_id)
);

alter table public.votes enable row level security;

-- Votes: room members can view votes
create policy "Room members can view votes"
  on public.votes for select
  to authenticated
  using (
    exists (
      select 1 from public.queue_items qi
      join public.room_members rm on rm.room_id = qi.room_id
      where qi.id = votes.queue_item_id
      and rm.user_id = auth.uid()
    )
  );

-- Votes: users can vote (insert)
create policy "Users can vote"
  on public.votes for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Votes: users can remove own votes
create policy "Users can remove own votes"
  on public.votes for delete
  to authenticated
  using (auth.uid() = user_id);

-- ============================================================
-- TRIGGER: Auto-update vote_count on queue_items
-- ============================================================
create or replace function public.update_vote_count()
returns trigger
language plpgsql
security definer
as $$
begin
  if TG_OP = 'INSERT' then
    update public.queue_items
    set vote_count = vote_count + 1
    where id = NEW.queue_item_id;
    return NEW;
  elsif TG_OP = 'DELETE' then
    update public.queue_items
    set vote_count = vote_count - 1
    where id = OLD.queue_item_id;
    return OLD;
  end if;
end;
$$;

create trigger on_vote_change
  after insert or delete on public.votes
  for each row execute function public.update_vote_count();

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_rooms_room_code on public.rooms(room_code);
create index idx_rooms_host on public.rooms(host_user_id);
create index idx_room_members_room on public.room_members(room_id);
create index idx_room_members_user on public.room_members(user_id);
create index idx_queue_items_room on public.queue_items(room_id);
create index idx_queue_items_status on public.queue_items(status);
create index idx_queue_items_position on public.queue_items(position);
create index idx_votes_queue_item on public.votes(queue_item_id);
create index idx_votes_user on public.votes(user_id);
