import * as React from "react"

import { cn } from "@/lib/utils"

type ScoreRingProps = React.ComponentProps<"div"> & {
  score: number
  total: number
  percentage: number
}

export function ScoreRing({
  score,
  total,
  percentage,
  className,
  style,
  ...props
}: ScoreRingProps) {
  return (
    <div
      role="img"
      aria-label={`Score: ${score} out of ${total}, ${percentage}%`}
      data-slot="score-ring"
      className={cn(
        "grid size-49 shrink-0 place-items-center rounded-pill bg-score-ring shadow-score-ring",
        className
      )}
      style={
        {
          ...style,
          "--score-ring-progress": `${percentage}%`,
        } as React.CSSProperties
      }
      {...props}
    >
      <div
        aria-hidden="true"
        className="flex size-42 flex-col items-center justify-center gap-0.5 rounded-pill border border-line-subtle bg-panel-top font-display"
      >
        <p className="text-score font-bold text-ink-primary">
          {score}
          <span className="text-ink-faint">/{total}</span>
        </p>
        <p className="text-figure font-semibold text-score-percent">
          {percentage}%
        </p>
      </div>
    </div>
  )
}
