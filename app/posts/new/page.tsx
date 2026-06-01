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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ title?: string; content?: string }>({});

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
      // 1. 프로필 확인 및 생성 (생략 가능하나 안정성을 위해 유지)
      const { data: profileExists } = await supabase.from("profiles").select("id").eq("id", user.id).maybeSingle();
      if (!profileExists) {
        await supabase.from("profiles").insert({
          id: user.id,
          username: user.user_metadata?.name || user.email?.split('@')[0] || "익명 사용자"
        });
      }

      // 2. 이미지 업로드
      let imageUrl = null;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(filePath, imageFile);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          // 실제 Supabase Bucket이 없을 경우 에러가 날 수 있으므로 경고만 하고 진행할지 여부 결정
          // 여기서는 필수 기능이므로 에러 처리
          throw new Error("이미지 업로드에 실패했습니다. (Bucket 설정을 확인해주세요)");
        }

        const { data: urlData } = supabase.storage
          .from('post-images')
          .getPublicUrl(filePath);
          
        imageUrl = urlData.publicUrl;
      }

      // 3. 게시글 저장
      const { data, error: insertError } = await supabase
        .from("posts")
        .insert({
          title,
          content,
          image_url: imageUrl,
          user_id: user.id
        })
        .select('id')
        .single();

      if (insertError) throw insertError;

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
      
      <Card className="rounded-lg shadow-sm border-none shadow-indigo-100/50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">새 포스트 작성</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-semibold">제목</label>
                <Input
                  id="title"
                  type="text"
                  placeholder="무엇에 대해 쓰실 건가요?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`h-12 text-lg ${fieldErrors.title ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {fieldErrors.title && (
                  <p className="text-xs text-red-500 font-medium">{fieldErrors.title}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold">대표 이미지 (선택)</label>
                <div className="flex flex-col gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  {imagePreview && (
                    <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden border">
                      <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="sm" 
                        className="absolute top-2 right-2 h-7 px-2"
                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                      >
                        삭제
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-semibold">내용</label>
                <Textarea
                  id="content"
                  placeholder="당신의 이야기를 들려주세요 (10자 이상)"
                  rows={15}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={`resize-y min-h-[300px] ${fieldErrors.content ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {fieldErrors.content && (
                  <p className="text-xs text-red-500 font-medium">{fieldErrors.content}</p>
                )}
              </div>
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
