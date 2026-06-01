"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { User, Mail, Calendar, Edit3, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    if (user) {
      fetchProfileAndPosts();
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  async function fetchProfileAndPosts() {
    setIsLoading(true);
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .maybeSingle();

      if (profileError) throw profileError;
      
      if (!profileData && user) {
        // If profile doesn't exist, create it (should be handled by trigger ideally, but as fallback)
        const newProfile = {
          id: user.id,
          username: user.user_metadata?.name || user.email?.split('@')[0] || "사용자"
        };
        await supabase.from("profiles").insert(newProfile);
        setProfile(newProfile);
        setUsername(newProfile.username);
      } else {
        setProfile(profileData);
        setUsername(profileData?.username || "");
      }

      // Fetch user's posts
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;
      setUserPosts(postsData || []);

    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdateProfile() {
    if (!user || !username.trim()) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ username })
        .eq("id", user.id);

      if (error) throw error;
      
      setProfile({ ...profile, username });
      setIsEditing(false);
      alert("프로필이 성공적으로 업데이트되었습니다.");
    } catch (error: any) {
      alert("프로필 업데이트 실패: " + error.message);
    } finally {
      setIsUpdating(false);
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center space-y-4 py-20">
        <h1 className="text-2xl font-bold">로그인이 필요합니다</h1>
        <p className="text-muted-foreground">프로필을 보려면 로그인해 주세요.</p>
        <Button asChild>
          <Link href="/login">로그인하기</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <section className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">프로필 설정</h1>
        
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 border-4 border-white shadow-sm">
                <User size={48} />
              </div>
              <div className="space-y-1 flex-grow">
                {isEditing ? (
                  <div className="flex items-center gap-2 max-w-sm">
                    <Input 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="닉네임을 입력하세요"
                      autoFocus
                    />
                    <Button 
                      size="sm" 
                      onClick={handleUpdateProfile} 
                      disabled={isUpdating || !username.trim()}
                    >
                      {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "저장"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>취소</Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-3xl font-bold">{profile?.username}</CardTitle>
                    <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)} className="h-8 w-8">
                      <Edit3 size={16} />
                    </Button>
                  </div>
                )}
                <CardDescription className="flex items-center gap-1.5 text-base">
                  <Mail size={14} className="text-muted-foreground" />
                  {user.email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="bg-white/50 backdrop-blur-sm border-t p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">계정 생성일</p>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-primary" />
                  <p className="font-semibold">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">작성한 게시글 수</p>
                <p className="text-2xl font-bold text-primary">{userPosts.length}개</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-bold">내가 쓴 게시글</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/posts/new">새 글 쓰기</Link>
          </Button>
        </div>

        {userPosts.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 rounded-xl border-2 border-dashed">
            <p className="text-muted-foreground">아직 작성한 게시글이 없습니다. 첫 글을 작성해 보세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userPosts.map((post) => (
              <Card key={post.id} className="group hover:border-primary/50 transition-colors shadow-sm">
                <CardHeader>
                  <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription>
                    {new Date(post.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="ghost" size="sm" className="w-full">
                    <Link href={`/posts/${post.id}`}>읽어보기</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
