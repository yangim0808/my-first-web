import Link from "next/link";
import { getPostById } from "@/lib/posts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ChevronLeft, User, Clock } from "lucide-react";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(parseInt(id));

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 space-y-4">
        <h1 className="text-2xl font-bold text-muted-foreground">게시글을 찾을 수 없습니다</h1>
        <Button variant="link" asChild>
          <Link href="/posts">
            <ChevronLeft className="mr-1 h-4 w-4" /> 목록으로 돌아가기
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-12 px-6">
      <header className="mb-8">
        <Button variant="ghost" asChild className="-ml-4 text-muted-foreground hover:text-primary mb-4 h-8">
          <Link href="/posts">
            <ChevronLeft className="mr-1 h-4 w-4" /> 목록으로 돌아가기
          </Link>
        </Button>
      </header>

      <Card className="rounded-2xl shadow-sm border-foreground/10 overflow-hidden">
        <CardHeader className="pb-8 border-b bg-muted/20">
          <CardTitle className="text-4xl font-extrabold tracking-tight leading-tight">
            {post.title}
          </CardTitle>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span className="font-semibold text-foreground">{post.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <time dateTime={post.date}>{post.date}</time>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-10 pb-12 prose prose-slate max-w-none">
          <div className="text-foreground leading-relaxed text-lg space-y-4">
            {post.body.split('\n').map((paragraph: string, index: number) => (
              <p key={index}>
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>

        <CardFooter className="bg-muted/30 p-6 flex justify-center border-t">
          <Button variant="outline" asChild className="px-8 h-11 rounded-xl">
            <Link href="/posts">
              목록으로 돌아가기
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
