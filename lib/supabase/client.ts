import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true") {
    return {
      auth: {
        getUser: async () => ({
          data: { user: typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("mock-user") || "null") : null },
          error: null
        }),
        signInWithPassword: async () => ({ data: { user: { id: "mock-id" } }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: async () => {
          if (typeof window !== "undefined") sessionStorage.removeItem("mock-user");
          return { error: null };
        }
      },
      from: (table: string) => ({
        select: (query: string) => {
          if (table === "post_reactions") {
            const reactions = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("mock-reactions") || "[]") : [];
            return {
              eq: (column: string, value: any) => ({
                 then: (resolve: any) => resolve({ data: reactions, error: null })
              })
            };
          }
          if (table === "comments") {
            const comments = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("mock-comments") || "[]") : [];
            return {
              select: (q: string) => ({
                eq: (column: string, value: any) => ({
                  order: (col: string, { ascending }: any) => ({
                    then: (resolve: any) => resolve({ data: comments, error: null })
                  })
                })
              })
            };
          }
          if (table === "profiles") {
            return {
              select: (q: string) => ({
                eq: (col: string, val: any) => ({
                  maybeSingle: async () => ({ data: { id: val, username: "Mock User" }, error: null })
                })
              })
            };
          }
          return {
            eq: (column: string, value: any) => ({
              maybeSingle: async () => {
                const views = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("mock-views") || "{}") : {};
                return { data: { id: value, title: "Mock Post", content: "Mock Content", view_count: views[value] || 0 }, error: null };
              },
              single: async () => {
                const views = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("mock-views") || "{}") : {};
                return { data: { id: value, title: "Mock Post", content: "Mock Content", view_count: views[value] || 0 }, error: null };
              },
              limit: (n: number) => ({ then: (resolve: any) => resolve({ data: [], error: null }) })
            }),
            order: (column: string, { ascending }: any) => ({
              then: (resolve: any) => resolve({
                data: [
                  { id: "mock-id-1", title: "Mock Post 1", content: "Content 1", created_at: new Date().toISOString(), profiles: { username: "Mock User" } },
                ],
                error: null
              })
            }),
          }
        },
        insert: (data: any) => {
          if (table === "comments") {
            const comments = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("mock-comments") || "[]") : [];
            const newComment = { 
              ...data, 
              id: Math.random().toString(), 
              created_at: new Date().toISOString(), 
              profiles: { username: "Mock User" } 
            };
            if (typeof window !== "undefined") sessionStorage.setItem("mock-comments", JSON.stringify([newComment, ...comments]));
            return { select: (q: string) => ({ single: async () => ({ data: newComment, error: null }) }) };
          }
          return { select: (query: string) => ({ single: async () => ({ data: { id: "000...000" }, error: null }) }) };
        },
        upsert: async (data: any) => {
          if (table === "post_reactions") {
            let reactions = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("mock-reactions") || "[]") : [];
            // Remove old reaction if exists
            reactions = reactions.filter((r: any) => r.user_id !== data.user_id);
            reactions.push(data);
            if (typeof window !== "undefined") sessionStorage.setItem("mock-reactions", JSON.stringify(reactions));
          }
          return { error: null };
        },
        delete: () => ({
          eq: (column: string, value: any) => ({
            eq: async (col2: string, val2: any) => {
              if (table === "post_reactions") {
                let reactions = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("mock-reactions") || "[]") : [];
                reactions = reactions.filter((r: any) => r.user_id !== val2);
                if (typeof window !== "undefined") sessionStorage.setItem("mock-reactions", JSON.stringify(reactions));
              }
              return { error: null };
            }
          })
        }),
      }),
      storage: {
        from: (bucket: string) => ({
          upload: async (path: string, file: File) => ({ data: { path }, error: null }),
          getPublicUrl: (path: string) => ({ data: { publicUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800" } }),
        })
      },
      rpc: async (fn: string, params: any) => {
        if (fn === "increment_view_count") {
          const views = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("mock-views") || "{}") : {};
          const postId = params.p_id;
          views[postId] = (views[postId] || 0) + 1;
          if (typeof window !== "undefined") sessionStorage.setItem("mock-views", JSON.stringify(views));
        }
        return { error: null };
      }
    } as any;
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storage: typeof window !== "undefined" ? window.sessionStorage : undefined,
        persistSession: true,
      },
    }
  )
}
