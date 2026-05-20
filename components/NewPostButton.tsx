"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function NewPostButton() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (!loading && !user) {
      e.preventDefault();
      alert("로그인이 필요합니다.");
      router.push("/login");
    }
  };

  return (
    <Button asChild onClick={handleClick}>
      <Link href="/posts/new">새 글 쓰기</Link>
    </Button>
  );
}
