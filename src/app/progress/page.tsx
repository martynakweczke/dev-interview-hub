import type { Metadata } from "next"

import { PageShell } from "@/components/shell/page-shell"

export const metadata: Metadata = {
  title: "Progress",
}

export default function ProgressPage() {
  return (
    <PageShell ambient="home">
      <main
        id="main"
        className="flex-1 px-gutter-compact py-6 sm:px-gutter sm:py-16"
      >
        <h1 className="font-display text-section font-semibold text-ink-heading-alt">
          Progress
        </h1>
      </main>
    </PageShell>
  )
}
