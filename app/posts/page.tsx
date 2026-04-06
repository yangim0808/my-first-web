import Link from "next/link";
import { posts } from "@/lib/posts";

export default function PostsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">게시글 목록</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className="block rounded-2xl border border-gray-200 p-6 shadow-sm
                       transition hover:shadow-md hover:-translate-y-1
                       dark:border-gray-700 dark:bg-gray-900"
          >
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
              {post.content}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
              <span>{post.author}</span>
              <time dateTime={post.date}>{post.date}</time>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
