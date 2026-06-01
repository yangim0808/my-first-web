import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/contexts/AuthContext";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";

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
    <html lang="ko" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className="bg-white text-gray-900 min-h-screen flex flex-col dark:bg-gray-950 dark:text-gray-50 antialiased transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navbar />
            
            <main className="max-w-4xl mx-auto px-6 py-12 flex-grow w-full">
              {children}
            </main>
            
            <footer className="text-center text-gray-400 dark:text-gray-600 py-12 border-t dark:border-gray-800 mt-auto">
              © 2026 내 블로그
            </footer>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
