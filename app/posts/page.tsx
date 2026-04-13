"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getPosts, Post } from "@/lib/posts";
import SearchBar from "@/components/SearchBar";

export default function PostsPage() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      const data = await getPosts();
      setAllPosts(data);
      setFilteredPosts(data);
      setIsLoading(false);
    }
    loadPosts();
  }, []);

  const handleSearch = (term: string) => {
    const filtered = allPosts.filter((post) =>
      post.title.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      const updatedPosts = allPosts.filter((post) => post.id !== id);
      setAllPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">게시글 목록</h1>
        <Link
          href="/posts/new"
          className="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          새 글 작성
        </Link>
      </div>

      <SearchBar onSearch={handleSearch} />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="group relative flex flex-col rounded-2xl border border-gray-200 p-6 shadow-sm
                       transition hover:shadow-md hover:-translate-y-1
                       dark:border-gray-700 dark:bg-gray-900 bg-white"
          >
            <Link href={`/posts/${post.id}`} className="flex-1">
              <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                {post.body}
              </p>
            </Link>
            
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mt-auto pt-4 border-t border-gray-50 dark:border-gray-800">
              <div className="flex flex-col">
                <span className="font-medium text-gray-700 dark:text-gray-300">{post.author}</span>
                <time dateTime={post.date}>{post.date}</time>
              </div>
              <button
                onClick={() => handleDelete(post.id)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                title="삭제"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredPosts.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">검색 결과가 없습니다.</p>
        </div>
      )}
    </main>
  );
}
