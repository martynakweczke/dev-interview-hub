import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { QuizHeader } from "@/components/quiz/quiz-header"
import { QuizView } from "@/components/quiz/quiz-view"
import { Surface } from "@/components/shell/surface"
import { getTopic, isTopicId } from "@/lib/questions"

export async function generateMetadata({
  params,
}: PageProps<"/quiz/[topic]">): Promise<Metadata> {
  const { topic } = await params
  return isTopicId(topic) ? { title: `${getTopic(topic).label} round` } : {}
}

export default async function QuizPage({ params }: PageProps<"/quiz/[topic]">) {
  const { topic } = await params
  if (!isTopicId(topic)) notFound()

  return (
    <Surface ambient="quiz" className="flex min-h-dvh flex-col">
      <QuizHeader topic={getTopic(topic)} />
      <main id="main" className="flex flex-1 flex-col">
        <QuizView />
      </main>
    </Surface>
  )
}
