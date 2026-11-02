# Showings Lab

EasyOnes lab for a fullstack TypeScript interview. The app is Next.js and shadcn/ui. Showings live in a SQLite file on disk. There is no database server, no Docker, and no account to create.

## Setup

Install [Node.js 22.13 or newer](https://nodejs.org). The commands are the same on macOS, Windows, and Linux:

```bash
npm run setup
npm run dev
```

Open [http://127.0.0.1:3847](http://127.0.0.1:3847).

`npm run setup` checks your Node.js version, downloads dependencies, and creates `data/showings.db` with sample showings, printing each step. Plain `npm install` does the same without the step-by-step output. You should see one table of 12 showings. The list is not paginated.

If port 3847 is already in use:

```bash
npm run dev -- --port 4000
```

## Reset the sample data

Stop the dev server first. On Windows the database file stays locked while the server is running.

```bash
npm run db:reset
```

That deletes the local file and loads the sample showings again. Rows you added are removed.

## Project map

- `src/app/page.tsx` — Showings Lab page
- `src/components/showings-panel.tsx` — the table
- `src/lib/primitives.ts` — `Showing` and `ShowingStatus`
- `src/lib/db.ts` — SQLite file and the list query
- `src/lib/seed.ts` — sample rows
- `src/components/ui/` — shadcn/ui primitives (`Table`, `Badge`, `Button`)
- `PROBLEMS.md` — interview problems

## Checks

```bash
npm test
```

## If install fails

The database uses SQLite built into Node.js (`node:sqlite`), so there is nothing native to compile. Check `node --version` is 22.13 or newer, and install a newer Node from [nodejs.org](https://nodejs.org) if not.
