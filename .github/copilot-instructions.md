AGENT.md를 참조한다.

## Design Tokens

- Primary color: shadcn/ui --primary (어두운 파란색 계열)
- Background: --background (흰색)
- Card: shadcn/ui Card 컴포넌트 사용 (rounded-lg shadow-sm)
- Spacing: 컨텐츠 간격 space-y-6, 카드 내부 p-6
- Max width: max-w-4xl mx-auto (메인 컨텐츠)
- 반응형: md 이상 2열 그리드, 모바일 1열

## Component Rules

- UI 컴포넌트는 shadcn/ui 사용 (components/ui/)
- Button, Card, Input, Dialog 등 shadcn/ui 컴포넌트 우선
- 커스텀 컴포넌트는 components/ 루트에 배치
- Tailwind 기본 컬러 직접 사용 금지 → CSS 변수(디자인 토큰) 사용

## Version Policy
- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 실제 package.json이 더 최신일 수 있다.
- 수업 프롬프트와 설명은 교재 기준으로 통일한다.
- 빌드 오류가 버전 차이에서 발생하면 package.json 기준으로 원인을 확인한다.

## Supabase Rules
- 코드·패키지 설명은 Ch7·Ch8 교재 기준을 따른다.
- Supabase 대시보드 메뉴 안내만 2026년 5월 기준이다.
- 환경변수 이름 유지: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
- Auth 인증: 이메일/비밀번호만 지원 (signInWithPassword 사용, auth.signIn 절대 사용 금지, 소셜 로그인 X)
- 보호 라우트: middleware.ts 사용
- service_role 키 클라이언트 노출 금지
- App Router 전용: next/router 금지
- Ch10 CRUD 구현: Ch8의 `lib/supabase/client.ts` 및 Ch9의 `useAuth/AuthProvider`를 필수로 사용. (실제 수정/삭제 RLS 보안은 Ch11에서 구현하므로, Ch10은 프론트엔드 UX 위주로 개발할 것)