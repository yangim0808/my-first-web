"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function ReactionButtons({ postId }: { postId: string }) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);

  useEffect(() => {
    fetchReactions();
  }, [postId, user]);

  async function fetchReactions() {
    const supabase = createClient();
    
    // Fetch counts
    const { data: allReactions } = await supabase
      .from("post_reactions")
      .select("reaction_type, user_id")
      .eq("post_id", postId);

    if (allReactions) {
      setLikes(allReactions.filter(r => r.reaction_type === 'like').length);
      setDislikes(allReactions.filter(r => r.reaction_type === 'dislike').length);
      
      if (user) {
        const myReaction = allReactions.find(r => r.user_id === user.id);
        setUserReaction(myReaction ? myReaction.reaction_type as 'like' | 'dislike' : null);
      }
    }
  }

  async function handleReact(type: 'like' | 'dislike') {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const supabase = createClient();
    
    if (userReaction === type) {
      // Remove reaction
      await supabase
        .from("post_reactions")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);
      
      setUserReaction(null);
      if (type === 'like') setLikes(l => l - 1);
      else setDislikes(d => d - 1);
    } else {
      // Upsert reaction
      await supabase
        .from("post_reactions")
        .upsert({
          post_id: postId,
          user_id: user.id,
          reaction_type: type
        }, { onConflict: 'post_id,user_id' });
        
      if (userReaction === 'like') setLikes(l => l - 1);
      if (userReaction === 'dislike') setDislikes(d => d - 1);
      
      setUserReaction(type);
      if (type === 'like') setLikes(l => l + 1);
      else setDislikes(d => d + 1);
    }
  }

  return (
    <div className="flex items-center gap-4 mt-6">
      <Button 
        variant={userReaction === 'like' ? "default" : "outline"}
        size="sm"
        onClick={() => handleReact('like')}
        className="gap-2 rounded-full"
      >
        <ThumbsUp className="w-4 h-4" />
        {likes}
      </Button>
      <Button 
        variant={userReaction === 'dislike' ? "default" : "outline"}
        size="sm"
        onClick={() => handleReact('dislike')}
        className="gap-2 rounded-full"
      >
        <ThumbsDown className="w-4 h-4" />
        {dislikes}
      </Button>
    </div>
  );
}
