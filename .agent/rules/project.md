# Project Rules

## Version Policy
- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 실제 package.json이 더 최신일 수 있다.
- 수업 프롬프트와 설명은 교재 기준으로 통일한다.
- 빌드 오류가 버전 차이에서 발생하면 package.json 기준으로 원인을 확인한다.

## Tech Stack & Ch9 Supabase Auth Criteria
- 프로젝트 환경: Next.js 16.2.1 (App Router only), Tailwind CSS 4, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 코드·패키지 설명은 Ch7·Ch8 교재 기준을 따른다.
- Supabase 대시보드 메뉴 안내만 2026년 5월 기준이다.
- Ch8 환경변수 이름을 유지한다: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- 이메일/비밀번호 인증만 사용한다. (소셜 로그인은 추가하지 않는다)
- App Router만 사용한다. `next/router`, `pages router`는 사용하지 않는다.
- 보호 라우트 파일로 `middleware.ts`를 사용한다.
- Supabase Auth 로그인은 `signInWithPassword`를 사용한다. 구버전 `auth.signIn()`은 사용하지 않는다.
- `service_role` 키는 클라이언트에 절대 두지 않는다.
- Ch10 게시글 CRUD: `lib/supabase/client.ts`(Ch8), `useAuth/AuthProvider`(Ch9) 활용. 작성/수정/삭제 등의 기능은 페이지 UX에 집중하며, 실제 데이터베이스 권한 보안은 모두 Ch11 RLS로 연기한다.
