import { LoginForm } from "@/components/auth/login-form";

export const metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-center font-serif text-2xl">Bem-vindo(a) de volta</h1>
      <LoginForm />
    </div>
  );
}
