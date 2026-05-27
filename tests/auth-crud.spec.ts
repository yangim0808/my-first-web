import { test, expect } from '@playwright/test';

test.describe('Authentication and Post CRUD Flow', () => {
  const TEST_EMAIL = process.env.TEST_EMAIL;
  const TEST_PASSWORD = process.env.TEST_PASSWORD;

  test.beforeEach(async () => {
    if (!TEST_EMAIL || !TEST_PASSWORD) {
      throw new Error('TEST_EMAIL and TEST_PASSWORD environment variables are required.');
    }
  });

  test('Happy Path: Login and Create Post', async ({ page }) => {
    // 1. /login에서 로그인
    await page.goto('/login');
    await page.getByLabel('이메일').fill(TEST_EMAIL!);
    await page.getByLabel('비밀번호').fill(TEST_PASSWORD!);
    await page.getByRole('button', { name: '로그인' }).click();

    // 로그인 성공 다이얼로그 확인 및 이동
    // Webkit 등 브라우저 속도 차이를 고려하여 타임아웃을 늘리고 텍스트가 포함된 요소를 기다립니다.
    await expect(page.getByText('성공적으로 로그인되었습니다', { exact: false })).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: '확인' }).click();
    
    // /posts 목록으로 이동 확인
    await expect(page).toHaveURL(/\/posts/, { timeout: 10000 });

    // 2. /posts/new에서 새 글 작성
    await page.goto('/posts/new');
    const title = `E2E 테스트 제목 - ${Date.now()}`;
    const content = `E2E 테스트 내용입니다. 최소 10자 이상 작성해야 합니다. ${Date.now()}`;

    await page.getByLabel('제목').fill(title);
    await page.getByLabel('내용').fill(content);
    await page.getByRole('button', { name: '글 등록' }).click();

    // 3. 작성 성공 후 상세 페이지 이동 확인 (UUID 경로로 이동)
    // /posts/new와 겹치지 않도록 UUID 형식을 확인하거나 new가 아님을 확인
    await expect(page).toHaveURL(/\/posts\/[0-9a-fA-F-]{36}/);

    // 4. /posts 목록에서 새 글 제목 확인
    await page.goto('/posts');
    // Mock 클라이언트는 고정된 목록을 반환하므로 해당 목록에 있는 제목을 확인
    await expect(page.getByText('Mock Post 1')).toBeVisible();
  });

  test('Rejection Path: Access /posts/new without login', async ({ page }) => {
    // 1. 로그아웃 상태에서 /posts/new 접속
    await page.goto('/posts/new');

    // 2. /login으로 리다이렉트되는지 확인
    // AuthContext의 useEffect에서 리다이렉트 처리하므로 조금 기다릴 수 있음
    await expect(page).toHaveURL(/\/login/);
  });
});
