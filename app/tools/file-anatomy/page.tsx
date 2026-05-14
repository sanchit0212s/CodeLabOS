"use client";

import { useMemo, useState } from "react";
import { fileAnatomyEntries, lookupFile, type FileAnatomyEntry } from "@/content/file-anatomy-data";
import { cn } from "@/lib/cn";

const EXAMPLE = `package.json
package-lock.json
node_modules/
.gitignore
.env
.env.example
README.md
tsconfig.json
next.config.mjs
tailwind.config.ts
postcss.config.mjs
Dockerfile
docker-compose.yml
prisma/
  schema.prisma
  migrations/
app/
  layout.tsx
  page.tsx
public/
.next/
.github/
  workflows/
    ci.yml`;

export default function FileAnatomyPage() {
  const [input, setInput] = useState(EXAMPLE);

  const lines = useMemo(
    () =>
      input
        .split("\n")
        .map((l) => l.trim().replace(/\/$/, ""))
        .filter(Boolean),
    [input],
  );

  const results = useMemo(
    () =>
      Array.from(new Set(lines))
        .map((name) => ({ name, entry: lookupFile(name) }))
        .filter((r) => r.entry),
    [lines],
  );

  const unmatched = useMemo(
    () => Array.from(new Set(lines)).filter((name) => !lookupFile(name)),
    [lines],
  );

  return (
    <div className="space-y-6">
      <header>
        <div className="marker mb-2">tool · file anatomy inspector</div>
        <h1 className="text-3xl font-semibold text-ink">
          Paste a project. Get the map.
        </h1>
        <p className="text-ink-dim mt-2 max-w-2xl">
          Your biggest pain point, solved. Paste a list of files (output of{" "}
          <code className="text-accent">ls</code> or{" "}
          <code className="text-accent">tree</code>, or just type filenames).
          Every recognized file is annotated: what it is, who created it,
          whether to read or edit, and what to ask your AI agent about it.
        </p>
      </header>

      <div className="grid lg:grid-cols-[400px_1fr] gap-6">
        <div className="panel rounded-sm">
          <div className="px-4 py-2 border-b border-edge marker">paste here</div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-[400px] p-4 bg-bg-inset font-mono text-[13px] text-ink resize-none focus:outline-none"
            spellCheck={false}
          />
          <div className="px-4 py-3 border-t border-edge text-[12px] text-ink-mute flex items-center justify-between">
            <span>{results.length} recognized</span>
            <span>{unmatched.length} unknown</span>
          </div>
        </div>

        <div className="space-y-3">
          {results.map(({ name, entry }) => (
            <Entry key={name} entry={entry!} matched={name} />
          ))}
          {unmatched.length > 0 && (
            <div className="panel rounded-sm p-5">
              <div className="marker mb-3">unrecognized</div>
              <p className="text-ink-dim text-[13px] mb-3">
                These files weren't in the knowledge base yet. As more lessons
                are authored, more entries are added here.
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {unmatched.map((n) => (
                  <li
                    key={n}
                    className="px-2 py-1 text-[12px] font-mono bg-bg-inset border border-edge rounded-sm text-ink-mute"
                  >
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <details className="panel rounded-sm">
        <summary className="px-5 py-3 cursor-pointer text-[13px] text-ink-dim hover:text-ink">
          ▸ Knowledge base ({fileAnatomyEntries.length} entries)
        </summary>
        <ul className="px-5 py-3 grid md:grid-cols-2 gap-1 text-[12.5px] font-mono text-ink-mute">
          {fileAnatomyEntries.map((e) => (
            <li key={e.name} className="truncate">▸ {e.name}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}

function Entry({ entry, matched }: { entry: FileAnatomyEntry; matched: string }) {
  const shouldReadTone = {
    yes: "text-signal-ok",
    sometimes: "text-signal-warn",
    rarely: "text-ink-mute",
  }[entry.shouldRead];

  const shouldEditTone = {
    yes: "text-signal-ok",
    sometimes: "text-signal-warn",
    rarely: "text-ink-mute",
    never: "text-signal-err",
  }[entry.shouldEdit];

  return (
    <div className="panel rounded-sm">
      <header className="px-5 py-3 border-b border-edge flex items-center gap-3 flex-wrap">
        <code className="font-mono text-[14px] text-accent">{matched}</code>
        <span className="text-[11px] font-mono text-ink-mute">matched: {entry.name}</span>
      </header>
      <div className="p-5 space-y-3 text-[14px]">
        <Field label="role">{entry.role}</Field>
        <Field label="created by">{entry.createdBy}</Field>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Field label="read?">
            <span className={cn("uppercase font-mono text-[12px]", shouldReadTone)}>
              {entry.shouldRead}
            </span>
          </Field>
          <Field label="edit?">
            <span className={cn("uppercase font-mono text-[12px]", shouldEditTone)}>
              {entry.shouldEdit}
            </span>
          </Field>
        </div>
        <Field label="contains">{entry.contains}</Field>

        <div className="pt-3 border-t border-edge">
          <div className="marker mb-2">what to ask your AI agent</div>
          <ul className="space-y-1.5">
            {entry.questions.map((q, i) => (
              <li key={i} className="flex gap-2 text-ink-dim">
                <span className="text-accent">▸</span>
                <span>"{q}"</span>
              </li>
            ))}
          </ul>
        </div>

        {entry.taughtIn && (
          <div className="pt-3 border-t border-edge text-[12.5px] text-ink-mute">
            <span className="marker mr-2">taught in</span>
            {entry.taughtIn}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-mono text-ink-mute uppercase tracking-widest mb-0.5">
        {label}
      </div>
      <div className="text-ink-dim">{children}</div>
    </div>
  );
}
