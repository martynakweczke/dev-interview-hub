"use client";

import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { useQuiz } from "@/features/quiz/components/quiz-provider/quiz-provider";
import { BreakdownTable } from "@/features/quiz/components/breakdown-table/breakdown-table";
import { ScoreRing } from "@/features/quiz/components/score-ring/score-ring";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getProgressSnapshot,
  recordProgressAttempt,
} from "@/features/progress/services/progress-store/progress-store";
import { getTopic } from "@/lib/questions/topics";
import {
  getImprovement,
  getNextTopicId,
  getResultsCopy,
  isNewPersonalBest,
} from "@/features/quiz/services/results/results";
import { cn } from "@/utils/cn/cn.utils";
import { formatDuration, formatDurationLabel } from "@/utils/date/date.utils";

function StatTile({
  value,
  label,
  valueLabel,
  className,
}: {
  value: string;
  label: string;
  valueLabel?: string;
  className?: string;
}) {
  return (
    <div className="flex flex-col gap-0.75 rounded-control-sm border border-line bg-glass-strong px-4.5 py-3 max-sm:flex-1">
      <dt className="order-last text-caption text-ink-muted">{label}</dt>
      <dd className={cn("font-display text-figure font-bold", className)}>
        {valueLabel ? (
          <>
            <span aria-hidden="true">{value}</span>
            <span className="sr-only">{valueLabel}</span>
          </>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

export function ResultsView() {
  const { state, timing } = useQuiz();
  const { result } = state;

  const [previous] = React.useState(() =>
    result === null ? null : getProgressSnapshot().topics[result.topicId]
  );
  const recordedRef = React.useRef<typeof result>(null);

  React.useEffect(() => {
    if (result === null || timing === null) {
      return;
    }

    if (recordedRef.current === result) {
      return;
    }

    recordedRef.current = result;
    recordProgressAttempt({
      topicId: result.topicId,
      score: result.score,
      completedAt: timing.completedAt,
    });
  }, [result, timing]);

  if (result === null || timing === null || previous === null) {
    redirect("/");
  }

  const topic = getTopic(result.topicId);
  const nextTopic = getTopic(getNextTopicId(result.topicId));
  const total = result.answers.length;
  const missed = total - result.score;
  const copy = getResultsCopy(result.score, total);
  const personalBest = isNewPersonalBest(result.score, previous);
  const improvement = getImprovement(result.score, previous);

  return (
    <div className="mx-auto flex w-full max-w-257 flex-col gap-7 px-gutter-compact pt-6 pb-10 sm:gap-8.5 sm:px-gutter sm:pt-12 sm:pb-14">
      <section
        aria-labelledby="results-heading"
        className="relative flex flex-col items-center gap-6 overflow-hidden rounded-hero border border-score-hero-line bg-score-hero px-5 py-7 shadow-score-hero backdrop-blur-glass sm:flex-row sm:flex-wrap sm:justify-center sm:gap-10 sm:px-10 sm:py-9.5"
      >
        <ScoreRing
          score={result.score}
          total={total}
          percentage={result.percentage}
        />
        <div className="flex w-full min-w-0 flex-col gap-4 sm:w-auto sm:flex-[1_1_20rem]">
          {(personalBest || improvement !== null) && (
            <div className="flex flex-wrap items-center gap-3">
              {personalBest && (
                <Badge tone="correct" size="md" emphasis="strong">
                  New personal best
                </Badge>
              )}
              {improvement !== null && (
                <Badge tone="brand" size="md">
                  +{improvement} vs last round
                </Badge>
              )}
            </div>
          )}
          <h1
            id="results-heading"
            className="font-display text-results-compact font-bold text-pretty text-ink-primary sm:text-results"
          >
            {copy.headline}
          </h1>
          <p className="max-w-130 text-lede-compact text-pretty text-ink-muted sm:text-results-sub">
            {copy.sub}
          </p>
          <dl className="flex flex-wrap gap-3 pt-1">
            <StatTile
              value={String(result.score)}
              label="Correct"
              className="tone-correct text-tone-ink"
            />
            <StatTile
              value={String(missed)}
              label="Missed"
              className="tone-incorrect text-tone-ink"
            />
            <StatTile
              value={formatDuration(timing.durationMs)}
              valueLabel={formatDurationLabel(timing.durationMs)}
              label="Time"
              className="text-ink-heading-alt"
            />
          </dl>
        </div>
      </section>

      <section
        aria-labelledby="breakdown-heading"
        className="flex flex-col gap-3.5"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2
            id="breakdown-heading"
            className="font-display text-section font-semibold text-ink-heading-alt"
          >
            Question breakdown
          </h2>
          <p className="text-meta text-ink-faint">
            {topic.label} · {total} questions
          </p>
        </div>
        <BreakdownTable
          answers={result.answers}
          caption={`${topic.label} question breakdown`}
        />
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        <Button asChild size="lg">
          <Link href={`/quiz/${result.topicId}`}>Retry quiz</Link>
        </Button>
        <Button asChild variant="secondary" size="lg">
          <Link href="/">Back to topics</Link>
        </Button>
        <p className="text-hint text-ink-faint max-sm:pt-2 max-sm:text-center sm:ml-auto">
          Next up:{" "}
          <Link
            href={`/quiz/${nextTopic.id}`}
            className="rounded-chip text-accent-link transition-colors duration-160 ease-ui hovered:text-accent-link-hover"
          >
            {nextTopic.label} · {total} questions
          </Link>
        </p>
      </div>
    </div>
  );
}
