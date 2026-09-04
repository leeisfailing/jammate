export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      spotify_connections: {
        Row: {
          id: string;
          user_id: string;
          spotify_user_id: string;
          display_name: string | null;
          access_token: string;
          refresh_token: string;
          expires_at: string;
          scopes: string[];
          connected_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          spotify_user_id: string;
          display_name?: string | null;
          access_token: string;
          refresh_token: string;
          expires_at: string;
          scopes: string[];
          connected_at?: string;
          updated_at?: string;
        };
        Update: {
          access_token?: string;
          refresh_token?: string;
          expires_at?: string;
          scopes?: string[];
          updated_at?: string;
        };
        Relationships: [];
      };
      rooms: {
        Row: {
          id: string;
          room_code: string;
          host_user_id: string;
          status: string;
          is_locked: boolean;
          created_at: string;
          updated_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          room_code: string;
          host_user_id: string;
          status?: string;
          is_locked?: boolean;
          created_at?: string;
          updated_at?: string;
          expires_at?: string | null;
        };
        Update: {
          status?: string;
          is_locked?: boolean;
          updated_at?: string;
          expires_at?: string | null;
        };
        Relationships: [];
      };
      room_members: {
        Row: {
          id: string;
          room_id: string;
          user_id: string;
          role: string;
          joined_at: string;
          last_seen_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          user_id: string;
          role?: string;
          joined_at?: string;
          last_seen_at?: string;
        };
        Update: {
          role?: string;
          last_seen_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "room_members_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "rooms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "room_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      queue_items: {
        Row: {
          id: string;
          room_id: string;
          spotify_track_id: string;
          spotify_track_uri: string;
          track_name: string;
          artist_name: string;
          album_name: string | null;
          album_image_url: string | null;
          added_by: string;
          vote_count: number;
          position: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          spotify_track_id: string;
          spotify_track_uri: string;
          track_name: string;
          artist_name: string;
          album_name?: string | null;
          album_image_url?: string | null;
          added_by: string;
          vote_count?: number;
          position: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          vote_count?: number;
          position?: number;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "queue_items_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "rooms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "queue_items_added_by_fkey";
            columns: ["added_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      votes: {
        Row: {
          id: string;
          queue_item_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          queue_item_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [
          {
            foreignKeyName: "votes_queue_item_id_fkey";
            columns: ["queue_item_id"];
            isOneToOne: false;
            referencedRelation: "queue_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "votes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
