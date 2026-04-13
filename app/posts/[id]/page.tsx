import Link from "next/link";
import { getPostById } from "@/lib/posts";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(parseInt(id));

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">게시글을 찾을 수 없습니다</h1>
        <Link
          href="/posts"
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          &larr; 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-8 min-h-screen bg-white shadow-sm border border-gray-100 rounded-lg my-8">
      <header className="mb-8 border-b pb-6">
        <Link
          href="/posts"
          className="text-blue-600 hover:text-blue-800 transition-colors mb-4 inline-block"
        >
          &larr; 목록으로 돌아가기
        </Link>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center text-gray-500 text-sm">
          <span className="font-semibold">{post.author}</span>
          <span className="mx-2">•</span>
          <time dateTime={post.date}>{post.date}</time>
        </div>
      </header>
      
      <article className="prose lg:prose-xl max-w-none text-gray-800 leading-relaxed">
        {post.body.split('\n').map((paragraph: string, index: number) => (
          <p key={index} className="mb-4 text-lg">
            {paragraph}
          </p>
        ))}
      </article>

      <footer className="mt-12 pt-8 border-t">
        <Link
          href="/posts"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md"
        >
          목록으로 돌아가기
        </Link>
      </footer>
    </main>
  );
}
