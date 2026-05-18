"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";

export default function EditPostPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    const fetchPost = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        
        if (data.user_id !== user.id) {
          alert("수정 권한이 없습니다.");
          router.replace(`/posts/${id}`);
          return;
        }

        setTitle(data.title);
        setContent(data.content);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch post:", err);
        setError("글을 불러오지 못했습니다.");
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, user, authLoading, router]);

  if (authLoading || isLoading) return <div className="text-center mt-12">로딩 중...</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("posts")
      .update({ title, content })
      .eq("id", id);

    if (updateError) {
      console.error(updateError);
      setError("글 수정에 실패했습니다. 다시 시도해 주세요.");
      setIsSubmitting(false);
    } else {
      router.push(`/posts/${id}`);
      router.refresh();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-4">
        <Button variant="ghost" type="button" onClick={() => router.back()} className="-ml-4 text-muted-foreground hover:text-primary h-8">
          <ChevronLeft className="mr-1 h-4 w-4" /> 상세로 돌아가기
        </Button>
      </div>
      
      <Card className="rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">포스트 수정</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">제목</label>
              <Input
                id="title"
                type="text"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">내용</label>
              <Textarea
                id="content"
                placeholder="내용을 입력하세요"
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="resize-y"
              />
            </div>

            {error && (
              <div className="text-sm text-red-500 font-medium">
                {error}
              </div>
            )}
            
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "저장 중..." : "수정 완료"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
