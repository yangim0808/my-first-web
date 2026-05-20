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
