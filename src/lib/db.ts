import fs from "node:fs"
import path from "node:path"
import Database from "better-sqlite3"
import { isShowingStatus, type Showing } from "./primitives"
import { seedShowings, validateSeedShowings } from "./seed"

const schema = `
CREATE TABLE IF NOT EXISTS showings (
  id TEXT PRIMARY KEY,
  property_address TEXT NOT NULL,
  city TEXT NOT NULL,
  client_name TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  scheduled_at TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  status TEXT NOT NULL CHECK (
    status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')
  )
);

CREATE INDEX IF NOT EXISTS showings_scheduled_at_idx
  ON showings (scheduled_at, id);
`

type CachedDatabase = {
  path: string
  db: Database.Database
}

const globalForDb = globalThis as typeof globalThis & {
  showingsDb?: CachedDatabase
}

export function resolveDatabasePath(): string {
  if (process.env.SHOWINGS_DB_PATH) {
    return path.resolve(process.env.SHOWINGS_DB_PATH)
  }

  return path.join(process.cwd(), "data", "showings.db")
}

export function displayDatabasePath(dbPath = resolveDatabasePath()): string {
  const relative = path.relative(process.cwd(), dbPath)
  const outsideProject =
    relative === "" || relative.startsWith("..") || path.isAbsolute(relative)

  if (outsideProject) return dbPath
  return relative.split(path.sep).join("/")
}

export function initDatabase(dbPath = resolveDatabasePath()): {
  path: string
  created: boolean
} {
  const created = !fs.existsSync(/*turbopackIgnore: true*/ dbPath)
  const db = openDatabase(dbPath)
  db.close()
  return { path: dbPath, created }
}

export function removeDatabaseFiles(dbPath = resolveDatabasePath()) {
  closeDatabase()
  for (const suffix of ["", "-wal", "-shm"]) {
    fs.rmSync(/*turbopackIgnore: true*/ `${dbPath}${suffix}`, { force: true })
  }
}

export function closeDatabase() {
  globalForDb.showingsDb?.db.close()
  globalForDb.showingsDb = undefined
}

export function listShowings(): Showing[] {
  // Every showing, in clock order. This list is not paginated.
  const rows = getDatabase()
    .prepare(
      `SELECT
         id,
         property_address AS propertyAddress,
         city,
         client_name AS clientName,
         agent_name AS agentName,
         scheduled_at AS scheduledAt,
         duration_minutes AS durationMinutes,
         status
       FROM showings
       ORDER BY scheduled_at ASC, id ASC`,
    )
    .all() as Showing[]

  return rows.map(toShowing)
}

function getDatabase(): Database.Database {
  const dbPath = resolveDatabasePath()
  if (globalForDb.showingsDb?.path === dbPath) return globalForDb.showingsDb.db

  globalForDb.showingsDb?.db.close()
  const db = openDatabase(dbPath)
  globalForDb.showingsDb = { path: dbPath, db }
  return db
}

function openDatabase(dbPath: string): Database.Database {
  // turbopackIgnore keeps Next from tracing the whole repo for this local file.
  fs.mkdirSync(/*turbopackIgnore: true*/ path.dirname(dbPath), {
    recursive: true,
  })
  const db = new Database(dbPath)
  db.pragma("busy_timeout = 5000")
  db.pragma("foreign_keys = ON")
  db.exec(schema)
  seedIfEmpty(db)
  return db
}

function seedIfEmpty(db: Database.Database) {
  validateSeedShowings(seedShowings)

  const count = db.prepare("SELECT COUNT(*) AS count FROM showings").get() as {
    count: number
  }
  if (count.count > 0) return

  const insert = db.prepare(
    `INSERT INTO showings (
       id,
       property_address,
       city,
       client_name,
       agent_name,
       scheduled_at,
       duration_minutes,
       status
     ) VALUES (
       @id,
       @propertyAddress,
       @city,
       @clientName,
       @agentName,
       @scheduledAt,
       @durationMinutes,
       @status
     )`,
  )

  const insertAll = db.transaction((rows: readonly Showing[]) => {
    for (const row of rows) insert.run(row)
  })

  insertAll(seedShowings)
}

function toShowing(row: Showing): Showing {
  if (!isShowingStatus(row.status)) {
    throw new Error(`Unknown showing status "${row.status}" on ${row.id}`)
  }

  return {
    ...row,
    durationMinutes: Number(row.durationMinutes),
    status: row.status,
  }
}
