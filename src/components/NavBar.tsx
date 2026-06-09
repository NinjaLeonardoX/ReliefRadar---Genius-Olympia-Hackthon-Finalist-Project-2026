import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Radar } from "lucide-react";
import { DemoScenarioDropdown, type DemoScenario } from "./DemoScenarioDropdown";

const links = [
  { to: "/", label: "Home" },
  { to: "/map", label: "Map" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/report", label: "Report Signal" },
  { to: "/action-plan", label: "Action Plan" },
  { to: "/methodology", label: "Methodology" },
  { to: "/ai-disclosure", label: "AI Disclosure" },
] as const;

interface NavBarProps {
  activeScenario: string | null;
  onSelectScenario: (s: DemoScenario) => void;
}

export function NavBar({ activeScenario, onSelectScenario }: NavBarProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Radar className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg tracking-tight">Relief Radar</span>
        </Link>

        <nav className="ml-6 hidden flex-1 items-center gap-1 lg:flex" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-lg px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-surface hover:text-foreground"
              activeProps={{ className: "rounded-lg px-3 py-2 text-sm bg-surface text-foreground font-medium" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-3 lg:flex">
          {activeScenario && (
            <span className="rounded-full bg-surface px-3 py-1 text-xs text-foreground/90">
              Active scenario: <span className="font-medium text-primary">{activeScenario}</span>
            </span>
          )}
          <DemoScenarioDropdown onSelect={onSelectScenario} />
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-lg bg-surface text-foreground lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3" aria-label="Mobile">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base text-foreground/90 hover:bg-surface"
                activeProps={{ className: "rounded-lg px-3 py-3 text-base bg-surface text-foreground font-medium" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2">
              <DemoScenarioDropdown onSelect={(s) => { onSelectScenario(s); setOpen(false); }} />
            </div>
            {activeScenario && (
              <span className="mt-2 text-xs text-foreground/80">
                Active scenario: <span className="font-medium text-primary">{activeScenario}</span>
              </span>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
