import Link from "next/link"

import { TopicIconTile } from "@/components/topic-icon-tile/topic-icon-tile"
import { Button } from "@/components/ui/button"
import type { Topic } from "@/lib/questions"

export function QuizHeader({ topic }: { topic: Topic }) {
  return (
    <header className="border-b border-line-header">
      <div className="flex items-center justify-between gap-4 px-gutter-compact pt-4.5 pb-3.5 sm:px-gutter sm:py-5">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3.5">
          <TopicIconTile
            glyph={topic.glyph}
            tone={topic.tone}
            className="size-8 rounded-tile-sm border-tone-pill-line bg-tone-pill-fill text-caption sm:size-9 sm:rounded-tile-md sm:text-meta"
          />
          <p className="truncate font-display text-quiz-title-compact font-semibold text-ink-heading-alt sm:text-quiz-title">
            {topic.label}
            <span className="max-sm:hidden"> round</span>
          </p>
        </div>
        <Button asChild variant="pill" size="pill">
          <Link href="/">Exit round</Link>
        </Button>
      </div>
    </header>
  )
}
