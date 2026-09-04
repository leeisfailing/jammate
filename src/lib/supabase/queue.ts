import { supabase } from "@/lib/supabase/client";

export const queueService = {
  async addTrack(
    roomId: string,
    track: {
      spotify_track_id: string;
      spotify_track_uri: string;
      track_name: string;
      artist_name: string;
      album_name: string | null;
      album_image_url: string | null;
    },
    addedBy: string
  ): Promise<{ id: string }> {
    const { data: existing } = await supabase
      .from("queue_items")
      .select("position")
      .eq("room_id", roomId)
      .eq("status", "queued")
      .order("position", { ascending: false })
      .limit(1)
      .single();

    const nextPosition = ((existing as { position: number } | null)?.position ?? 0) + 1;

    const { data, error } = await supabase
      .from("queue_items")
      .insert({
        room_id: roomId,
        spotify_track_id: track.spotify_track_id,
        spotify_track_uri: track.spotify_track_uri,
        track_name: track.track_name,
        artist_name: track.artist_name,
        album_name: track.album_name,
        album_image_url: track.album_image_url,
        added_by: addedBy,
        position: nextPosition,
        status: "queued",
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    return data as { id: string };
  },

  async removeTrack(queueItemId: string): Promise<void> {
    const { error } = await supabase
      .from("queue_items")
      .update({ status: "removed" })
      .eq("id", queueItemId);

    if (error) throw new Error(error.message);
  },

  async markPlaying(queueItemId: string): Promise<void> {
    await supabase
      .from("queue_items")
      .update({ status: "completed" })
      .eq("status", "playing");

    const { error } = await supabase
      .from("queue_items")
      .update({ status: "playing" })
      .eq("id", queueItemId);

    if (error) throw new Error(error.message);
  },

  async vote(queueItemId: string, userId: string): Promise<void> {
    const { data: existing } = await supabase
      .from("votes")
      .select("id")
      .eq("queue_item_id", queueItemId)
      .eq("user_id", userId)
      .single();

    if (existing) {
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("id", (existing as { id: string }).id);

      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("votes")
        .insert({
          queue_item_id: queueItemId,
          user_id: userId,
        });

      if (error) throw new Error(error.message);
    }
  },

  async getUserVote(queueItemId: string, userId: string): Promise<boolean> {
    const { data } = await supabase
      .from("votes")
      .select("id")
      .eq("queue_item_id", queueItemId)
      .eq("user_id", userId)
      .single();

    return !!data;
  },

  async getUserVotes(roomId: string, userId: string): Promise<Set<string>> {
    const { data: queueItems } = await supabase
      .from("queue_items")
      .select("id")
      .eq("room_id", roomId)
      .eq("status", "queued");

    if (!queueItems?.length) return new Set();

    const itemIds = queueItems.map((i: { id: string }) => i.id);

    const { data: votes } = await supabase
      .from("votes")
      .select("queue_item_id")
      .in("queue_item_id", itemIds)
      .eq("user_id", userId);

    return new Set(votes?.map((v: { queue_item_id: string }) => v.queue_item_id) ?? []);
  },
};
