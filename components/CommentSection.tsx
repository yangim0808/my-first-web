"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Comment = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: {
    username: string;
  } | null;
};

export function CommentSection({ postId }: { postId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  async function fetchComments() {
    const { data } = await supabase
      .from("comments")
      .select("*, profiles(username)")
      .eq("post_id", postId)
      .order("created_at", { ascending: false });
    
    if (data) setComments(data as any);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!newComment.trim()) return;

    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        user_id: user.id,
        content: newComment.trim()
      })
      .select("*, profiles(username)")
      .single();

    if (error) {
      alert("댓글 작성에 실패했습니다: " + error.message);
      return;
    }

    if (data) {
      setComments([data as any, ...comments]);
      setNewComment("");
    }
  }

  async function handleDelete(commentId: string) {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    const { error } = await supabase.from("comments").delete().eq("id", commentId);
    if (!error) {
      setComments(comments.filter(c => c.id !== commentId));
    }
  }

  return (
    <div className="mt-12 space-y-6">
      <h3 className="text-xl font-bold">댓글</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea 
          placeholder="댓글을 남겨보세요."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="resize-none"
          rows={3}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={!user || !newComment.trim()}>
            {user ? "댓글 쓰기" : "로그인 필요"}
          </Button>
        </div>
      </form>
      <div className="space-y-4 mt-6">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-sm">아직 작성된 댓글이 없습니다.</p>
        ) : (
          comments.map(c => (
            <div key={c.id} className="border p-4 rounded-md space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold">{c.profiles?.username || "익명"}</span>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <time>{new Date(c.created_at).toLocaleDateString()}</time>
                  {user && user.id === c.user_id && (
                    <button 
                      type="button" 
                      className="hover:text-red-500 hover:underline"
                      onClick={() => handleDelete(c.id)}
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm whitespace-pre-wrap">{c.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
