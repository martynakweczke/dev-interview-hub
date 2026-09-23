import { InlineCodeText } from "@/components/inline-code-text/inline-code-text";
import { toneClasses } from "@/lib/tones/tones";
import type { Option, OptionId, Question } from "@/lib/questions";
import type { QuizAnswer } from "@/features/quiz/services/quiz/quiz";
import { cn } from "@/utils/cn/cn.utils";

const rowGrid =
  "grid grid-cols-[1.75rem_minmax(0,1fr)_1.75rem] items-center gap-x-3 gap-y-1.5 sm:min-w-144 sm:grid-cols-[2.75rem_minmax(0,1fr)_min(12.5rem,24%)_min(12.5rem,24%)_2.75rem] sm:gap-4";

function optionLabel(question: Question, optionId: OptionId): Option["label"] {
  return question.options.find((option) => option.id === optionId)?.label ?? "";
}

function AnswerCell({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="cell"
      className="text-cell wrap-anywhere max-sm:col-start-2 max-sm:text-meta"
    >
      <span aria-hidden="true" className="text-ink-faint sm:hidden">
        {label}:{" "}
      </span>
      <span className={className}>{children}</span>
    </div>
  );
}

function BreakdownRow({
  answer,
  number,
}: {
  answer: QuizAnswer;
  number: number;
}) {
  const { question, selectedOptionId, isCorrect } = answer;
  const skipped = selectedOptionId === null;
  const verdict = isCorrect ? "Correct" : skipped ? "Skipped" : "Incorrect";

  return (
    <div
      role="row"
      data-result={verdict.toLowerCase()}
      className={cn(
        rowGrid,
        "border-b border-line-row px-4 py-3.5 last:border-b-0 sm:px-5.5 sm:py-4",
        isCorrect
          ? toneClasses.correct
          : [toneClasses.incorrect, "bg-incorrect-row"]
      )}
    >
      <div role="cell" className="font-mono text-meta text-ink-faint">
        {String(number).padStart(2, "0")}
      </div>
      <div
        role="rowheader"
        className="text-row wrap-anywhere text-ink-secondary"
      >
        <InlineCodeText text={question.prompt} variant="row" />
      </div>
      <AnswerCell
        label="Your answer"
        className={cn(
          skipped ? "text-ink-faint" : "text-tone-ink",
          !isCorrect && !skipped && "line-through"
        )}
      >
        {skipped ? (
          "Skipped"
        ) : (
          <InlineCodeText
            text={optionLabel(question, selectedOptionId)}
            variant="cell"
          />
        )}
      </AnswerCell>
      <AnswerCell
        label="Correct answer"
        className={isCorrect ? "text-ink-muted" : "tone-correct text-tone-ink"}
      >
        <InlineCodeText
          text={optionLabel(question, question.correctOptionId)}
          variant="cell"
        />
      </AnswerCell>
      <div role="cell" className="max-sm:col-start-3 max-sm:row-start-1">
        <span
          aria-hidden="true"
          className="grid size-7 place-items-center rounded-pill border border-tone-line bg-tone-fill text-meta font-bold text-tone-ink"
        >
          {isCorrect ? "✓" : "✕"}
        </span>
        <span className="sr-only">{verdict}</span>
      </div>
    </div>
  );
}

export function BreakdownTable({
  answers,
  caption,
}: {
  answers: readonly QuizAnswer[];
  caption: string;
}) {
  return (
    <div
      role="table"
      aria-label={caption}
      className="overflow-x-auto rounded-card border border-line bg-table-fill backdrop-blur-glass"
    >
      <div role="rowgroup">
        <div
          role="row"
          className={cn(
            rowGrid,
            "border-b border-line-subtle bg-table-header px-5.5 py-3.5 font-mono text-eyebrow-compact text-ink-faint uppercase max-sm:sr-only"
          )}
        >
          <div role="columnheader">#</div>
          <div role="columnheader">Question</div>
          <div role="columnheader">Your answer</div>
          <div role="columnheader">Correct answer</div>
          <div role="columnheader">
            <span className="sr-only">Result</span>
          </div>
        </div>
      </div>
      <div role="rowgroup">
        {answers.map((answer, index) => (
          <BreakdownRow
            key={answer.question.id}
            answer={answer}
            number={index + 1}
          />
        ))}
      </div>
    </div>
  );
}
