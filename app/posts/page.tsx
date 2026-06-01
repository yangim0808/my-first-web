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
import { NewPostButton } from "@/components/NewPostButton";
import { SearchInput } from "@/components/SearchInput";

export const metadata = {
  title: "게시글 목록 | 블로그",
  description: "블로그의 모든 게시글 목록입니다.",
};

export const dynamic = "force-dynamic";

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const posts = await getPosts(q);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b">
        <h1 className="text-3xl font-bold tracking-tight">전체 게시글</h1>
        <div className="flex items-center gap-2">
          <SearchInput />
          <NewPostButton />
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-xl border-2 border-dashed">
          <p className="text-muted-foreground">검색 결과가 없거나 게시글이 존재하지 않습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="rounded-lg shadow-sm flex flex-col h-full">
            <CardHeader>
              <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
              <CardDescription>
                {post.profiles?.username && <span>{post.profiles.username}</span>}
                {post.created_at && <span className="ml-2 before:content-['•'] before:mr-2">{new Date(post.created_at).toLocaleDateString()}</span>}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground line-clamp-3">{post.content}</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="default" className="w-full">
                <Link href={`/posts/${post.id}`}>읽어보기</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    )}
    </div>
  );
}
