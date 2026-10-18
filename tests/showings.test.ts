import assert from "node:assert/strict"
import { mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { after, describe, it } from "node:test"
import { closeDatabase, initDatabase, listShowings } from "../src/lib/db"
import {
  formatDuration,
  formatShowingCount,
  formatWhen,
} from "../src/lib/format"
import type { Showing } from "../src/lib/primitives"
import { seedShowings, validateSeedShowings } from "../src/lib/seed"

const directory = mkdtempSync(path.join(tmpdir(), "showings-lab-"))
process.env.SHOWINGS_DB_PATH = path.join(directory, "showings.db")

after(() => {
  closeDatabase()
  rmSync(directory, { recursive: true, force: true })
})

describe("showings database", () => {
  it("loads each sample showing once", () => {
    initDatabase()
    const first = listShowings()
    initDatabase()
    const second = listShowings()

    assert.equal(first.length, seedShowings.length)
    assert.deepEqual(
      second.map((showing) => showing.id),
      first.map((showing) => showing.id),
    )
    assert.deepEqual(
      first.map((showing) => showing.id),
      seedShowings.map((showing) => showing.id),
    )
  })

  it("returns every showing in time order", () => {
    const showings = listShowings()
    const times = showings.map((showing) => showing.scheduledAt)
    const sorted = [...times].sort((left, right) => left.localeCompare(right))

    assert.deepEqual(times, sorted)
    assert.equal(showings.length, seedShowings.length)
    assert.ok(showings.some((showing) => showing.status === "scheduled"))
    assert.ok(showings.some((showing) => showing.status === "confirmed"))
    assert.ok(showings.some((showing) => showing.status === "completed"))
    assert.ok(showings.some((showing) => showing.status === "cancelled"))
    assert.ok(showings.some((showing) => showing.status === "no_show"))
  })
})

describe("seed", () => {
  it("rejects a showing with an unknown status", () => {
    const invalid = {
      ...seedShowings[0],
      status: "pending",
    } as unknown as Showing

    assert.throws(() => validateSeedShowings([invalid]), /unknown status/)
  })
})

describe("formatting", () => {
  it("formats wall-clock times without shifting the hour", () => {
    assert.equal(formatWhen("2026-10-19T09:00:00"), "Mon, Oct 19 · 9:00 AM")
    assert.equal(formatWhen("2026-10-19T16:00:00"), "Mon, Oct 19 · 4:00 PM")
    assert.equal(formatWhen("2026-10-16T15:00:00"), "Fri, Oct 16 · 3:00 PM")
  })

  it("formats duration and counts", () => {
    assert.equal(formatDuration(30), "30 min")
    assert.equal(formatDuration(60), "1 hr")
    assert.equal(formatDuration(90), "1 hr 30 min")
    assert.equal(formatShowingCount(0), "No showings")
    assert.equal(formatShowingCount(1), "1 showing")
    assert.equal(formatShowingCount(12), "12 showings")
  })
})
