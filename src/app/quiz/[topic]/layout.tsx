import { notFound } from "next/navigation"

import { QuizProvider } from "@/features/quiz/components/quiz-provider/quiz-provider"
import { isTopicId } from "@/lib/questions"


export default async function QuizLayout({
  children,
  params,
}: LayoutProps<"/quiz/[topic]">) {
  const { topic } = await params
  if (!isTopicId(topic)) notFound()

  return (
    <QuizProvider key={topic} topicId={topic}>
      {children}
    </QuizProvider>
  )
}
