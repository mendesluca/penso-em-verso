"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface PoemEditorCategory {
  id: string;
  name: string;
}

export interface PoemEditorTag {
  id: string;
  name: string;
}

export interface PoemEditorInitialValues {
  title: string;
  content: string;
  category_id: string | null;
  status: "draft" | "published";
  tagIds?: string[];
}

type ActionState = { error: string | null };
type PoemFormAction = (state: ActionState, formData: FormData) => Promise<ActionState>;

export function PoemEditor({
  action,
  categories,
  sentiments,
  initialValues,
}: {
  action: PoemFormAction;
  categories: PoemEditorCategory[];
  sentiments: PoemEditorTag[];
  initialValues?: PoemEditorInitialValues;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {
    error: null,
  });
  const isPublished = initialValues?.status === "published";

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title" className="font-mono text-xs uppercase tracking-wide">
          Título
        </Label>
        <Input
          id="title"
          name="title"
          defaultValue={initialValues?.title}
          placeholder="Título do poema"
          className="border-none px-0 font-serif text-2xl shadow-none focus-visible:ring-0"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="content" className="font-mono text-xs uppercase tracking-wide">
          Conteúdo
        </Label>
        <Textarea
          id="content"
          name="content"
          defaultValue={initialValues?.content}
          placeholder="Escreva seu poema…"
          className="min-h-[360px] resize-y font-serif text-lg leading-relaxed"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="category_id" className="font-mono text-xs uppercase tracking-wide">
          Categoria
        </Label>
        <Select name="category_id" defaultValue={initialValues?.category_id ?? undefined}>
          <SelectTrigger id="category_id" className="w-full sm:w-64">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {sentiments.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <Label className="font-mono text-xs uppercase tracking-wide">
            Sentimento (opcional, ajuda na descoberta)
          </Label>
          <div className="flex flex-wrap gap-2">
            {sentiments.map((tag) => (
              <label
                key={tag.id}
                className="cursor-pointer rounded-full border border-border px-3 py-1 font-mono text-xs has-[:checked]:border-primary has-[:checked]:bg-accent has-[:checked]:text-primary"
              >
                <input
                  type="checkbox"
                  name="tags"
                  value={tag.id}
                  defaultChecked={initialValues?.tagIds?.includes(tag.id)}
                  className="sr-only"
                />
                {tag.name}
              </label>
            ))}
          </div>
        </div>
      )}

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-3">
        <Button
          type="submit"
          name="intent"
          value="draft"
          variant="outline"
          disabled={pending}
        >
          Salvar rascunho
        </Button>
        <Button type="submit" name="intent" value="publish" disabled={pending}>
          {isPublished ? "Salvar alterações" : "Publicar"}
        </Button>
      </div>
    </form>
  );
}
