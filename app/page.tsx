export default function Home() {
  const posts = [
    {
      id: 1,
      title: "블로그를 시작합니다",
      preview:
        "안녕하세요, 오늘부터 블로그를 시작합니다. 개발 공부와 일상을 기록할 예정입니다. 많은 관심 부탁드려요!",
      author: "양은임",
      date: "2026. 3. 25.",
    },
    {
      id: 2,
      title: "Next.js로 블로그 만들기",
      preview:
        "Next.js App Router를 활용해 나만의 블로그를 만들어 보겠습니다. 프로젝트 세팅부터 배포까지 과정을 공유합니다.",
      author: "양은임",
      date: "2026. 3. 27.",
    },
    {
      id: 3,
      title: "시맨틱 HTML의 중요성",
      preview:
        "웹 접근성과 SEO를 위해 시맨틱 태그를 올바르게 사용하는 방법을 정리했습니다. header, nav, main, article, footer 등을 알아봅니다.",
      author: "양은임",
      date: "2026. 3. 30.",
    },
  ];

  return (
    <>
      <header>
        <h1>은임의 블로그</h1>
        <nav>
          <ul>
            <li><a href="/">홈</a></li>
            <li><a href="/about">소개</a></li>
            <li><a href="/posts">게시글</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <h2>최근 게시글</h2>
        {posts.map((post) => (
          <article key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.preview}</p>
            <p>작성자: {post.author}</p>
            <time dateTime={post.date}>{post.date}</time>
          </article>
        ))}
      </main>

      <footer>
        <p>© 2026 은임의 블로그. All rights reserved.</p>
      </footer>
    </>
  );
}
