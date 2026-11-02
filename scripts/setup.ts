// Creates data/showings.db with sample rows. Runs as npm's postinstall, as
// `npm run db:setup`, and as step 3 of `npm run setup` (scripts/install.mjs).

// `npm run setup` installs packages first, then runs this as its own step.
if (process.env.SHOWINGS_SKIP_DB_SETUP === "1") process.exit(0)

const [major, minor] = process.versions.node.split(".").map(Number)
if (!(major > 22 || (major === 22 && minor >= 13))) {
  console.error(
    `Showings Lab requires Node.js 22.13 or newer. Current version: ${process.version}`,
  )
  process.exit(1)
}

// Inside `npm run setup` the step header is already printed, so indent.
const prefix = process.env.SHOWINGS_SETUP_STEP ? "      " : "Showings Lab setup: "

async function main() {
  // Loaded after the version check: older Node versions have no built-in SQLite.
  const { displayDatabasePath, initDatabase } = await import("../src/lib/db")
  const { seedShowings } = await import("../src/lib/seed")

  const result = initDatabase()
  const location = displayDatabasePath(result.path)

  if (result.created) {
    console.log(
      `${prefix}created ${location} with ${seedShowings.length} sample showings`,
    )
  } else {
    console.log(`${prefix}${location} already exists, existing rows kept`)
  }

  if (!process.env.SHOWINGS_SETUP_STEP) {
    console.log(`${prefix}done. Start the app with: npm run dev`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
