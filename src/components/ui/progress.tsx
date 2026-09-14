"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

const progressVariants = cva("relative w-full overflow-hidden rounded-pill", {
  variants: {
    size: {
      /** 5px — phone topic rows. */
      xs: "h-1.25",
      /** 6px — topic cards. */
      sm: "h-1.5",
      /** 7px — accuracy stat card. */
      md: "h-1.75",
      /** 8px — phone quiz progress. */
      lg: "h-2",
      /** 9px — desktop quiz progress. */
      xl: "h-2.25",
    },
    track: {
      default: "bg-track",
      strong: "bg-track-strong",
    },
  },
  defaultVariants: {
    size: "sm",
    track: "default",
  },
})

const indicatorVariants = cva(
  "size-full rounded-pill transition-transform duration-180 ease-ui",
  {
    variants: {
      fill: {
        /** Solid accent of the nearest `tone-*`. */
        tone: "bg-tone-solid",
        /** Cyan → amber accuracy sweep. */
        sweep: "bg-progress-sweep",
        /** Glowing amber quiz progress. */
        quiz: "bg-progress-quiz shadow-progress-glow",
      },
      size: {
        xs: "",
        sm: "",
        md: "",
        lg: "",
        xl: "",
      },
    },
    compoundVariants: [
      { fill: "quiz", size: "lg", className: "shadow-progress-glow-compact" },
    ],
    defaultVariants: {
      fill: "tone",
    },
  }
)

function Progress({
  className,
  value,
  size,
  track,
  fill,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> &
  VariantProps<typeof progressVariants> &
  VariantProps<typeof indicatorVariants>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      className={cn(progressVariants({ size, track }), className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(indicatorVariants({ fill, size }))}
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
