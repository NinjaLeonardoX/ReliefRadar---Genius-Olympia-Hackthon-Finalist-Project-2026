import { useState } from "react";

const STATUSES = ["Open", "Congested", "Blocked"] as const;
const SOURCES = ["Official", "Suggested", "Estimated"] as const;

export function RouteFilters() {
  const [status, setStatus] = useState<string[]>([]);
  const [source, setSource] = useState<string[]>([]);

  const toggle = (
    value: string,
    arr: string[],
    set: (v: string[]) => void,
  ) => {
    set(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  const reset = () => {
    setStatus([]);
    setSource([]);
  };

  const chipBase =
    "rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

  return (
    <div className="rounded-2xl border border-border bg-card p-4 text-card-foreground">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-card-foreground/60">
            Status
          </span>
          {STATUSES.map((s) => {
            const active = status.includes(s);
            return (
              <button
                key={s}
                type="button"
                aria-pressed={active}
                onClick={() => toggle(s, status, setStatus)}
                className={`${chipBase} ${active ? "border-primary bg-primary/15 text-primary" : "border-border bg-surface text-foreground/80 hover:bg-surface/80"}`}
              >
                {s}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-card-foreground/60">
            Source
          </span>
          {SOURCES.map((s) => {
            const active = source.includes(s);
            return (
              <button
                key={s}
                type="button"
                aria-pressed={active}
                onClick={() => toggle(s, source, setSource)}
                className={`${chipBase} ${active ? "border-primary bg-primary/15 text-primary" : "border-border bg-surface text-foreground/80 hover:bg-surface/80"}`}
              >
                {s}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={reset}
          className="ml-auto text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
