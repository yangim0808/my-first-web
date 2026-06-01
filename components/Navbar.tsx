"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { User, LogOut, PlusSquare, BookOpen, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm dark:bg-gray-900/80 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity flex items-center gap-2"
        >
          <BookOpen className="h-6 w-6 text-blue-600" />
          <span className="hidden sm:inline">내 블로그</span>
        </Link>
        
        <nav className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <Link href="/" className="gap-2">
              <Home className="h-4 w-4" />
              홈
            </Link>
          </Button>
          <Button variant="ghost" asChild size="sm">
            <Link href="/posts" className="gap-2">
              <BookOpen className="h-4 w-4" />
              블로그
            </Link>
          </Button>
          
          {user ? (
            <>
              <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
                <Link href="/posts/new" className="gap-2">
                  <PlusSquare className="h-4 w-4" />
                  새 글
                </Link>
              </Button>
              <Button variant="ghost" asChild size="sm">
                <Link href="/profile" className="gap-2">
                  <User className="h-4 w-4" />
                  프로필
                </Link>
              </Button>
              <Button variant="ghost" onClick={handleSignOut} size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">로그아웃</span>
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild size="sm">
                <Link href="/login">로그인</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">회원가입</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
