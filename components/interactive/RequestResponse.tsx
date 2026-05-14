import { cn } from "@/lib/cn";

interface RequestResponseProps {
  method?: string;
  url?: string;
  reqHeaders?: Record<string, string>;
  reqBody?: string;
  status?: number;
  statusText?: string;
  resHeaders?: Record<string, string>;
  resBody?: string;
}

export function RequestResponse({
  method = "GET",
  url = "/",
  reqHeaders,
  reqBody,
  status = 200,
  statusText = "OK",
  resHeaders,
  resBody,
}: RequestResponseProps) {
  const statusTone =
    status < 300 ? "text-signal-ok"
    : status < 400 ? "text-signal-info"
    : status < 500 ? "text-signal-warn"
    : "text-signal-err";

  return (
    <div className="my-6 grid md:grid-cols-2 gap-3">
      <div className="panel rounded-sm overflow-hidden">
        <div className="px-4 py-2 border-b border-edge marker">request →</div>
        <div className="p-4 font-mono text-[12.5px] space-y-2">
          <div>
            <span className="text-accent">{method}</span>{" "}
            <span className="text-ink">{url}</span>
          </div>
          {reqHeaders && (
            <div className="text-ink-dim">
              {Object.entries(reqHeaders).map(([k, v]) => (
                <div key={k}>
                  <span className="text-signal-info">{k}</span>: {v}
                </div>
              ))}
            </div>
          )}
          {reqBody && (
            <pre className="mt-2 text-ink whitespace-pre-wrap">{reqBody}</pre>
          )}
        </div>
      </div>
      <div className="panel rounded-sm overflow-hidden">
        <div className="px-4 py-2 border-b border-edge marker">← response</div>
        <div className="p-4 font-mono text-[12.5px] space-y-2">
          <div>
            <span className={cn("font-semibold", statusTone)}>{status}</span>{" "}
            <span className="text-ink">{statusText}</span>
          </div>
          {resHeaders && (
            <div className="text-ink-dim">
              {Object.entries(resHeaders).map(([k, v]) => (
                <div key={k}>
                  <span className="text-signal-info">{k}</span>: {v}
                </div>
              ))}
            </div>
          )}
          {resBody && (
            <pre className="mt-2 text-ink whitespace-pre-wrap">{resBody}</pre>
          )}
        </div>
      </div>
    </div>
  );
}
