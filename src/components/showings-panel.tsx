import type { ReactNode } from "react"
import { connection } from "next/server"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { displayDatabasePath, listShowings } from "@/lib/db"
import { formatDuration, formatShowingCount, formatWhen } from "@/lib/format"
import { showingStatusLabels, type Showing, type ShowingStatus } from "@/lib/primitives"

const columns = ["When", "Property", "Client", "Agent", "Length", "Status"]

export async function ShowingsPanel() {
  await connection()
  const result = readShowings()

  if (!result.ok) {
    return (
      <section
        role="alert"
        className="rounded-xl border border-destructive/30 bg-card px-4 py-10 text-center"
      >
        <h2 className="font-heading text-2xl font-medium">
          The showings database could not be read
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">{result.message}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Stop the dev server and run npm run db:reset, then start it again.
        </p>
      </section>
    )
  }

  const { showings, databasePath } = result

  return (
    <ShowingsShell
      title={formatShowingCount(showings.length)}
      note={
        showings.length === 0
          ? `Nothing is stored in ${databasePath}. Stop the dev server and run npm run db:reset to reload the sample showings.`
          : `Local file ${databasePath}. Times are clock values, so they match on every computer.`
      }
    >
      <ShowingsTable showings={showings} />
    </ShowingsShell>
  )
}

function readShowings():
  | { ok: true; showings: Showing[]; databasePath: string }
  | { ok: false; message: string } {
  try {
    return {
      ok: true,
      showings: listShowings(),
      databasePath: displayDatabasePath(),
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown database error",
    }
  }
}

export function ShowingsPanelFallback() {
  return (
    <ShowingsShell title="Loading showings" busy>
      <Table className="min-w-[760px]">
        <ShowingsHeader />
        <TableBody>
          {Array.from({ length: 6 }, (_, row) => (
            <TableRow key={row}>
              {columns.map((column) => (
                <TableCell key={column} className="px-3 py-3 first:pl-4 last:pr-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ShowingsShell>
  )
}

function ShowingsShell({
  title,
  note,
  busy = false,
  children,
}: {
  title: string
  note?: string
  busy?: boolean
  children: ReactNode
}) {
  return (
    <section
      className="rounded-xl border bg-card"
      aria-label="Showings"
      aria-busy={busy || undefined}
    >
      <div className="flex items-baseline justify-between gap-3 border-b px-4 py-3">
        <h2 className="text-sm font-medium">{title}</h2>
        <p className="text-xs text-muted-foreground">Sorted by time</p>
      </div>
      {children}
      {note ? (
        <p className="border-t px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          {note}
        </p>
      ) : null}
    </section>
  )
}

function ShowingsTable({ showings }: { showings: Showing[] }) {
  return (
    <Table className="min-w-[760px]">
      <ShowingsHeader />
      <TableBody>
        {showings.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-24 px-4 text-center text-muted-foreground"
            >
              No showings yet.
            </TableCell>
          </TableRow>
        ) : (
          showings.map((showing) => (
            <TableRow key={showing.id}>
              <TableCell className="px-3 py-3 pl-4 font-medium tabular-nums">
                {formatWhen(showing.scheduledAt)}
              </TableCell>
              <TableCell className="px-3 py-3">
                <div className="font-medium">{showing.propertyAddress}</div>
                <div className="text-muted-foreground">{showing.city}</div>
              </TableCell>
              <TableCell className="px-3 py-3">{showing.clientName}</TableCell>
              <TableCell className="px-3 py-3">{showing.agentName}</TableCell>
              <TableCell className="px-3 py-3 tabular-nums">
                {formatDuration(showing.durationMinutes)}
              </TableCell>
              <TableCell className="px-3 py-3 pr-4">
                <ShowingStatusBadge status={showing.status} />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

function ShowingsHeader() {
  return (
    <TableHeader>
      <TableRow>
        {columns.map((column) => (
          <TableHead
            key={column}
            scope="col"
            className="h-11 px-3 text-xs font-medium tracking-wide text-muted-foreground uppercase first:pl-4 last:pr-4"
          >
            {column}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  )
}

function ShowingStatusBadge({ status }: { status: ShowingStatus }) {
  const variant =
    status === "confirmed"
      ? "default"
      : status === "completed"
        ? "secondary"
        : status === "no_show"
          ? "destructive"
          : "outline"

  return (
    <Badge
      variant={variant}
      className={status === "cancelled" ? "text-muted-foreground" : undefined}
    >
      {showingStatusLabels[status]}
    </Badge>
  )
}
