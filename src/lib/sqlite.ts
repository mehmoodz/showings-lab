import type * as Sqlite from "node:sqlite"

export type { DatabaseSync } from "node:sqlite"

/**
 * Loads Node's built-in SQLite module. Node 22 flags it as experimental and
 * prints a warning the first time it loads; this hides only that one warning.
 */
function loadSqlite(): typeof Sqlite {
  const emitWarning = process.emitWarning
  process.emitWarning = ((warning: string | Error, ...rest: unknown[]) => {
    const message = typeof warning === "string" ? warning : warning.message
    if (message.includes("SQLite is an experimental feature")) return
    return (emitWarning as (...args: unknown[]) => void).call(
      process,
      warning,
      ...rest,
    )
  }) as typeof process.emitWarning

  try {
    return process.getBuiltinModule("node:sqlite")
  } finally {
    process.emitWarning = emitWarning
  }
}

export const { DatabaseSync: Database } = loadSqlite()
