"use client";

import Link from "next/link";

import { useProgress } from "@/features/progress/hooks/use-progress/use-progress";
import { useToday } from "@/hooks/use-today/use-today";
import { TopicCard } from "@/features/progress/components/topic-card/topic-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  formatAccuracyCaption,
  formatStreak,
  getFocusTopicId,
  getOverallAccuracy,
  getResumeTopicId,
  getTopicStatus,
  sortTopicsByWeakest,
} from "@/features/progress/services/progress-summary/progress-summary";
import { getTopic, topics } from "@/lib/questions/topics";

export function HomeView() {
  const progress = useProgress();
  const today = useToday();

  const streak = formatStreak(progress, today);
  const accuracy = getOverallAccuracy(progress);
  const focusTopicId = getFocusTopicId(progress);
  const resumeTopicId = getResumeTopicId(progress);
  const orderedTopics = sortTopicsByWeakest(topics, progress);

  return (
    <>
      <section
        aria-labelledby="home-heading"
        className="flex flex-wrap items-end justify-between gap-10 px-gutter-compact pt-6 pb-4.5 sm:px-gutter sm:pt-16 sm:pb-7"
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
            id="home-heading"
            className="font-display text-hero-compact font-bold text-pretty text-ink-primary sm:text-hero"
          >
            Sharpen your frontend skills, <br className="max-sm:hidden" />
            <span className="text-accent-link">one question at a time.</span>
          </h1>
          <p className="text-lede-compact text-ink-muted sm:hidden">
            Ten questions per round. Under five minutes.
          </p>
          <p className="max-w-130 text-lede text-pretty text-ink-muted max-sm:hidden">
            Junior interview drills in CSS, HTML, JavaScript and TypeScript. Ten
            questions per round — under five minutes each.
          </p>
        </div>

        <Card variant="stat" className="min-w-71 max-sm:hidden">
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
        <div className="flex items-center justify-between gap-4 px-gutter-compact sm:px-gutter sm:pt-6 sm:pb-5">
          <h2
            id="topics-heading"
            className="font-display text-section font-semibold text-ink-secondary max-sm:sr-only"
          >
            Pick a topic
          </h2>
          <p className="text-meta text-ink-faint max-sm:hidden">
            Sorted by weakest score
          </p>
        </div>
        <ul className="grid gap-3.5 px-gutter-compact pt-1.5 pb-6 sm:grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] sm:gap-5 sm:px-gutter sm:pt-0 sm:pb-13">
          {orderedTopics.map((topic) => (
            <li key={topic.id} className="grid">
              <TopicCard
                topic={topic}
                progress={progress.topics[topic.id]}
                status={getTopicStatus(progress.topics[topic.id], today)}
                focus={topic.id === focusTopicId}
              />
            </li>
          ))}
        </ul>
      </section>

      {resumeTopicId && (
        <div className="sticky bottom-0 z-10 mt-auto bg-scrim px-gutter-compact pt-4 pb-[max(1.375rem,env(safe-area-inset-bottom))] sm:hidden">
          <Button
            asChild
            size="compact"
            className="w-full rounded-control-lg border-transparent shadow-cta-compact"
          >
            <Link href={`/quiz/${resumeTopicId}`}>
              Resume {getTopic(resumeTopicId).label} round
            </Link>
          </Button>
        </div>
      )}
    </>
  );
}
