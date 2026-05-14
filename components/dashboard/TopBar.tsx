"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/", label: "Mission Control", code: "00" },
  { href: "/map", label: "Curriculum Map", code: "01" },
  { href: "/review", label: "Review Queue", code: "02" },
  { href: "/tools/file-anatomy", label: "File Anatomy", code: "03" },
  { href: "/tools/glossary", label: "Glossary", code: "04" },
  { href: "/tools/bestiary", label: "Anti-Patterns", code: "05" },
];

export function TopBar() {
  const pathname = usePathname();
  return (
    <header className="border-b border-edge bg-bg/80 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto max-w-[1400px] px-6 h-14 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-7 w-7 rounded-sm border border-accent/40 grid place-items-center">
            <div className="absolute inset-1 rounded-sm bg-accent/20" />
            <span className="relative text-[10px] font-mono text-accent">CL</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[13px] font-semibold tracking-wide">CodeLabOS</span>
            <span className="marker mt-0.5">mission control</span>
          </div>
        </Link>

        <nav className="ml-6 hidden md:flex items-stretch gap-1">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 h-9 flex items-center gap-2 text-[13px] rounded-sm border border-transparent transition-colors",
                  active
                    ? "text-ink bg-bg-raised border-edge"
                    : "text-ink-dim hover:text-ink hover:bg-bg-panel",
                )}
              >
                <span className="font-mono text-[10px] text-ink-mute">{item.code}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-ink-mute">
            <span className="h-1.5 w-1.5 rounded-full bg-signal-ok shadow-[0_0_8px] shadow-signal-ok/60" />
            <span className="uppercase tracking-widest">online</span>
          </div>
        </div>
      </div>
    </header>
  );
}
