-- RLS 활성화
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- SELECT: 누구나 읽기 가능
CREATE POLICY "누구나 읽기 가능"
ON posts FOR SELECT
USING (true);

-- INSERT: 로그인 사용자만 본인 user_id로 작성
CREATE POLICY "로그인 사용자만 작성 가능"
ON posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- UPDATE: 작성자만 본인 글 수정
CREATE POLICY "작성자만 수정 가능"
ON posts FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- DELETE: 작성자만 본인 글 삭제
CREATE POLICY "작성자만 삭제 가능"
ON posts FOR DELETE
USING (auth.uid() = user_id);

-- 1. posts 테이블 RLS 활성화
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 2. 기존 정책 정리 (중복 생성 에러 방지용)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.posts;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.posts;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.posts;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.posts;

-- 3. SELECT 정책
CREATE POLICY "Enable read access for all users"
ON public.posts
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- 4. INSERT 정책
CREATE POLICY "Enable insert for authenticated users only"
ON public.posts
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 5. UPDATE 정책
CREATE POLICY "Enable update for users based on user_id"
ON public.posts
AS PERMISSIVE FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 6. DELETE 정책
CREATE POLICY "Enable delete for users based on user_id"
ON public.posts
AS PERMISSIVE FOR DELETE
TO authenticated
USING (auth.
