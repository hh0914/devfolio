export function SectionHeading({
  index,
  title,
  description,
}: {
  index?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      {index ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{index}</p>
      ) : null}
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
      ) : null}
    </div>
  );
}
