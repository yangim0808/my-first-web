"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 에러를 에러 모니터링 서비스에 기록할 수 있습니다.
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-red-100 shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-900">문제가 발생했습니다</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            페이지를 불러오는 중에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
          </p>
          <div className="p-3 bg-red-50 rounded-md text-xs font-mono text-red-700 break-all">
            {error.message || "알 수 없는 에러"}
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => window.location.href = "/"}>
            홈으로 이동
          </Button>
          <Button className="flex-1 gap-2" onClick={() => reset()}>
            <RefreshCcw className="w-4 h-4" /> 다시 시도
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
