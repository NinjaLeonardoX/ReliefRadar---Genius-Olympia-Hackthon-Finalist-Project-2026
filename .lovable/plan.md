## Problem

On `/compass/respond`, no evacuation line is drawn from the user's real location. Two bugs in `src/components/phases/RespondQuickAction.tsx` cause this:

1. It calls `useRoutes(home, routingDest)` from `src/lib/queries/routing.ts`. With the ORS flag off (the default — `VITE_LIVE_ROUTING` isn't set), `useRoutes` returns the **seed `ROUTES`** unchanged. Those polylines are hard-coded around the North Creek demo scenario, not around the user, so they would render in the wrong place.
2. To hide that, the component sets `mapRoutes = []` whenever the live user is >150 km from the nearest seed shelter (`SHELTERS`, mostly Boulder/North Creek). For any user not sitting on the demo coordinates, this branch hits and **no route line is drawn at all** — exactly what the user is seeing.

The Prepare flow already solves this with `useEvacuationRoutes` (`src/lib/queries/evacuation.ts`): it synthesizes safe destinations around the real origin, routes via ORS when a key is present, and falls back to honest straight-line geometry otherwise — so a line always renders.

## Fix

Make Respond use the same location-aware engine instead of the seed-bound `useRoutes`.

In `src/components/phases/RespondQuickAction.tsx`:

- Replace the `useRoutes` / `nearestShelter` / `destReachable` / `routingDest` block with:
  - `const { routes, destinations, source: routeSource } = useEvacuationRoutes(home, "flood", true);`
- Pass `routes` directly to `<MapPanel routes={routes} ... />` (drop the `mapRoutes = []` gating).
- Build the `destinations` prop for the map from the engine's `destinations` (id/name/lat/lng) instead of `destShelter`.
- Remove the "No seed shelter within range" empty-state message; it no longer applies.
- Remove now-unused imports (`useRoutes`, `resolveDestinationShelter`, `SHELTERS`, `Shelter`, `useMemo`, `distanceKm`).

Behavior after the change:
- Live location → engine generates higher-ground / inland destinations near the user and returns a `RouteOption[]` with real geometry (ORS) or straight-line fallback. A line renders every time.
- No live location yet (seed Rivera household) → same engine still produces routes around the seed origin, so the demo keeps working.
- Earthquake disaster would suppress routes (shelter-in-place), but Respond is hard-coded to `"Flood"`, so routes always render here.

## Out of scope

- No changes to scoring, the map component, or the routing server function.
- No new env vars; ORS stays optional. Without `ORS_API_KEY`, the fallback straight-line is intentional and already labeled in the engine's `source: "estimated"`.

## Files to edit

- `src/components/phases/RespondQuickAction.tsx`
