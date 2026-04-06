# Copilot Instructions

## Tech Stack

- **Next.js**: 16.2.1 (App Router ONLY)
- **Tailwind CSS**: 4 (`@tailwindcss/postcss`)
- **React**: 19.2.4
- **TypeScript**: 5

## Coding Conventions

- **Server Component 기본**: 모든 컴포넌트는 기본적으로 Server Component로 작성한다. Client Component가 필요한 경우에만 `"use client"` 지시어를 사용한다.
- **Tailwind CSS만 사용**: 스타일링은 Tailwind CSS만 사용한다. 인라인 스타일(`style={}`)이나 CSS Modules, styled-components 등은 사용하지 않는다.
- **App Router ONLY**: `app/` 디렉토리 기반 라우팅만 사용한다. `pages/` 디렉토리는 절대 사용하지 않는다.

## Known AI Mistakes

> ⚠️ 아래 실수를 반드시 피할 것

1. **`next/router` 금지** — `next/router`는 Pages Router 전용이므로 절대 사용하지 않는다. 반드시 `next/navigation`의 `useRouter`, `usePathname`, `useSearchParams` 등을 사용한다.
2. **Pages Router 금지** — `getServerSideProps`, `getStaticProps`, `getInitialProps` 등 Pages Router API를 사용하지 않는다.
3. **`params`는 `await` 필수** — Next.js 16에서 동적 라우트의 `params`는 Promise이므로 반드시 `await`하여 사용한다.
   ```tsx
   // ✅ 올바른 사용
   export default async function Page({ params }: { params: Promise<{ id: string }> }) {
     const { id } = await params;
   }

   // ❌ 잘못된 사용
   export default function Page({ params }: { params: { id: string } }) {
     const { id } = params; // params는 Promise이므로 await 필요
   }
   ```
