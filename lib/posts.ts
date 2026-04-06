export type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
};

export const posts: Post[] = [
  {
    id: 1,
    title: "Next.js 시작하기",
    content: "Next.js는 React 기반의 풀스택 웹 프레임워크입니다. 서버 사이드 렌더링과 정적 사이트 생성을 지원합니다.",
    author: "김개발",
    date: "2026-04-01",
  },
  {
    id: 2,
    title: "TypeScript 기초",
    content: "TypeScript는 JavaScript에 정적 타입을 추가한 언어입니다. 코드의 안정성과 생산성을 높여줍니다.",
    author: "이코딩",
    date: "2026-04-03",
  },
  {
    id: 3,
    title: "Tailwind CSS 활용법",
    content: "Tailwind CSS는 유틸리티 퍼스트 CSS 프레임워크로, 빠르고 일관된 스타일링을 가능하게 합니다.",
    author: "박디자인",
    date: "2026-04-05",
  },
];
