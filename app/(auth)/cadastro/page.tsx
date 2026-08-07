import { SignupForm } from "@/components/auth/signup-form";

export const metadata = { title: "Criar conta" };

export default function CadastroPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="font-serif text-2xl">Comece a escrever</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Crie sua conta e publique seu primeiro poema em minutos.
        </p>
      </div>
      <SignupForm />
    </div>
  );
}
