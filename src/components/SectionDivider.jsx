export default function SectionDivider({ number, title }) {
  return (
    <div className="flex items-center gap-5 sm:gap-6">
      <span className="label-nav shrink-0 text-muted">{number}</span>
      <span className="h-px flex-1 bg-white/[0.12]" />
      <span className="label-nav shrink-0 text-muted">{title}</span>
    </div>
  );
}
