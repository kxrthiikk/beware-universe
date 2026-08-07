export default function ScrollIndicator() {
  return (
    <div className="absolute right-4 top-[42%] z-20 hidden flex-col items-center gap-3 sm:flex lg:right-7">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={
            i === 0
              ? "h-[7px] w-[7px] rounded-full bg-accent"
              : "h-[5px] w-[5px] rounded-full border border-white/40"
          }
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
