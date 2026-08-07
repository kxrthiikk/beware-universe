const socials = [
  { label: "IG", href: "#" },
  { label: "YT", href: "#" },
  { label: "VIM", href: "#" },
  { label: "FB", href: "#" },
];

export default function SideSocials() {
  return (
    <div className="absolute bottom-24 right-4 z-20 hidden flex-col items-center gap-4 sm:flex lg:right-7 lg:bottom-28">
      {socials.map((s) => (
        <a
          key={s.label}
          href={s.href}
          className="label-tiny text-[9px] tracking-[0.22em] text-white/65 transition-colors duration-300 hover:text-accent"
          style={{ writingMode: "vertical-rl" }}
          data-cursor="hover"
        >
          {s.label}
        </a>
      ))}
    </div>
  );
}
