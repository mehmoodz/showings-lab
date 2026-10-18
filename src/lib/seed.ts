import { isShowingStatus, type Showing } from "./primitives"

const scheduledAtPattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/

export const seedShowings: Showing[] = [
  {
    id: "shw_1001",
    propertyAddress: "1840 N Dayton St",
    city: "Chicago",
    clientName: "Elena Voss",
    agentName: "Maya Chen",
    scheduledAt: "2026-10-16T15:00:00",
    durationMinutes: 30,
    status: "completed",
  },
  {
    id: "shw_1002",
    propertyAddress: "910 W Webster Ave",
    city: "Chicago",
    clientName: "Jonah Brooks",
    agentName: "Luis Ortega",
    scheduledAt: "2026-10-17T11:30:00",
    durationMinutes: 45,
    status: "no_show",
  },
  {
    id: "shw_1003",
    propertyAddress: "48 E Cedar St",
    city: "Chicago",
    clientName: "Nora Patel",
    agentName: "Maya Chen",
    scheduledAt: "2026-10-18T13:00:00",
    durationMinutes: 30,
    status: "cancelled",
  },
  {
    id: "shw_1004",
    propertyAddress: "2154 N Seminary Ave",
    city: "Chicago",
    clientName: "Amelia Grant",
    agentName: "Priya Shah",
    scheduledAt: "2026-10-19T09:00:00",
    durationMinutes: 30,
    status: "confirmed",
  },
  {
    id: "shw_1005",
    propertyAddress: "2711 N Kimball Ave",
    city: "Chicago",
    clientName: "Chris Adelman",
    agentName: "Luis Ortega",
    scheduledAt: "2026-10-19T10:30:00",
    durationMinutes: 60,
    status: "scheduled",
  },
  {
    id: "shw_1006",
    propertyAddress: "1420 E 56th St",
    city: "Chicago",
    clientName: "Helen Cho",
    agentName: "Priya Shah",
    scheduledAt: "2026-10-19T16:00:00",
    durationMinutes: 45,
    status: "confirmed",
  },
  {
    id: "shw_1007",
    propertyAddress: "815 Forest Ave",
    city: "Evanston",
    clientName: "Marcus Hale",
    agentName: "Maya Chen",
    scheduledAt: "2026-10-20T09:30:00",
    durationMinutes: 30,
    status: "scheduled",
  },
  {
    id: "shw_1008",
    propertyAddress: "221 S Euclid Ave",
    city: "Oak Park",
    clientName: "Sofia Marin",
    agentName: "Luis Ortega",
    scheduledAt: "2026-10-20T13:00:00",
    durationMinutes: 45,
    status: "confirmed",
  },
  {
    id: "shw_1009",
    propertyAddress: "3642 N Southport Ave",
    city: "Chicago",
    clientName: "Daniel Ike",
    agentName: "Maya Chen",
    scheduledAt: "2026-10-21T11:00:00",
    durationMinutes: 30,
    status: "scheduled",
  },
  {
    id: "shw_1010",
    propertyAddress: "1555 W Division St",
    city: "Chicago",
    clientName: "Ruth Keller",
    agentName: "Priya Shah",
    scheduledAt: "2026-10-21T15:30:00",
    durationMinutes: 30,
    status: "scheduled",
  },
  {
    id: "shw_1011",
    propertyAddress: "4200 N Marine Dr",
    city: "Chicago",
    clientName: "Owen Blake",
    agentName: "Luis Ortega",
    scheduledAt: "2026-10-22T10:00:00",
    durationMinutes: 60,
    status: "confirmed",
  },
  {
    id: "shw_1012",
    propertyAddress: "918 Clinton Pl",
    city: "Evanston",
    clientName: "Lila Nguyen",
    agentName: "Maya Chen",
    scheduledAt: "2026-10-23T14:00:00",
    durationMinutes: 45,
    status: "scheduled",
  },
]

export function validateSeedShowings(rows: readonly Showing[]) {
  const ids = new Set<string>()

  for (const row of rows) {
    if (!row.id.trim() || ids.has(row.id)) {
      throw new Error(`Showing id "${row.id}" is missing or duplicated`)
    }
    ids.add(row.id)

    for (const field of [
      "propertyAddress",
      "city",
      "clientName",
      "agentName",
    ] as const) {
      if (!row[field].trim()) {
        throw new Error(`Showing ${row.id} is missing ${field}`)
      }
    }

    if (!isScheduledAt(row.scheduledAt)) {
      throw new Error(
        `Showing ${row.id} needs scheduledAt as YYYY-MM-DDTHH:mm:ss`,
      )
    }

    if (!Number.isInteger(row.durationMinutes) || row.durationMinutes <= 0) {
      throw new Error(`Showing ${row.id} needs a duration in whole minutes`)
    }

    if (!isShowingStatus(row.status)) {
      throw new Error(`Showing ${row.id} has an unknown status`)
    }
  }
}

function isScheduledAt(value: string): boolean {
  const match = scheduledAtPattern.exec(value)
  if (!match) return false

  const month = Number(match[2])
  const day = Number(match[3])
  const hour = Number(match[4])
  const minute = Number(match[5])
  const second = Number(match[6])

  return (
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= 31 &&
    hour <= 23 &&
    minute <= 59 &&
    second <= 59
  )
}
