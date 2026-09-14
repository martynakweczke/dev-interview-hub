import { PageShell } from "@/components/shell/page-shell"

export default function HomePage() {
  return (
    <PageShell ambient="home">
      <main
        id="main"
        className="flex-1 px-gutter-compact py-6 sm:px-gutter sm:py-16"
      >
        <h1 className="font-display text-section font-semibold text-ink-heading-alt">
          Pick a topic
        </h1>
      </main>
    </PageShell>
  )
}
