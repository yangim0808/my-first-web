import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "내 블로그",
  description: "개발 공부와 일상을 기록하는 블로그",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={cn("font-sans", geist.variable)}>
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link 
              href="/" 
              className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              내 블로그
            </Link>
            <nav>
              <ul className="flex space-x-8">
                <li>
                  <Link href="/" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
                    홈
                  </Link>
                </li>
                <li>
                  <Link href="/posts" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
                    블로그
                  </Link>
                </li>
                <li>
                  <Link href="/posts/new" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
                    새 글 쓰기
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        
        <main className="max-w-4xl mx-auto px-6 py-12 flex-grow w-full">
          {children}
        </main>
        
        <footer className="text-center text-gray-400 py-12 border-t mt-auto">
          © 2026 내 블로그
        </footer>
      </body>
    </html>
  );
}
