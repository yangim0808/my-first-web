import { createClient } from './supabase/client';

export type Post = {
  id: string; // UUID
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  view_count?: number;
  profiles?: {
    username: string;
  } | null;
};

export async function getPosts(): Promise<Post[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(username)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
  return data as any as Post[];
}

export async function getPostById(id: string): Promise<Post | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(username)')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching post ${id}:`, error);
    return null;
  }
  return data as any as Post;
}

