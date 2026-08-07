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
    .select("display_name, bio, avatar_url, banner_url, social_links")
    .eq("id", user!.id)
    .single();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl">Editar perfil</h1>
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
