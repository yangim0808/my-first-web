"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";

interface PostActionsProps {
  postId: string;
  postAuthorId: string;
}

export function PostActions({ postId, postAuthorId }: PostActionsProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  // [UI 전용] 작성자 본인에게만 버튼을 노출하기 위한 클라이언트 조건입니다.
  // 이 조건은 보안이 아닙니다. 실제 DB 수준 보안(RLS)은 Ch11에서 구현합니다.
  if (!user || user.id !== postAuthorId) {
    return null;
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("posts").delete().eq("id", postId);
      
      if (error) {
        throw error;
      }
      
      setOpen(false);
      router.push("/posts");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("게시글 삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-6 justify-end border-t pt-4">
      <Button variant="outline" asChild size="sm">
        <Link href={`/posts/${postId}/edit`}>
          <Pencil className="w-4 h-4 mr-2" />
          수정
        </Link>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            삭제
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시글 삭제</DialogTitle>
            <DialogDescription>
              정말로 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isDeleting}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "삭제 중..." : "삭제"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
