interface WhereYoullSeeThisProps {
  items: { file?: string; context: string }[];
}

/**
 * "Here is where this concept appears when an AI agent builds your project."
 * One of the design-standard non-negotiables: every concept ships with this.
 */
export function WhereYoullSeeThis({ items }: WhereYoullSeeThisProps) {
  return (
    <div className="my-6">
      <div className="marker mb-2 px-1">where you'll see this</div>
      <div className="panel rounded-sm">
        <ul className="divide-y divide-edge">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 px-4 py-3">
              <span className="text-accent shrink-0 mt-0.5">▸</span>
              <div className="flex-1">
                {item.file && (
                  <code className="text-[12.5px] text-accent bg-bg-inset border border-edge rounded-sm px-1.5 py-0.5 mr-2">
                    {item.file}
                  </code>
                )}
                <span className="text-[14px] text-ink-dim">{item.context}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
