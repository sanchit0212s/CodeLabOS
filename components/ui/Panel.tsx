import { cn } from "@/lib/cn";

interface PanelProps {
  label?: string;
  status?: string;
  bracketed?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Panel({ label, status, bracketed, className, children }: PanelProps) {
  return (
    <div className="relative">
      {label && (
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="marker">{label}</span>
          {status && (
            <span className="marker text-accent">{status}</span>
          )}
        </div>
      )}
      <div className={cn("panel rounded-sm", bracketed && "panel-bracketed", className)}>
        {children}
      </div>
    </div>
  );
}
