import { displayDatabasePath, initDatabase } from "../src/lib/db"
import { seedShowings } from "../src/lib/seed"

const [major, minor] = process.versions.node.split(".").map(Number)
if (!(major > 22 || (major === 22 && minor >= 13))) {
  console.error(
    `Showings Lab requires Node.js 22.13 or newer. Current version: ${process.version}`,
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
