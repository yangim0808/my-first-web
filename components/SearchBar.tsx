"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch: (term: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [term, setTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTerm(value);
    onSearch(value);
  };

  return (
    <div className="mb-8">
      <div className="relative max-w-md mx-auto">
        <input
          type="text"
          value={term}
          onChange={handleChange}
          placeholder="제목으로 검색하세요..."
          className="w-full px-5 py-3 pl-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                     rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                     outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
}
