"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/auth";

export default function Home() {
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOut();
    window.location.reload();
  };

  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold mb-4">내 블로그</h1>
      <p className="text-muted-foreground text-lg mb-8">
        일상을 기록하는 공간입니다. 환영합니다!
      </p>
      <div className="flex items-center justify-center gap-4">
        {user ? (
          <Button onClick={handleLogout} variant="outline">
            로그아웃
          </Button>
        ) : (
          <>
            <Button asChild variant="default">
              <Link href="/login">로그인</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/signup">회원가입</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
