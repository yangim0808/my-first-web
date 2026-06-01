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
        select: (query: string) => ({
          eq: (column: string, value: any) => ({
            maybeSingle: async () => ({ data: { id: "mock-id" }, error: null }),
            single: async () => ({ data: { id: "mock-id", title: "Mock Title", content: "Mock Content" }, error: null }),
          }),
          order: (column: string, { ascending }: any) => ({
            then: (resolve: any) => resolve({
              data: [
                { id: "mock-id-1", title: "Mock Post 1", content: "Content 1", created_at: new Date().toISOString(), profiles: { username: "Mock User" } },
                { id: "mock-id-2", title: "Mock Post 2", content: "Content 2", created_at: new Date().toISOString(), profiles: { username: "Mock User" } },
              ],
              error: null
            })
          }),
        }),
        insert: (data: any) => ({
          select: (query: string) => ({
            single: async () => {
              return { data: { id: "00000000-0000-0000-0000-000000000000" }, error: null };
            }
          })
        }),
        upsert: async () => ({ error: null }),
      }),
      storage: {
        from: (bucket: string) => ({
          upload: async (path: string, file: File) => ({ data: { path }, error: null }),
          getPublicUrl: (path: string) => ({ data: { publicUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800" } }),
        })
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
