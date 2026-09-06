type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function SectionHeading({ eyebrow, title, description, action }: Props) {
  return (
    <div className="flex items-end justify-between gap-5">
      <div>
        {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">{eyebrow}</p>}
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{title}</h2>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
