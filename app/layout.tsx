import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

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
    <html lang="ko">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <Navbar />
        <main className="max-w-4xl mx-auto px-6 py-12">{children}</main>
        <footer className="text-center text-gray-400 py-12 border-t mt-auto">
          © 2026 내 블로그
        </footer>
      </body>
    </html>
  );
}
