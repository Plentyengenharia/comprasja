export function SimplePage({
  title,
  lead,
  children,
}: {
  title: string;
  lead: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-semibold tracking-tight text-ink">{title}</h1>
      <p className="mt-4 text-lg text-ink-muted">{lead}</p>
      {children ? <div className="mt-10 space-y-4 text-ink">{children}</div> : null}
    </div>
  );
}
