# Server-side data for the first paint

Pages used to render an empty shell and fetch after hydration, which costs a
full round trip before anything appears. The pattern below moves that fetch to
the server. It has been applied to the lists and details noted at the bottom;
anything not listed still uses the client fetch.

## The four steps

1. **Add the query** to a module here, mirroring the API route it replaces —
   same `where`, same `with`, same order and limit. The API route stays the
   source for filtering, paging and mutations; this module only serves the
   first paint, so a small duplication is intentional and should stay close to
   the route it copies.
2. **Give the page a server component** that calls `getServerContext()` from
   `lib/server/context` and the query above, then passes the result down.
3. **Turn the old page into the client component.** Move the file to
   `<name>-client.tsx`, add the props, seed the state with them, and set the
   initial `loading` to `false`.
4. **Skip the first fetch.** Guard the mount effect with a `useRef(true)` so
   it runs for later filter and pagination changes but not on hydration, and
   only when nothing has been filtered yet. Without this the page fetches
   immediately and the server render bought nothing.

## Two traps that cost time

- **Dates.** Drizzle returns `Date` objects; the client interfaces are typed
  against JSON strings. Pass values through `toClient<T>()` from
  `./serialize`, or the types will not line up.
- **Types.** Export the interfaces the props use (`export interface Expense`)
  so the server file can import them. A `"use client"` module is a fine place
  to import types from.

## Converted so far

- `projects` list, `projects/[id]` layout (covers all five project tabs)
- `purchases/expenses` list and `purchases/expenses/[id]` detail
- `sales` (invoices) list and `sales/[id]` detail
- `contacts` list
- `accounting` manual entries list and the chart of accounts
- `documents` library
- `payroll` landing screen (employees + runs)
- `crm` board (pipelines, first page of the default pipeline, summary)

## Not converted, and why

- `dashboard` home issues eight parallel report calls; it needs a single
  server-side aggregation before it is worth moving.
- The `reports/*` pages wrap bespoke report routes. Moving them means
  extracting each route's shaping into a shared function first, otherwise the
  computation is duplicated in two places.
- Everything else is mechanical: follow the four steps above.
