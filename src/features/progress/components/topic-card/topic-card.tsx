import * as React from "react"
import Link from "next/link"
import { cva } from "class-variance-authority"

import { TopicIconTile } from "@/components/topic-icon-tile/topic-icon-tile"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { TopicProgress } from "@/features/progress/services/progress/progress"
import { formatTopicStatus, type TopicStatus } from "@/features/progress/services/progress-summary/progress-summary"
import { QUESTIONS_PER_ROUND, type Topic } from "@/lib/questions"
import { cn } from "@/utils/cn/cn.utils"

const topicCardVariants = cva(
  [
    "grid min-h-19 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1.5 rounded-row [grid-template-areas:'tile_name_pill'_'tile_meta_pill'_'tile_bar_pill']",
    "sm:min-h-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-x-3 sm:gap-y-1.25 sm:rounded-card sm:[grid-template-areas:'tile_pill'_'name_name'_'meta_meta'_'status_status'_'bar_bar']",
  ],
  {
    variants: {
      variant: {
        glass: "max-sm:bg-glass-strong max-sm:shadow-none",
        focus:
          "max-sm:border-focus-row-line max-sm:bg-focus-row-fill max-sm:shadow-focus-row",
      },
    },
  }
)

const statusVariants = cva("text-caption [grid-area:status] max-sm:hidden", {
  variants: {
    kind: {
      new: "text-tone-ink",
      review: "text-tone-ink",
      played: "text-ink-faintest",
    },
  },
})

const pillClassName = "self-center [grid-area:pill] sm:self-start sm:px-2.75 sm:text-pill"

type TopicCardProps = Omit<
  React.ComponentProps<typeof Link>,
  "href" | "children"
> & {
  topic: Topic
  progress: TopicProgress
  status: TopicStatus
  focus?: boolean
}

export function TopicCard({
  topic,
  progress,
  status,
  focus = false,
  className,
  ...props
}: TopicCardProps) {
  const variant = focus ? "focus" : "glass"
  const attempted = progress.attempts > 0

  return (
    <Card
      asChild
      variant={variant}
      tone={topic.tone}
      interactive
      className={cn(topicCardVariants({ variant }), className)}
    >
      <Link href={`/quiz/${topic.id}`} {...props}>
        <TopicIconTile glyph={topic.glyph} className="[grid-area:tile]" />
        <CardTitle className="[grid-area:name] sm:mt-3.25">{topic.label}</CardTitle>
        <CardDescription className="[grid-area:meta]">
          {QUESTIONS_PER_ROUND} questions
        </CardDescription>
        <p className={statusVariants({ kind: status.kind })}>
          {formatTopicStatus(status)}
        </p>
        <Progress
          value={(progress.bestScore / QUESTIONS_PER_ROUND) * 100}
          aria-label={`${topic.label} best score`}
          className="h-1.25 bg-track-strong [grid-area:bar] sm:mt-3.25 sm:h-1.5 sm:bg-track"
        />
        {attempted ? (
          <Badge tone={topic.tone} size="xs" className={pillClassName}>
            <span>
              <span className="max-sm:hidden">Best: </span>
              {progress.bestScore}/{QUESTIONS_PER_ROUND}
            </span>
          </Badge>
        ) : (
          <Badge tone="neutral" size="xs" className={pillClassName}>
            <span className="sm:hidden">New</span>
            <span className="max-sm:hidden">Not attempted yet</span>
          </Badge>
        )}
      </Link>
    </Card>
  )
}
