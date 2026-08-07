"use client";

import { useTransition } from "react";
import { Heart, Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleLike, toggleFavorite } from "@/lib/actions/poems";
import { toast } from "sonner";

export function PoemActions({
  poemId,
  poemPath,
  likeCount,
  isLiked,
  isFavorited,
  canInteract,
}: {
  poemId: string;
  poemPath: string;
  likeCount: number;
  isLiked: boolean;
  isFavorited: boolean;
  canInteract: boolean;
}) {
  const [pending, startTransition] = useTransition();

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ url });
      return;
    }
    await navigator.clipboard.writeText(url);
    toast("Link copiado.");
  }

  return (
    <div className="flex items-center gap-1 border-y border-border py-3">
      <Button
        variant="ghost"
        size="sm"
        disabled={!canInteract || pending}
        onClick={() => startTransition(() => toggleLike(poemId, poemPath))}
        className="gap-1.5"
      >
        <Heart className={isLiked ? "size-4 fill-primary text-primary" : "size-4"} />
        <span className="tabular-nums">{likeCount}</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        disabled={!canInteract || pending}
        onClick={() => startTransition(() => toggleFavorite(poemId, poemPath))}
      >
        <Bookmark className={isFavorited ? "size-4 fill-primary text-primary" : "size-4"} />
      </Button>
      <Button variant="ghost" size="sm" onClick={share}>
        <Share2 className="size-4" />
      </Button>
    </div>
  );
}
