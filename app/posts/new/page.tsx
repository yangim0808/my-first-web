"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert("제목을 입력해주세요!");
      return;
    }
    
    // 백엔드가 없으므로 mock 처리
    alert("저장되었습니다");
    router.push("/posts");
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <header className="mb-10">
        <Button variant="ghost" asChild className="-ml-4 text-muted-foreground hover:text-primary mb-4 h-8">
          <Link href="/posts">
            <ChevronLeft className="mr-1 h-4 w-4" /> 목록으로 돌아가기
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">새 게시글 작성</h1>
        <p className="mt-2 text-muted-foreground">당신의 생각을 자유롭게 기록해보세요.</p>
      </header>

      <Card className="rounded-xl shadow-sm border-foreground/10 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-8 space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-semibold text-foreground">
                제목
              </label>
              <Input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-12 rounded-xl focus-visible:ring-1 transition-all"
                placeholder="제목을 입력하세요"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-semibold text-foreground">
                내용
              </label>
              <textarea
                id="content"
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full min-h-[300px] rounded-xl border border-input bg-transparent px-4 py-3 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 disabled:opacity-50 resize-none md:text-sm"
                placeholder="내용을 입력하세요"
              />
            </div>
          </CardContent>

          <CardFooter className="bg-muted/30 p-6 flex items-center justify-end space-x-3">
            <Button
              variant="outline"
              asChild
              className="px-6 h-11 rounded-xl"
            >
              <Link href="/posts">취소</Link>
            </Button>
            <Button
              type="submit"
              className="px-8 h-11 font-bold rounded-xl shadow-sm hover:-translate-y-0.5 transition-transform"
            >
              저장하기
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
