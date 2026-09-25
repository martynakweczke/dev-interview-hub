"use client";

import { useProgress } from "@/features/progress/hooks/use-progress/use-progress";
import { useToday } from "@/hooks/use-today/use-today";
import { TopicCard } from "@/features/progress/components/topic-card/topic-card";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  formatAccuracyCaption,
  formatStreak,
  getOverallAccuracy,
  getTopicHistory,
  getTopicStatus,
} from "@/features/progress/services/progress-summary/progress-summary";
import { topics } from "@/lib/questions/topics";

export function ProgressView() {
  const progress = useProgress();
  const today = useToday();

  const streak = formatStreak(progress, today);
  const accuracy = getOverallAccuracy(progress);

  return (
    <>
      <section
        aria-labelledby="progress-heading"
        className="flex flex-wrap items-end justify-between gap-6 px-gutter-compact pt-6 pb-4.5 sm:gap-10 sm:px-gutter sm:pt-16 sm:pb-7"
      >
        <div className="flex max-w-190 min-w-0 flex-[1_1_28rem] flex-col gap-3 sm:gap-5">
          {streak && (
            <Badge
              tone="streak"
              size="md"
              dot
              className="gap-2 self-start px-3 py-1.5 text-pill-compact *:data-[slot=badge-dot]:size-1.5 max-sm:*:data-[slot=badge-dot]:shadow-none sm:gap-2.5 sm:px-3.5 sm:py-1.75 sm:text-pill-lg sm:tracking-streak sm:*:data-[slot=badge-dot]:size-1.75"
            >
              {streak}
            </Badge>
          )}
          <h1
            id="progress-heading"
            className="font-display text-hero-compact font-bold text-pretty text-ink-primary sm:text-hero"
          >
            Your progress
          </h1>
          <p className="max-w-130 text-lede-compact text-pretty text-ink-muted sm:text-lede">
            Best scores, rounds played and your streak across CSS, HTML,
            JavaScript and TypeScript.
          </p>
        </div>

        <Card variant="stat" className="w-full sm:w-auto sm:min-w-71">
          <p className="text-eyebrow font-semibold uppercase text-ink-faint">
            Overall accuracy
          </p>
          <p className="flex items-baseline gap-2">
            <span className="font-display text-stat font-bold text-ink-primary">
              {accuracy.percent}
            </span>
            <span className="text-unit font-semibold text-ink-muted">%</span>
          </p>
          <Progress
            value={accuracy.percent}
            size="md"
            track="strong"
            fill="sweep"
            aria-label="Overall accuracy"
          />
          <p className="text-meta text-ink-muted">
            {formatAccuracyCaption(accuracy)}
          </p>
        </Card>
      </section>

      <section aria-labelledby="topics-heading" className="flex flex-col">
        <div className="flex items-center justify-between gap-4 px-gutter-compact pt-2 pb-3.5 sm:px-gutter sm:pt-6 sm:pb-5">
          <h2
            id="topics-heading"
            className="font-display text-section font-semibold text-ink-secondary"
          >
            By topic
          </h2>
        </div>
        <ul className="grid gap-3.5 px-gutter-compact pt-1.5 pb-6 sm:grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] sm:gap-5 sm:px-gutter sm:pt-0 sm:pb-13">
          {topics.map((topic) => {
            const topicProgress = progress.topics[topic.id];
            return (
              <li key={topic.id} className="flex flex-col gap-2.5">
                <TopicCard
                  topic={topic}
                  progress={topicProgress}
                  status={getTopicStatus(topicProgress, today)}
                  className="flex-1"
                />
                <dl
                  aria-label={`${topic.label} history`}
                  className="grid grid-cols-3 gap-3 px-1 text-caption"
                >
                  {getTopicHistory(topicProgress, today).map((item) => (
                    <div key={item.label} className="flex flex-col gap-0.5">
                      <dt className="text-ink-faint">{item.label}</dt>
                      <dd className="font-semibold text-ink-secondary">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
