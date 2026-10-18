const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const

const scheduledAtPattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/

export function formatWhen(scheduledAt: string): string {
  const match = scheduledAtPattern.exec(scheduledAt)
  if (!match) return scheduledAt

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const hour = Number(match[4])
  const minute = Number(match[5])
  const weekday = weekdays[new Date(Date.UTC(year, month - 1, day)).getUTCDay()]
  const hour12 = hour % 12 || 12
  const suffix = hour < 12 ? "AM" : "PM"
  const minutes = String(minute).padStart(2, "0")

  return `${weekday}, ${months[month - 1]} ${day} · ${hour12}:${minutes} ${suffix}`
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest} min`
  if (rest === 0) return hours === 1 ? "1 hr" : `${hours} hr`
  return `${hours} hr ${rest} min`
}

export function formatShowingCount(count: number): string {
  if (count === 0) return "No showings"
  if (count === 1) return "1 showing"
  return `${count} showings`
}
