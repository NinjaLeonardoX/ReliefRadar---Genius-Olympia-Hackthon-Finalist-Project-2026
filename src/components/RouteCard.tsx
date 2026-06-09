import { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export type RouteStatus = "open" | "congested" | "blocked";
export type RouteSource = "Official" | "Suggested" | "Estimated";

export interface RouteFactor {
  label: string;
  value: number; // 0-100
}

export interface RouteCardData {
  id: string;
  name: string;
  fromZone: string;
  shelter: string;
  status: RouteStatus;
  source: RouteSource;
  freshness: string; // "Demo" or "Live • 12:04"
  advisoryRisk: number; // 0-100
  factors: RouteFactor[];
  note: string;
}

const STATUS_META: Record<
  RouteStatus,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  open: {
    label: "Open",
    icon: CheckCircle2,
    className: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40",
  },
  congested: {
    label: "Congested",
    icon: AlertTriangle,
    className: "bg-amber-500/15 text-amber-300 border border-amber-500/40",
  },
  blocked: {
    label: "Blocked",
    icon: XCircle,
    className: "bg-red-500/15 text-red-300 border border-red-500/40",
  },
};

export function RouteCard({ route }: { route: RouteCardData }) {
  const [open, setOpen] = useState(false);
  const status = STATUS_META[route.status];
  const StatusIcon = status.icon;

  return (
    <article className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-md shadow-black/10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold">{route.name}</h3>
          <p className="mt-0.5 text-sm text-card-foreground/70">
            From {route.fromZone} → {route.shelter}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
          role="status"
          aria-label={`Status: ${status.label}`}
        >
          <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {status.label}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-md border border-border bg-surface px-2 py-0.5 text-xs font-medium text-foreground/80">
          {route.source}
        </span>
        <span className="inline-flex items-center rounded-md border border-dashed border-border px-2 py-0.5 text-xs text-foreground/70">
          {route.freshness}
        </span>
        <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          Advisory risk {route.advisoryRisk}
        </span>
      </div>

      <p className="mt-3 text-sm text-card-foreground/80">{route.note}</p>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        aria-expanded={open}
        aria-controls={`why-${route.id}`}
      >
        Why this score
        {open ? (
          <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
        )}
      </button>

      {open && (
        <div
          id={`why-${route.id}`}
          className="mt-3 space-y-2 rounded-lg border border-border bg-surface/40 p-3"
        >
          {route.factors.map((f) => (
            <div key={f.label}>
              <div className="flex items-center justify-between text-xs text-foreground/80">
                <span>{f.label}</span>
                <span className="tabular-nums">{f.value}</span>
              </div>
              <div
                className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-card-foreground/10"
                role="progressbar"
                aria-valuenow={f.value}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={f.label}
              >
                <div
                  className="h-full bg-primary"
                  style={{ width: `${f.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
