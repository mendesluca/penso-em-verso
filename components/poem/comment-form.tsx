"use client";

import { useRef, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addComment } from "@/lib/actions/poems";

export function CommentForm({ poemId, poemPath }: { poemId: string; poemPath: string }) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={(formData: FormData) =>
        startTransition(async () => {
          await addComment(poemId, poemPath, formData);
          formRef.current?.reset();
        })
      }
      className="flex flex-col gap-2"
    >
      <Textarea name="content" placeholder="Deixe um comentário…" rows={3} required />
      <Button type="submit" size="sm" disabled={pending} className="w-fit">
        {pending ? "Enviando…" : "Comentar"}
      </Button>
    </form>
  );
}
