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
  const [fieldErrors, setFieldErrors] = useState<{ title?: string; content?: string }>({});

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 클라이언트 유효성 검증
    const newFieldErrors: { title?: string; content?: string } = {};
    if (title.trim().length < 2) {
      newFieldErrors.title = "제목은 최소 2자 이상이어야 합니다.";
    }
    if (content.trim().length < 10) {
      newFieldErrors.content = "내용은 최소 10자 이상이어야 합니다.";
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});

    const supabase = createClient();

    try {
      // 1. 프로필이 있는지 먼저 확인
      const { data: profileExists, error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (checkError) {
        console.error("Profile check error:", checkError);
        throw new Error("프로필 확인 중 오류가 발생했습니다.");
      }

      if (!profileExists) {
        // 2. 프로필이 없으면 직접 INSERT
        const { error: insertProfileError } = await supabase.from("profiles").insert({
          id: user.id,
          username: user.user_metadata?.name || user.email?.split('@')[0] || "익명 사용자"
        });

        if (insertProfileError) {
          console.error("Profile insert error:", insertProfileError);
          throw new Error("프로필 생성 중 오류가 발생했습니다.");
        }
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
        console.error("Post insert error:", insertError);
        throw new Error("글 작성 중 오류가 발생했습니다.");
      }

      router.push(`/posts/${data.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
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
                  className={fieldErrors.title ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {fieldErrors.title && (
                  <p className="text-xs text-red-500">{fieldErrors.title}</p>
                )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">내용</label>
                <Textarea
                  id="content"
                  placeholder="내용을 입력하세요"
                  rows={12}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={`resize-y ${fieldErrors.content ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {fieldErrors.content && (
                  <p className="text-xs text-red-500">{fieldErrors.content}</p>
                )}
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
