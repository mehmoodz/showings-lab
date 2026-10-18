# Interview problems

The starter lists every showing in the local database. These problems are not built yet. Work one at a time, in this repo.

The showing primitive is in `src/lib/primitives.ts`. The list query is in `src/lib/db.ts`. UI primitives already in the project are Table, Badge, and Button from shadcn/ui.

## 1. Filter by status

Add a control above the table that filters by `ShowingStatus`. Include a way to show every showing again.

- The choice is stored in the URL, so a refresh keeps it.
- The table still has no pagination.
- An empty filter result says that nothing matched, and the database file is left as it is.

## 2. Schedule a showing

Add a way to create a showing with the same fields as the `Showing` primitive.

- Invalid input is rejected with a message on the page.
- A valid showing is inserted into `data/showings.db` and shows up in time order.
- Stopping and starting the dev server does not lose it.

## 3. Keep an agent free

When a showing is created, reject it if that agent already has an overlapping visit.

- Overlap uses `scheduledAt` and `durationMinutes`.
- Cancelled and no-show visits do not count as busy.
- Scheduled, confirmed, and completed visits do.
- The page explains the conflict. The row is not inserted.
