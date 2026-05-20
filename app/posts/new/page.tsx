"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function NewPostPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();

    // 외래키 오류 방지를 위해 현재 사용자의 프로필이 없으면 자동 생성(복구)
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: user.id,
      username: user.user_metadata?.name || user.email?.split('@')[0] || "익명 사용자"
    }, { onConflict: 'id', ignoreDuplicates: true });

    if (profileError) {
      console.error("Profile upsert error:", profileError);
      setError(`프로필 확인 중 오류가 발생했습니다. (세션이 만료되었거나 DB가 초기화되었을 수 있습니다. 로그아웃 후 다시 로그인해보세요.) 세부정보: ${profileError.message}`);
      setIsSubmitting(false);
      return;
    }

    const { data, error: insertError } = await supabase

      .from("posts")
      .insert({
        title,
        content,
        user_id: user.id
      })
      .select('id')
      .single();

    if (insertError) {
      console.error(insertError);
      setError(`글 작성에 실패했습니다: ${insertError.message} / 세부정보: ${insertError.details || '없음'}`);
      setIsSubmitting(false);
    } else {
      router.push(`/posts/${data.id}`);
      router.refresh();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-4">
        <Button variant="ghost" asChild className="-ml-4 text-muted-foreground hover:text-primary h-8">
          <Link href="/posts">
            <ChevronLeft className="mr-1 h-4 w-4" /> 목록으로 돌아가기
          </Link>
        </Button>
      </div>
      
      <Card className="rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">새 포스트 작성</CardTitle>
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
                {isSubmitting ? "저장 중..." : "글 등록"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
