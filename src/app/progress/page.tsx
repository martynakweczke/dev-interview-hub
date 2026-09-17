import type { Metadata } from "next"

import { ProgressView } from "@/components/progress/progress-view"
import { PageShell } from "@/components/shell/page-shell"

export const metadata: Metadata = {
  title: "Your progress",
}

export default function ProgressPage() {
  return (
    <PageShell ambient="home">
      <main id="main" className="page-enter flex flex-1 flex-col">
        <ProgressView />
      </main>
    </PageShell>
  )
}
