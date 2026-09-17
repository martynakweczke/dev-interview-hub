import type { Metadata } from "next"

import { ProgressView } from "@/features/progress/components/progress-view/progress-view"
import { PageShell } from "@/features/shell/components/page-shell/page-shell"

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
