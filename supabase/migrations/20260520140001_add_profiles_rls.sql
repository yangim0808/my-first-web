-- profiles RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- SELECT: 누구나 읽기 가능
CREATE POLICY "누구나 프로필 읽기 가능" ON profiles
FOR SELECT USING (true);

-- INSERT: 로그인 사용자만 본인 id로 작성 가능
CREATE POLICY "로그인 사용자만 프로필 작성 가능" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- UPDATE: 본인만 수정 가능
CREATE POLICY "작성자만 프로필 수정 가능" ON profiles
FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- DELETE: 본인만 삭제 가능
CREATE POLICY "작성자만 프로필 삭제 가능" ON profiles
FOR DELETE USING (auth.uid() = id);
