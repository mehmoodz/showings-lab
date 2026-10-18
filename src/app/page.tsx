import { Suspense } from "react"
import {
  ShowingsPanel,
  ShowingsPanelFallback,
} from "@/components/showings-panel"

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="h-1 bg-primary" />
      <header className="border-b">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
            EasyOnes
          </p>
          <h1 className="mt-3 font-heading text-4xl font-medium tracking-tight text-balance sm:text-5xl">
            Showings Lab
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
            Property showings for the office. The list is the whole database,
            with no pages to click through.
          </p>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <Suspense fallback={<ShowingsPanelFallback />}>
          <ShowingsPanel />
        </Suspense>
      </main>
    </div>
  )
}
