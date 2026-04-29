# 블로그 프로젝트 아키텍처 (ARCHITECTURE.md)

## 1. 프로젝트 개요 및 기술 스택
이 프로젝트는 개인 블로그를 위한 정적/동적 하이브리드 웹 사이트를 구축하는 것을 목표로 합니다.
- **프레임워크:** Next.js 16 (App Router 모델만 사용)
- **스타일링:** Tailwind CSS v4
- **UI 라이브러리:** shadcn/ui
- **백엔드/데이터베이스 연동:** Supabase (PostgreSQL, Auth)

## 2. 페이지 맵 (URL 구조)
Next.js App Router 기반의 전체 URL 아키텍처입니다.

- `/`             → 홈 (포스트 목록)
- `/posts`        → 포스트 목록
- `/posts/new`    → 포스트 작성
- `/posts/[id]`   → 포스트 상세
- `/mypage`       → 마이페이지
- `/login`        → 로그인
- `/signup`       → 회원가입

## 3. 주요 페이지 및 데이터 흐름
각 페이지별 주요 컴포넌트 사용과 데이터의 흐름을 정의합니다.

### 3.1. 홈 페이지 (`/`)
- **컴포넌트 계층:** `Home` (Server) -> `Card`, `Button`
- **데이터 흐름:** 최근 작성된 블로그 메인 요약글 또는 환영 메시지를 표시합니다.
- **동작 플로우:** 방금 방문한 사용자가 전체 포스트 목록(`/posts`) 또는 회원가입/로그인으로 네비게이팅.

### 3.2. 포스트 목록 페이지 (`/posts`)
- **컴포넌트 계층:** `PostsPage` (Server) -> `Card` (Header, Title, Content, Footer), `Button`
- **데이터 흐름:** Supabase `posts` 테이블에서 최신순으로 전체 게시글 데이터를 비동기(Fetch) 조회합니다.
- **동작 플로우:** 반응형(1열/2열) 그리드로 카드 목록을 제공하며, 각 카드를 클릭하면 상세(`/posts/[id]`) 페이지로 이동합니다.

### 3.3. 포스트 작성 페이지 (`/posts/new`)
- **컴포넌트 계층:** `NewPostPage` (Client `use client`) -> `Input`, `Textarea`, `Button`
- **데이터 흐름:**
  1. 클라이언트 측에서 제어되는 폼을 통해 제목과 내용을 수집합니다.
  2. 현재 로그인된 사용자의 세션을 확인한 뒤, Supabase API를 통해 `posts` 테이블에 새 레코드를 Insert 합니다.
- **동작 플로우:** 성공 시 알림 후 새로 작성된 글(`/posts/[새글id]`)로 자동 리다이렉트 됩니다.

### 3.4. 포스트 상세 페이지 (`/posts/[id]`)
- **컴포넌트 계층:** `PostDetailPage` (Server) -> `Dialog` (수정/삭제 등 모달), `Button`
- **데이터 흐름:** URL에 제공된 `[id]` 파라미터로 해당 포스트 정보와 Foreign Key인 `users` 작성자 정보를 조인(Join)하여 서버에서 화면을 렌더링합니다.
- **동작 플로우:** 본문을 읽고, 현재 유저 세션이 글 작성자와 일치할 경우 수정/삭제 `Button`이 활성화됩니다. 글 삭제 시 `Dialog`로 한 번 더 의사를 묻습니다.

## 4. 인증 (Authentication)
- **방식:** **이메일 & 비밀번호 로그인** (Supabase Auth 활용)
- **페이지 권한 (인가 구조):**
  - 조회 (홈, 글 목록, 글 상세 읽기): 모든 사용자 가능(비로그인 포함)
  - 작성 및 삭제 (방문 권한): 로그인된 사용자(`users` 존재 확인)만 가능

## 5. UI 컴포넌트 구조 및 디자인 토큰
### 5.1. 컴포넌트 계층 (shadcn/ui 기반)
모든 기본 요소는 `components/ui/`에서 가져와 조합합니다.
- **Button:** 사이트 전반 공통 액션 (기본 동작, 외곽선 outline, 파괴적 destructive 등 다양한 variant 사용)
- **Card:** 콘텐츠(블로그 목록 등)를 논리적인 묶음으로 분리, `CardHeader`와 `CardContent`로 시각적 계층 명확화
- **Input:** 사용자가 값을 입력해야 하는 모든 검색/로그인/글쓰기 단일 행 텍스트 박스
- **Dialog:** 삭제 경고 등 사용자의 입력 흐름을 멈추고 주목해야 할 팝업 안내 구성

### 5.2. 디자인 토큰 규칙 (AGENTS.md 기준)
- **Layout & Spacing:** 메인 영역 최대 폭 `max-w-4xl mx-auto` 지정으로 한눈에 들어오는 가독성 확보. 요소와 아이템 사이는 통일된 `space-y-6` 및 카드 패딩(`p-6` 상당) 사용.
- **Colors:** globals.css CSS 변수 참조. 차분한 슬레이트 블루(`--primary`) 포인트 사용. 그라디언트와 짙은 그림자는 지양하여 깔끔한 모던 블로그 룩을 추구.
- **Typography:** 본문은 명확한 짙은 그레이(`--foreground`), 어두운 배경 모드에선 대비가 부드러운 오프화이트 글꼴 색상 사용으로 시력 보호 지원.

## 6. 데이터 모델 (Data Schema)
Supabase (PostgreSQL)의 두 가지 메인 테이블을 사용하며, 1:N 관계를 가집니다.

### 6.1. profiles (사용자)
Supabase `auth.users`와 연결된 공개 사용자 프로필 정보입니다.
- **`id`** (UUID) : Primary Key (Supabase `auth.users` 참조)
- **`username`** (Text) : 사용자의 고유 혹은 표시 이름
- **`avatar_url`** (Text) : 사용자 프로필 사진 URL
- **`created_at`** (Timestamptz) : 프로필 생성 타임스탬프

### 6.2. posts (포스트)
작성된 블로그 글 데이터 모델입니다.
- **`id`** (UUID) : Primary Key
- **`user_id`** (UUID) : **Foreign Key** (참조 -> `profiles.id`)
- **`title`** (Text) : 게시물 제목
- **`content`** (Text) : 본문 데이터 (마크다운/HTML 등)
- **`created_at`** (Timestamptz) : 작성 타임스탬프

### 6.3. 개체 관계 모델링 (Entity Relationships)
- **profiles (1) : posts (N)** 관계 구성.
- 각 포스트는 `user_id` 속성을 통해 하나의 특정 작성자(`profiles.id`)에 속합니다. RLS (Row Level Security) 규칙을 통해, 사용자 본인만 자신의 포스트(`user_id = user의 id`)를 수정/삭제할 수 있도록 제어합니다.
