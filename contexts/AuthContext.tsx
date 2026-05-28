"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true") {
      // Mock 모드: 세션 스토리지에서 세션 시뮬레이션
      const savedMockUser = sessionStorage.getItem("mock-user");
      if (savedMockUser) {
        setUser(JSON.parse(savedMockUser));
      }
      setLoading(false);
      return;
    }

    const supabase = createClient();
    
    supabase.auth.getUser().then(({ data: { user } }: { data: { user: any } }) => {
      setUser(user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 창/탭 닫을 때 로그아웃
    const handlePageHide = () => {
      supabase.auth.signOut();
    };
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
