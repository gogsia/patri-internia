'use client';

export default function Logo() {
  return (
    <div className="absolute left-1/2 top-3 z-30 -translate-x-1/2 select-none">
      <a
        href="/"
        className="group flex items-center gap-2 rounded-xl border border-[#355139] bg-black/50 px-4 py-2 backdrop-blur-sm transition hover:bg-black/60"
      >
        {/* Stylised "I" icon */}
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7ddf64] to-[#3a8a2a] text-lg font-black leading-none text-[#0f1713] shadow-md">
          I
        </span>
        <span className="text-lg font-bold tracking-wide text-zinc-100 group-hover:text-[#a8ef8b]">
          nteria
        </span>
      </a>
    </div>
  );
}
