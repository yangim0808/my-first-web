export type Post = {
  id: number;
  title: string;
  body: string; // JSONPlaceholder uses 'body' instead of 'content'
  author?: string; // JSONPlaceholder doesn't have author, adding as optional
  date?: string; // JSONPlaceholder doesn't have date, adding as optional
};

export const posts: Post[] = [
  {
    id: 1,
    title: "Next.js 시작하기",
    body: "Next.js는 React 기반의 풀스택 웹 프레임워크입니다. 서버 사이드 렌더링과 정적 사이트 생성을 지원합니다.",
    author: "김개발",
    date: "2026-04-01",
  },
  {
    id: 2,
    title: "TypeScript 기초",
    body: "TypeScript는 JavaScript에 정적 타입을 추가한 언어입니다. 코드의 안정성과 생산성을 높여줍니다.",
    author: "이코딩",
    date: "2026-04-03",
  },
  {
    id: 3,
    title: "Tailwind CSS 활용법",
    body: "Tailwind CSS는 유틸리티 퍼스트 CSS 프레임워크로, 빠르고 일관된 스타일링을 가능하게 합니다.",
    author: "박디자인",
    date: "2026-04-05",
  },
];

export async function getPosts(): Promise<Post[]> {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }
    const data = await response.json();
    // JSONPlaceholder posts have { id, title, body, userId }
    // We'll map them to our Post type
    return data.map((post: any) => ({
      ...post,
      author: `User ${post.userId}`,
      date: new Date().toISOString().split("T")[0],
    }));
  } catch (error) {
    console.error("Error fetching posts:", error);
    return posts; // Fallback to local posts
  }
}

export async function getPostById(id: number): Promise<Post | undefined> {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    if (!response.ok) {
      if (response.status === 404) return undefined;
      throw new Error("Failed to fetch post");
    }
    const post = await response.json();
    return {
      ...post,
      author: `User ${post.userId}`,
      date: new Date().toISOString().split("T")[0],
    };
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    return posts.find((p) => p.id === id);
  }
}
