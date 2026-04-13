"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    <div className="max-w-2xl mx-auto py-12">
      <header className="mb-10">
        <Link 
          href="/posts" 
          className="text-blue-600 hover:text-blue-800 transition-colors mb-4 inline-block text-sm font-medium"
        >
          &larr; 목록으로 돌아가기
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">새 게시글 작성</h1>
        <p className="mt-2 text-gray-600">당신의 생각을 자유롭게 기록해보세요.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
            제목
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
            placeholder="제목을 입력하세요"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
            내용
          </label>
          <textarea
            id="content"
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400 resize-none"
            placeholder="내용을 입력하세요"
          />
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4">
          <Link
            href="/posts"
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          >
            취소
          </Link>
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all shadow-md active:scale-95"
          >
            저장하기
          </button>
        </div>
      </form>
    </div>
  );
}
