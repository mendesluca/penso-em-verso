import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata = { title: "Recuperar senha" };

export default function RecuperarSenhaPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-center font-serif text-2xl">Recuperar senha</h1>
      <ResetPasswordForm />
    </div>
  );
}
