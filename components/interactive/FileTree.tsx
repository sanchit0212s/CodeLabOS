"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export interface FileNode {
  name: string;
  /** Hover annotation: what is this file? */
  role?: string;
  /** Optional longer note shown when expanded */
  note?: string;
  /** "config" | "code" | "build" | "doc" | "data" | "secret" | "ignore" */
  kind?: "dir" | "config" | "code" | "build" | "doc" | "data" | "secret" | "ignore" | "asset";
  children?: FileNode[];
}

const kindColor: Record<NonNullable<FileNode["kind"]>, string> = {
  dir: "text-signal-info",
  config: "text-signal-warn",
  code: "text-accent",
  build: "text-ink-mute",
  doc: "text-ink",
  data: "text-signal-phase",
  secret: "text-signal-err",
  ignore: "text-ink-faint line-through",
  asset: "text-ink-dim",
};

const kindIcon: Record<NonNullable<FileNode["kind"]>, string> = {
  dir: "▸",
  config: "⚙",
  code: "◆",
  build: "■",
  doc: "✎",
  data: "◇",
  secret: "✱",
  ignore: "·",
  asset: "○",
};

interface FileTreeProps {
  root: FileNode;
  /** Pre-expand all directories */
  expandAll?: boolean;
  caption?: string;
}

export function FileTree({ root, expandAll = true, caption }: FileTreeProps) {
  return (
    <div className="panel rounded-sm">
      {caption && (
        <div className="px-4 py-2 border-b border-edge text-[12px] font-mono text-ink-mute">
          {caption}
        </div>
      )}
      <div className="p-3 font-mono text-[13px]">
        <Node node={root} depth={0} initiallyOpen={expandAll} />
      </div>
    </div>
  );
}

function Node({
  node,
  depth,
  initiallyOpen,
}: {
  node: FileNode;
  depth: number;
  initiallyOpen: boolean;
}) {
  const hasChildren = !!node.children && node.children.length > 0;
  const [open, setOpen] = useState(initiallyOpen);
  const kind = node.kind ?? (hasChildren ? "dir" : "code");
  const icon = hasChildren ? (open ? "▾" : "▸") : kindIcon[kind] ?? "·";

  return (
    <div>
      <div
        className={cn(
          "group flex items-start gap-2 py-1 px-2 rounded-sm hover:bg-bg-raised cursor-default",
          hasChildren && "cursor-pointer",
        )}
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
        onClick={() => hasChildren && setOpen(!open)}
      >
        <span className={cn("w-3 text-[11px]", kindColor[kind])}>{icon}</span>
        <span className={cn("min-w-0", kindColor[kind])}>{node.name}</span>
        {node.role && (
          <span className="ml-3 text-[12px] text-ink-mute italic group-hover:text-ink-dim">
            {node.role}
          </span>
        )}
      </div>
      {hasChildren && open && (
        <div>
          {node.children!.map((child, i) => (
            <Node key={i} node={child} depth={depth + 1} initiallyOpen={initiallyOpen} />
          ))}
        </div>
      )}
    </div>
  );
}
