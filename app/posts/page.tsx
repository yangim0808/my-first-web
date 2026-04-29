import Link from "next/link";
import { getPosts } from "@/lib/posts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "게시글 목록 | 블로그",
  description: "블로그의 모든 게시글 목록입니다.",
};

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b">
        <h1 className="text-3xl font-bold tracking-tight">전체 게시글</h1>
      </div>

      {/* md 이상부터 2열 그리드, 모바일은 1열 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="rounded-lg shadow-sm flex flex-col h-full">
            <CardHeader>
              <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
              <CardDescription>
                {post.author && <span>{post.author}</span>}
                {post.date && <span className="ml-2 before:content-['•'] before:mr-2">{post.date}</span>}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground line-clamp-3">{post.body}</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="default" className="w-full">
                <Link href={`/posts/${post.id}`}>읽어보기</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
