"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Progress as ProgressPrimitive } from "radix-ui";

import { cn } from "@/utils/cn/cn.utils";

const progressVariants = cva("relative w-full overflow-hidden rounded-pill", {
  variants: {
    size: {
      xs: "h-1.25",
      sm: "h-1.5",
      md: "h-1.75",
      lg: "h-2",
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
});

const indicatorVariants = cva(
  "size-full rounded-pill transition-transform duration-180 ease-ui",
  {
    variants: {
      fill: {
        tone: "bg-tone-solid",
        sweep: "bg-progress-sweep",
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
);

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
  );
}

export { Progress };
