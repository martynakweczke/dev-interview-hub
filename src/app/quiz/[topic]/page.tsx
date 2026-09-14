import type { Metadata } from "next"

import { PageShell } from "@/components/shell/page-shell"

export const metadata: Metadata = {
  title: "Quiz",
}

export default function QuizPage() {
  return (
    <PageShell ambient="quiz" showThemeToggle={false}>
      <main
        id="main"
        className="flex-1 px-gutter-compact py-6 sm:px-gutter sm:py-12"
      >
        <h1 className="font-display text-section font-semibold text-ink-heading-alt">
          Quiz
        </h1>
      </main>
    </PageShell>
  )
}
