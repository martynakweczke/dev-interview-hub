"use client";

import { useEffect, useId, useRef, useState } from "react";

import { InlineCodeText } from "@/components/inline-code-text/inline-code-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AnswerOptions } from "@/features/quiz/components/answer-options/answer-options";
import { ShortcutHint } from "@/features/quiz/components/shortcut-hint/shortcut-hint";
import { useAnswerShortcuts } from "@/features/quiz/hooks/use-answer-shortcuts/use-answer-shortcuts";
import type { QuizAnswer } from "@/features/quiz/services/quiz/quiz";
import { playSelectSound } from "@/features/sound/services/sound-player/sound-player";
import type { OptionId } from "@/lib/questions";
import { getTopic } from "@/lib/questions/topics";
import { toneClasses } from "@/lib/tones/tones";
import { cn } from "@/utils/cn/cn.utils";

export function ReviewView({
  answers,
  onDone,
}: {
  answers: readonly QuizAnswer[];
  onDone: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [pick, setPick] = useState<OptionId | null>(null);
  const headingId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  const { question } = answers[index];
  const topic = getTopic(question.topicId);
  const total = answers.length;
  const number = index + 1;
  const isLast = number === total;
  const isCorrect = pick === question.correctOptionId;

  function moveOn() {
    if (isLast) {
      onDone();
      return;
    }

    setPick(null);
    setIndex(index + 1);
  }

  function chooseOption(optionId: OptionId) {
    if (pick === null) {
      setPick(optionId);
      playSelectSound();
    }
  }

  useAnswerShortcuts({
    onSelect: chooseOption,
    onConfirm: () => {
      if (pick !== null) {
        moveOn();
      }
    },
  });

  useEffect(() => {
    headingRef.current?.focus();
  }, [index]);

  useEffect(() => {
    if (pick !== null) {
      feedbackRef.current?.focus();
    }
  }, [pick]);

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-227 flex-col px-gutter-compact pt-6 pb-10 sm:px-gutter sm:pt-12 sm:pb-14",
        toneClasses[topic.tone]
      )}
    >
      <div className="flex flex-col gap-2.25 sm:gap-3">
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-display text-progress-label-compact font-semibold text-tone-ink sm:text-progress-label">
            Mistake {number} of {total}
          </p>
          <p className="text-meta text-ink-faint">{total - number} left</p>
        </div>
        <Progress
          value={(number / total) * 100}
          size="xl"
          track="strong"
          fill="quiz"
          aria-label="Review progress"
          className="max-sm:h-2 max-sm:*:data-[slot=progress-indicator]:shadow-progress-glow-compact"
        />
      </div>

      <div className="mt-6 mb-4.5 flex flex-col gap-3 sm:my-8">
        <Badge tone="glass" size="chip">
          Review
        </Badge>
        <h1
          id={headingId}
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-question-compact font-semibold text-pretty text-ink-primary outline-none sm:text-question"
        >
          <InlineCodeText text={question.prompt} variant="prompt" />
        </h1>
      </div>

      <AnswerOptions
        key={question.id}
        options={question.options}
        value={pick}
        onValueChange={chooseOption}
        correctOptionId={pick === null ? null : question.correctOptionId}
        disabled={pick !== null}
        aria-labelledby={headingId}
      />

      {pick !== null && (
        <div
          ref={feedbackRef}
          tabIndex={-1}
          className="mt-5 flex flex-col items-start gap-3 rounded-card border border-line bg-glass-strong px-4.5 py-4 outline-none sm:mt-6 sm:px-5.5 sm:py-5"
        >
          <Badge tone={isCorrect ? "correct" : "incorrect"} size="md">
            {isCorrect
              ? "Correct"
              : `Not quite — the answer is ${question.correctOptionId.toUpperCase()}`}
          </Badge>
          {question.explanation !== undefined && (
            <p className="text-row text-pretty text-ink-secondary">
              <InlineCodeText text={question.explanation} variant="row" />
            </p>
          )}
        </div>
      )}

      <div className="mt-6 flex items-center gap-3 sm:mt-8 sm:justify-between">
        <Button variant="secondary" size="compact" onClick={onDone}>
          Exit review
        </Button>
        <ShortcutHint className="ml-auto" />
        <Button
          size="compact"
          disabled={pick === null}
          onClick={moveOn}
          className="flex-1 sm:flex-none sm:px-8.5"
        >
          {isLast ? "Back to results" : "Next mistake"}
        </Button>
      </div>
    </div>
  );
}
