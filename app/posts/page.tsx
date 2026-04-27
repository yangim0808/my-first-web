"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getPosts, Post } from "@/lib/posts";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2, Clock, User } from "lucide-react";

export default function PostsPage() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Deletion state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

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

  const confirmDelete = () => {
    if (postToDelete !== null) {
      const updatedPosts = allPosts.filter((post) => post.id !== postToDelete);
      setAllPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
      setIsDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const openDeleteDialog = (id: number) => {
    setPostToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold tracking-tight">게시글 목록</h1>
        <Button asChild className="rounded-xl px-6">
          <Link href="/posts/new">
            <Plus className="mr-2 h-4 w-4" /> 새 글 작성
          </Link>
        </Button>
      </div>

      <SearchBar onSearch={handleSearch} />

      <div className="grid gap-6 md:grid-cols-2 grid-cols-1">
        {filteredPosts.map((post) => (
          <Card 
            key={post.id}
            className="group relative flex flex-col transition-all hover:shadow-md hover:ring-foreground/20 rounded-xl"
          >
            <CardHeader className="pb-2">
              <Link href={`/posts/${post.id}`} className="hover:text-primary transition-colors">
                <CardTitle className="text-xl leading-tight">
                  {post.title}
                </CardTitle>
              </Link>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground text-sm line-clamp-3">
                {post.body}
              </p>
            </CardContent>
            <CardFooter className="pt-4 border-t flex items-center justify-between">
              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span className="font-medium">{post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <time dateTime={post.date}>{post.date}</time>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openDeleteDialog(post.id)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                title="삭제"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredPosts.length === 0 && (
        <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-2xl">
          <p className="text-lg">검색 결과가 없습니다.</p>
        </div>
      )}

      {/* Deletion Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시글 삭제</DialogTitle>
            <DialogDescription>
              정말로 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              삭제하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
