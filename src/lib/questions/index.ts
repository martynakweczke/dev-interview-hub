import { cssQuestions } from "@/lib/questions/css";
import { htmlQuestions } from "@/lib/questions/html";
import { jsQuestions } from "@/lib/questions/js";
import { tsQuestions } from "@/lib/questions/ts";
import { TOPIC_IDS, type Question, type TopicId } from "@/lib/questions/types";

export * from "@/lib/questions/types";

export { getTopic, isTopicId, topics } from "@/lib/questions/topics";

const questionsByTopic: Record<TopicId, readonly Question[]> = {
  css: cssQuestions,
  html: htmlQuestions,
  js: jsQuestions,
  ts: tsQuestions,
};

export const questions: readonly Question[] = TOPIC_IDS.flatMap(
  (id) => questionsByTopic[id]
);

export function getSeedQuestionsForTopic(id: TopicId): readonly Question[] {
  return questionsByTopic[id];
}
