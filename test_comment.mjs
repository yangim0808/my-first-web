import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testComment() {
  console.log("Fetching a post ID...");
  const { data: post } = await supabase.from('posts').select('id, user_id').limit(1).single();
  if (!post) {
      console.log("No post found to test comment on.");
      return;
  }
  
  // We cannot test insert properly without a logged-in session due to RLS,
  // but if the table is missing, it will throw immediately as Anon!
  console.log("Trying to insert comment as anon (should get RLS blocked, not table missing error)...");
  const { data, error } = await supabase.from('comments').insert({
      post_id: post.id,
      user_id: post.user_id, // fake
      content: "test"
  }).select('*, profiles(username)');

  console.log("Error:", error);
}

testComment();
