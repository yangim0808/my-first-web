import { createClient } from './supabase/client';

export async function signInWithEmail(email: string, password: string) {
  if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true") {
    console.log("Using Mock Auth for sign in");
    return {
      data: {
        user: { id: "mock-user-id", email, user_metadata: { name: "Mock User" } },
        session: { access_token: "mock-token" }
      },
      error: null
    };
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
}

export async function signUpWithEmail(email: string, password: string, name: string) {
  if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true") {
    console.log("Using Mock Auth for sign up");
    return {
      data: {
        user: { id: "mock-user-id", email, user_metadata: { name } },
        session: { access_token: "mock-token" }
      },
      error: null
    };
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });
  
  if (!error && data.user) {
    // 트리거가 작동하지 않을 경우를 대비해 수동으로 프로필을 생성합니다.
    await supabase.from('profiles').upsert({
      id: data.user.id,
      username: name,
    });
  }
  
  return { data, error };
}

export async function signOut() {
  if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true") {
    console.log("Using Mock Auth for sign out");
    localStorage.removeItem("mock-user");
    return { error: null };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  
  return { error };
}
