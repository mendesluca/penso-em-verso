// Tipos gerados manualmente a partir de supabase/migrations/0001_mvp_schema.sql.
// Quando o schema evoluir, regenerar com:
//   npx supabase gen types typescript --project-id <id> > lib/supabase/types.ts

export type PoemStatus = "draft" | "published";
export type TagType = "livre" | "sentimento";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          bio: string | null;
          avatar_url: string | null;
          banner_url: string | null;
          social_links: Record<string, string>;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
          username: string;
          display_name: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["categories"]["Row"]> & {
          name: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Row"]>;
      };
      poems: {
        Row: {
          id: string;
          author_id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string | null;
          cover_url: string | null;
          category_id: string | null;
          status: PoemStatus;
          reading_time_seconds: number;
          view_count: number;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["poems"]["Row"]> & {
          author_id: string;
          title: string;
          slug: string;
          content: string;
        };
        Update: Partial<Database["public"]["Tables"]["poems"]["Row"]>;
      };
      tags: {
        Row: { id: string; name: string; slug: string; type: TagType };
        Insert: Partial<Database["public"]["Tables"]["tags"]["Row"]> & {
          name: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["tags"]["Row"]>;
      };
      poem_tags: {
        Row: { poem_id: string; tag_id: string };
        Insert: { poem_id: string; tag_id: string };
        Update: Partial<{ poem_id: string; tag_id: string }>;
      };
      collections: {
        Row: {
          id: string;
          author_id: string;
          title: string;
          slug: string;
          description: string | null;
          cover_url: string | null;
          is_public: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["collections"]["Row"]> & {
          author_id: string;
          title: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["collections"]["Row"]>;
      };
      collection_poems: {
        Row: { collection_id: string; poem_id: string; position: number };
        Insert: { collection_id: string; poem_id: string; position?: number };
        Update: Partial<{ collection_id: string; poem_id: string; position: number }>;
      };
      comments: {
        Row: {
          id: string;
          poem_id: string;
          author_id: string;
          parent_comment_id: string | null;
          content: string;
          is_deleted: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["comments"]["Row"]> & {
          poem_id: string;
          author_id: string;
          content: string;
        };
        Update: Partial<Database["public"]["Tables"]["comments"]["Row"]>;
      };
      likes: {
        Row: { poem_id: string; user_id: string; created_at: string };
        Insert: { poem_id: string; user_id: string };
        Update: never;
      };
      favorites: {
        Row: { poem_id: string; user_id: string; created_at: string };
        Insert: { poem_id: string; user_id: string };
        Update: never;
      };
      follows: {
        Row: { follower_id: string; following_id: string; created_at: string };
        Insert: { follower_id: string; following_id: string };
        Update: never;
      };
    };
  };
}
