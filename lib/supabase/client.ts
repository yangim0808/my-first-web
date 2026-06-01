import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true") {
    // sessionStorage helpers
    const getStore = (key: string, fallback: string = "[]") =>
      typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem(key) || fallback) : JSON.parse(fallback);
    const setStore = (key: string, value: any) => {
      if (typeof window !== "undefined") sessionStorage.setItem(key, JSON.stringify(value));
    };

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

      from: (table: string) => {
        // ── comments ──
        if (table === "comments") {
          return {
            select: (_q: string) => ({
              eq: (col: string, val: any) => ({
                order: (_c: string, _o: any) => ({
                  then: (resolve: any) => {
                    const comments = getStore("mock-comments").filter((c: any) => c[col] === val);
                    resolve({ data: comments, error: null });
                  },
                }),
              }),
            }),
            insert: (data: any) => {
              const comments = getStore("mock-comments");
              const newComment = {
                ...data,
                id: crypto.randomUUID?.() || Math.random().toString(),
                created_at: new Date().toISOString(),
                profiles: { username: "Mock User" },
              };
              setStore("mock-comments", [newComment, ...comments]);
              return {
                select: (_q: string) => ({
                  single: async () => ({ data: newComment, error: null }),
                }),
              };
            },
            delete: () => ({
              eq: (col: string, val: any) => {
                const comments = getStore("mock-comments").filter((c: any) => c[col] !== val);
                setStore("mock-comments", comments);
                return { then: (r: any) => r({ error: null }) };
              },
            }),
          };
        }

        // ── post_reactions ──
        if (table === "post_reactions") {
          return {
            select: (_q: string) => ({
              eq: (col: string, val: any) => ({
                then: (resolve: any) => {
                  const reactions = getStore("mock-reactions").filter((r: any) => r[col] === val);
                  resolve({ data: reactions, error: null });
                },
              }),
            }),
            upsert: async (data: any, _opts?: any) => {
              let reactions = getStore("mock-reactions");
              reactions = reactions.filter((r: any) => !(r.user_id === data.user_id && r.post_id === data.post_id));
              reactions.push(data);
              setStore("mock-reactions", reactions);
              return { error: null };
            },
            delete: () => ({
              eq: (col1: string, val1: any) => ({
                eq: async (col2: string, val2: any) => {
                  let reactions = getStore("mock-reactions");
                  reactions = reactions.filter((r: any) => !(r[col1] === val1 && r[col2] === val2));
                  setStore("mock-reactions", reactions);
                  return { error: null };
                },
              }),
            }),
          };
        }

        // ── profiles ──
        if (table === "profiles") {
          return {
            select: (_q: string) => ({
              eq: (_col: string, val: any) => ({
                maybeSingle: async () => ({ data: { id: val, username: "Mock User" }, error: null }),
                single: async () => ({ data: { id: val, username: "Mock User" }, error: null }),
                limit: (_n: number) => ({ then: (r: any) => r({ data: [{ id: val, user_id: val, title: "Mock", content: "Mock", created_at: new Date().toISOString() }], error: null }) }),
              }),
            }),
            insert: (_d: any) => ({ select: (_q: string) => ({ single: async () => ({ data: { id: "mock-id" }, error: null }) }) }),
            upsert: async () => ({ error: null }),
          };
        }

        // ── posts (default) ──
        return {
          select: (_q: string) => ({
            eq: (_col: string, value: any) => ({
              maybeSingle: async () => {
                const views = getStore("mock-views", "{}");
                return { data: { id: value, title: "Mock Post", content: "이것은 Mock 게시글 내용입니다. 로컬 테스트 환경에서 표시됩니다.", view_count: views[value] || 0 }, error: null };
              },
              single: async () => {
                const views = getStore("mock-views", "{}");
                return { data: { id: value, title: "Mock Post", content: "이것은 Mock 게시글 내용입니다. 로컬 테스트 환경에서 표시됩니다.", view_count: views[value] || 0 }, error: null };
              },
              limit: (_n: number) => ({ then: (r: any) => r({ data: [], error: null }) }),
            }),
            order: (_col: string, _opts: any) => ({
              then: (resolve: any) => resolve({
                data: [
                  { id: "mock-id-1", title: "Mock Post 1", content: "Content 1", created_at: new Date().toISOString(), profiles: { username: "Mock User" } },
                ],
                error: null,
              }),
            }),
            ilike: (_col: string, _pattern: string) => ({
              order: (_c: string, _o: any) => ({
                then: (r: any) => r({ data: [], error: null }),
              }),
            }),
          }),
          insert: (data: any) => ({
            select: (_q: string) => ({
              single: async () => ({ data: { id: "00000000-0000-0000-0000-000000000000" }, error: null }),
            }),
          }),
          upsert: async () => ({ error: null }),
          delete: () => ({ eq: () => ({ then: (r: any) => r({ error: null }) }) }),
        };
      },

      storage: {
        from: (_bucket: string) => ({
          upload: async (_path: string, _file: File) => ({ data: { path: _path }, error: null }),
          getPublicUrl: (_path: string) => ({ data: { publicUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800" } }),
        }),
      },

      rpc: async (fn: string, params: any) => {
        if (fn === "increment_view_count") {
          const views = getStore("mock-views", "{}");
          views[params.p_id] = (views[params.p_id] || 0) + 1;
          setStore("mock-views", views);
        }
        return { error: null };
      },
    } as any;

  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.error("Supabase environment variables are missing!");
    // Return a dummy client that fails gracefully instead of crashing
    return {
      auth: {
        signInWithPassword: async () => ({ data: { user: null }, error: { message: "Configuration error: Missing Supabase URL or Key" } }),
        signUp: async () => ({ data: { user: null }, error: { message: "Configuration error: Missing Supabase URL or Key" } }),
        getUser: async () => ({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: async () => ({ error: null }),
      },
      from: () => ({
        select: () => ({ eq: () => ({ order: () => ({ then: (r: any) => r({ data: [], error: null }) }), then: (r: any) => r({ data: [], error: null }) }) }),
        insert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
        upsert: async () => ({ error: null }),
        delete: () => ({ eq: () => ({ then: (r: any) => r({ error: null }) }) }),
      }),
    } as any;
  }

  return createBrowserClient(url, anonKey, {
    auth: {
      storage: typeof window !== "undefined" ? window.sessionStorage : undefined,
      persistSession: true,
    },
  })
}
