import { useEffect, useRef, useState } from "react";
import { ChevronDown, PlayCircle } from "lucide-react";

export const DEMO_SCENARIOS = [
  "Flood Neighborhood",
  "Heat Wave Senior Community",
  "Wildfire Evacuation",
  "Hurricane Coastal Town",
  "Earthquake School Campus",
] as const;

export type DemoScenario = (typeof DEMO_SCENARIOS)[number];

interface Props {
  onSelect: (scenario: DemoScenario) => void;
  label?: string;
}

export function DemoScenarioDropdown({ onSelect, label = "Load Demo Scenario" }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-transform hover:brightness-110 active:scale-[0.98]"
      >
        <PlayCircle className="h-4 w-4" aria-hidden="true" />
        {label}
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-xl"
        >
          {DEMO_SCENARIOS.map((s) => (
            <button
              key={s}
              role="menuitem"
              type="button"
              onClick={() => {
                onSelect(s);
                setOpen(false);
              }}
              className="block w-full px-4 py-3 text-left text-sm hover:bg-muted/40"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
