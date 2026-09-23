import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ResultsView } from "@/features/quiz/components/results-view/results-view";
import { PageShell } from "@/features/shell/components/page-shell/page-shell";
import { getTopic, isTopicId } from "@/lib/questions";

export async function generateMetadata({
  params,
}: PageProps<"/quiz/[topic]/results">): Promise<Metadata> {
  const { topic } = await params;
  return isTopicId(topic) ? { title: `${getTopic(topic).label} results` } : {};
}

export default async function ResultsPage({
  params,
}: PageProps<"/quiz/[topic]/results">) {
  const { topic } = await params;

  if (!isTopicId(topic)) {
    notFound();
  }

  return (
    <PageShell ambient="results">
      <main id="main" className="page-enter flex-1">
        <ResultsView />
      </main>
    </PageShell>
  );
}
