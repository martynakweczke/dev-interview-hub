import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { PageShell } from "@/components/shell/page-shell"

import { TokenPanel } from "./_components/token-panel"

export const metadata: Metadata = {
  title: "Design tokens",
  robots: { index: false },
}

export default function TokensPage() {
  if (process.env.NODE_ENV === "production") notFound()

  return (
    <PageShell ambient="home">
      <main
        id="main"
        className="flex flex-1 flex-col gap-8 px-gutter-compact py-8 sm:px-gutter sm:py-12"
      >
        <div className="flex max-w-3xl flex-col gap-2">
          <h1 className="font-display text-section font-semibold text-ink-heading-alt">
            Design tokens
          </h1>
          <p className="text-meta text-ink-muted">
            Every primitive in every state. The first panel follows the header
            toggle; the second always renders the opposite theme. Hover and
            focus specimens are pinned with <code>data-force-state</code>.
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,46rem),1fr))] gap-8">
          <TokenPanel title="Active theme" />
          <TokenPanel title="Inverse theme" inverse />
        </div>
      </main>
    </PageShell>
  )
}
