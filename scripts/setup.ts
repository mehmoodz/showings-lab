import { displayDatabasePath, initDatabase } from "../src/lib/db"
import { seedShowings } from "../src/lib/seed"

const major = Number(process.versions.node.split(".")[0])
if (!Number.isFinite(major) || major < 22) {
  console.error(
    `Showings Lab requires Node.js 22 or newer. Current version: ${process.version}`,
  )
  process.exit(1)
}

const result = initDatabase()
const location = displayDatabasePath(result.path)

if (result.created) {
  console.log(
    `Created ${location} and loaded ${seedShowings.length} sample showings.`,
  )
} else {
  console.log(`Database already present at ${location}. Existing rows were kept.`)
}

console.log("Start the app with: npm run dev")
