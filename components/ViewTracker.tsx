"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

export function ViewTracker({ postId }: { postId: string }) {
  const isFetched = useRef(false);

  useEffect(() => {
    if (isFetched.current) return;
    isFetched.current = true;

    async function incrementView() {
      const supabase = createClient();
      await supabase.rpc("increment_view_count", { p_id: postId });
    }

    incrementView();
  }, [postId]);

  return null;
}
