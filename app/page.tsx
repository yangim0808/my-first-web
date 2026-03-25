export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-3xl px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900">은임의 블로그</h1>
          <p className="mt-1 text-sm text-gray-500">일상과 배움을 기록합니다</p>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="mx-auto max-w-3xl px-6 py-10">
        {/* 프로필 카드 */}
        <section className="rounded-lg bg-white p-8 shadow">
          <h2 className="text-3xl font-bold text-gray-900">양은임</h2>
          <p className="mt-2 text-gray-600">안녕하세요! 한신대학교에서 공공인재빅데이터융합을 전공하고 있는 양은임입니다.</p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-md bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">학교</p>
              <p className="mt-1 text-lg font-medium text-gray-900">한신대학교</p>
            </div>
            <div className="rounded-md bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">전공</p>
              <p className="mt-1 text-lg font-medium text-gray-900">공공인재빅데이터융합학과</p>
            </div>
            <div className="rounded-md bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">취미</p>
              <p className="mt-1 text-lg font-medium text-gray-900">영화 보기 🎬</p>
            </div>
          </div>
        </section>

        {/* 최근 글 섹션 */}
        <section className="mt-10">
          <h3 className="text-xl font-bold text-gray-900">최근 글</h3>
          <div className="mt-4 space-y-4">
            <article className="rounded-lg bg-white p-6 shadow transition hover:shadow-md">
              <time className="text-sm text-gray-400">2026. 3. 25.</time>
              <h4 className="mt-1 text-lg font-semibold text-gray-900">블로그를 시작합니다</h4>
              <p className="mt-2 text-gray-600">
                안녕하세요, 오늘부터 블로그를 시작합니다. 개발 공부와 일상을 기록할 예정입니다. 많은 관심 부탁드려요!
              </p>
            </article>
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-3xl px-6 py-6 text-center text-sm text-gray-400">
          © 2026 은임의 블로그. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
