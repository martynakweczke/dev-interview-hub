import type { Metadata } from "next"

import { PageShell } from "@/components/shell/page-shell"

export const metadata: Metadata = {
  title: "Results",
}

export default function ResultsPage() {
  return (
    <PageShell ambient="results">
      <main
        id="main"
        className="flex-1 px-gutter-compact py-6 sm:px-gutter sm:py-12"
      >
        <h1 className="font-display text-section font-semibold text-ink-heading-alt">
          Results
        </h1>
      </main>
    </PageShell>
  )
}
