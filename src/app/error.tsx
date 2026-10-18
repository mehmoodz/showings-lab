"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function ShowingsError({
  error,
  retry,
}: {
  error: unknown
  retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const message =
    error instanceof Error && error.message
      ? error.message
      : "Something unexpected happened while rendering this page."

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-16">
      <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
        EasyOnes
      </p>
      <h1 className="mt-3 font-heading text-3xl font-medium">
        Showings could not be loaded
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {message}
      </p>
      <div className="mt-6">
        <Button type="button" onClick={() => retry()}>
          Try again
        </Button>
      </div>
    </main>
  )
}
