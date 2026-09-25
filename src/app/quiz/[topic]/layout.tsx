import { notFound } from "next/navigation";

import { QuizProvider } from "@/features/quiz/components/quiz-provider/quiz-provider";
import { getQuestionsForTopic } from "@/lib/db/questions";
import { isTopicId } from "@/lib/questions";

export default async function QuizLayout({
  children,
  params,
}: LayoutProps<"/quiz/[topic]">) {
  const { topic } = await params;

  if (!isTopicId(topic)) {
    notFound();
  }

  const questions = await getQuestionsForTopic(topic);

  if (questions.length === 0) {
    notFound();
  }

  return (
    <QuizProvider key={topic} topicId={topic} questions={questions}>
      {children}
    </QuizProvider>
  );
}
