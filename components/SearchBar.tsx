"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
        <Input
          type="text"
          value={term}
          onChange={handleChange}
          placeholder="제목으로 검색하세요..."
          className="pl-10 h-12 rounded-xl shadow-sm focus-visible:ring-1 transition-all"
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
      </div>
    </div>
  );
}
