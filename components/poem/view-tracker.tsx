"use client";

import { useEffect, useRef } from "react";
import { recordPoemView } from "@/lib/actions/poems";

export function ViewTracker({ poemId }: { poemId: string }) {
  const recorded = useRef(false);

  useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;
    recordPoemView(poemId);
  }, [poemId]);

  return null;
}
