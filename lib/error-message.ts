/**
 * Supabase나 네트워크 에러를 사용자에게 보여줄 친절한 한국어 메시지로 변환합니다.
 */
export function getErrorMessage(error: any): string {
  if (!error) return "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

  const message = error.message || String(error);
  const code = error.code || "";

  // 1. 권한 오류 (RLS 등)
  if (code === "42501" || message.toLowerCase().includes("row-level security")) {
    return "이 작업을 수행할 권한이 없습니다.";
  }

  // 2. 네트워크 오류
  if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
    return "인터넷 연결을 확인해주세요.";
  }

  // 3. 찾을 수 없음
  if (message.toLowerCase().includes("not found")) {
    return "요청한 데이터를 찾을 수 없습니다.";
  }

  // 기본값
  return "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
}
