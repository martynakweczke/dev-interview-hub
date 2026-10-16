import { InlineCodeText } from "@/components/inline-code-text/inline-code-text";
import { topics } from "@/lib/questions/topics";
import type { Question } from "@/lib/questions/types";

export function QuestionList({
  questions,
}: {
  questions: readonly Question[];
}) {
  return (
    <div className="flex flex-col gap-8">
      {topics.map((topic) => {
        const topicQuestions = questions.filter(
          (question) => question.topicId === topic.id
        );

        return (
          <section
            key={topic.id}
            aria-labelledby={`questions-${topic.id}`}
            className="flex flex-col gap-3"
          >
            <h3
              id={`questions-${topic.id}`}
              className="font-display text-row font-semibold text-ink-secondary"
            >
              {topic.label}{" "}
              <span className="font-sans font-normal text-ink-muted">
                · {topicQuestions.length}{" "}
                {topicQuestions.length === 1 ? "question" : "questions"}
              </span>
            </h3>
            {topicQuestions.length === 0 ? (
              <p className="text-meta text-ink-muted">No questions yet.</p>
            ) : (
              <ol className="flex list-decimal flex-col gap-2 pl-6 text-cell text-ink-tertiary marker:text-ink-faint">
                {topicQuestions.map((question) => (
                  <li key={question.id} className="text-pretty">
                    <InlineCodeText text={question.prompt} variant="cell" />
                  </li>
                ))}
              </ol>
            )}
          </section>
        );
      })}
    </div>
  );
}
