import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 block text-center font-serif text-lg">
          Penso em <em className="text-primary not-italic">Verso</em>
        </Link>
        {children}
      </div>
    </main>
  );
}
