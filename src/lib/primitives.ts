/**
 * Domain primitives for Showings Lab.
 * A showing is one scheduled visit to a property with one client and one agent.
 */

export const showingStatuses = [
  "scheduled",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
] as const

export type ShowingStatus = (typeof showingStatuses)[number]

export type Showing = {
  id: string
  propertyAddress: string
  city: string
  clientName: string
  agentName: string
  /**
   * Wall-clock time as `YYYY-MM-DDTHH:mm:ss`, with no timezone suffix.
   * Every machine displays this same clock time.
   */
  scheduledAt: string
  durationMinutes: number
  status: ShowingStatus
}

export const showingStatusLabels: Record<ShowingStatus, string> = {
  scheduled: "Scheduled",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No-show",
}

export function isShowingStatus(value: string): value is ShowingStatus {
  return (showingStatuses as readonly string[]).includes(value)
}
