import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ResultsView } from "@/components/results/results-view"
import { PageShell } from "@/components/shell/page-shell"
import { getTopic, isTopicId } from "@/lib/questions"

export async function generateMetadata({
  params,
}: PageProps<"/quiz/[topic]/results">): Promise<Metadata> {
  const { topic } = await params
  return isTopicId(topic) ? { title: `${getTopic(topic).label} results` } : {}
}

export default async function ResultsPage({
  params,
}: PageProps<"/quiz/[topic]/results">) {
  const { topic } = await params
  if (!isTopicId(topic)) notFound()

  return (
    <PageShell ambient="results">
      <main id="main" className="flex-1">
        <ResultsView />
      </main>
    </PageShell>
  )
}
