# Context — my-first-web 프로젝트 상태

## 현재 상태

- 마지막 작업일: 2026-05-27
- 완료된 작업: 홈 페이지, 초기 레이아웃, 포스트 목록, Supabase 연결(Ch8), 로그인/회원가입 등 인증 구현(Ch9), 포스트 CRUD(Ch10), RLS 보안 정책 적용(Ch11), 폼 유효성 검증 및 에러 핸들링, Playwright E2E 테스트 구축
- 진행 중: 최종 코드 리뷰 보완 및 Vercel 배포 검증
- 미착수: 마이페이지, 댓글 기능 (기능 확인 필요)

## 기술 결정 사항

- 인증: Supabase Auth (Email/Password), `signInWithPassword` 사용, `middleware.ts`로 보호 라우트 처리, 소셜 로그인 X
- 상태관리: React Context (AuthProvider)
- 이미지: Supabase Storage 사용 예정
- 기타: 코드/패키지 설명은 Ch7/Ch8 교재 기준, Supabase 대시보드 설명은 2026년 5월 기준 적용

## Version Policy
- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 실제 설치 기준(package.json): Next.js 16.2.1, @supabase/supabase-js ^2.105.4, @supabase/ssr ^0.10.3, react 19.2.4
- 실제 package.json이 더 최신일 수 있다.
- 수업 프롬프트와 설명은 교재 기준으로 통일한다.
- 빌드 오류가 버전 차이에서 발생하면 package.json 기준으로 원인을 확인한다.

## 해결된 이슈

- shadcn/ui Button variant가 디자인 토큰과 불일치 → globals.css의 --primary 수정으로 해결
- 모바일 헤더 메뉴가 겹침 → Sheet 컴포넌트로 교체

## 알게 된 점

- Tailwind CSS 4 기준에서는 `@import "tailwindcss"` + `@theme` 블록으로 설정 (`tailwind.config.js` 불필요)
- Server Component에서 useRouter 사용 불가 → redirect() 사용