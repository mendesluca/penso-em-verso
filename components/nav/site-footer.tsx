export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-8 text-sm text-muted-foreground">
        <p className="font-serif italic">A casa da poesia brasileira.</p>
        <p className="font-mono text-xs uppercase tracking-wide">
          Penso em Verso · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
