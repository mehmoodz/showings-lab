import {
  displayDatabasePath,
  initDatabase,
  removeDatabaseFiles,
  resolveDatabasePath,
} from "../src/lib/db"
import { seedShowings } from "../src/lib/seed"

const dbPath = resolveDatabasePath()
removeDatabaseFiles(dbPath)
initDatabase(dbPath)

console.log(
  `Loaded ${seedShowings.length} sample showings into ${displayDatabasePath(dbPath)}.`,
)
