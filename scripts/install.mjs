// `npm run setup`: installs dependencies and creates the sample database,
// printing each step. Plain Node with no dependencies, so it runs before
// node_modules exists.
import { spawn } from "node:child_process"

const indent = "      "

function npm(args, { env = {}, captureStdout = false } = {}) {
  // npm_execpath is set when this runs through `npm run`; it avoids needing a
  // shell to find npm.cmd on Windows.
  const execPath = process.env.npm_execpath
  const [command, commandArgs, shell] = execPath
    ? [process.execPath, [execPath, ...args], false]
    : ["npm", args, process.platform === "win32"]

  return new Promise((resolve) => {
    const child = spawn(command, commandArgs, {
      env: { ...process.env, ...env },
      shell,
      stdio: ["inherit", captureStdout ? "pipe" : "inherit", "inherit"],
    })
    let stdout = ""
    child.stdout?.on("data", (chunk) => (stdout += chunk))
    child.on("close", (code) => resolve({ code, stdout }))
  })
}

function fail(message) {
  console.error(`\n${message}`)
  process.exit(1)
}

console.log("Showings Lab setup\n")

console.log("[1/3] Checking Node.js...")
const [major, minor] = process.versions.node.split(".").map(Number)
if (!(major > 22 || (major === 22 && minor >= 13))) {
  fail(
    `Showings Lab needs Node.js 22.13 or newer. You have ${process.version}.\nInstall a newer version from https://nodejs.org and run npm run setup again.`,
  )
}
console.log(`${indent}${process.version}`)

console.log("[2/3] Downloading packages. The first run can take a minute...")
const started = Date.now()
const heartbeat = setInterval(() => {
  const seconds = Math.round((Date.now() - started) / 1000)
  console.log(`${indent}still downloading (${seconds}s)`)
}, 15_000)
const install = await npm(["install", "--loglevel=error", "--no-progress"], {
  env: { SHOWINGS_SKIP_DB_SETUP: "1" },
  captureStdout: true,
})
clearInterval(heartbeat)
if (install.code !== 0) {
  process.stdout.write(install.stdout)
  fail("Downloading packages failed. The npm error above says why.")
}
const seconds = ((Date.now() - started) / 1000).toFixed(0)
const added = install.stdout.match(/(?:added|changed) \d+ packages?/)
console.log(`${indent}${added ? added[0] : "packages up to date"} in ${seconds}s`)

console.log("[3/3] Setting up the sample database...")
const db = await npm(["run", "--silent", "db:setup"], {
  env: { SHOWINGS_SETUP_STEP: "1" },
})
if (db.code !== 0) fail("Setting up the database failed. The error above says why.")

console.log("\nReady. Start the app with: npm run dev")
