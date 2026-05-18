import { createClient } from './supabase/client';

export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
}

export async function signUpWithEmail(email: string, password: string, name: string) {
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
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  
  return { error };
}
