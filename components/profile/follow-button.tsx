"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toggleFollow } from "@/lib/actions/poems";

export function FollowButton({
  targetUserId,
  profilePath,
  isFollowing,
}: {
  targetUserId: string;
  profilePath: string;
  isFollowing: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant={isFollowing ? "outline" : "default"}
      disabled={pending}
      onClick={() => startTransition(() => toggleFollow(targetUserId, profilePath))}
    >
      {isFollowing ? "Seguindo" : "Seguir"}
    </Button>
  );
}
