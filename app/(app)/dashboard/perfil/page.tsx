import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/profile/profile-form";

export const metadata = { title: "Perfil" };

export default async function PerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, bio, avatar_url, banner_url, social_links")
    .eq("id", user!.id)
    .single();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl">Editar perfil</h1>
        {profile?.username && (
          <Link
            href={`/@${profile.username}`}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs uppercase tracking-wide text-muted-foreground hover:text-primary"
          >
            Ver perfil público ↗
          </Link>
        )}
      </div>
      <ProfileForm
        values={{
          display_name: profile?.display_name ?? "",
          bio: profile?.bio ?? null,
          avatar_url: profile?.avatar_url ?? null,
          banner_url: profile?.banner_url ?? null,
          instagram: (profile?.social_links as Record<string, string> | null)?.instagram ?? "",
        }}
      />
    </div>
  );
}
