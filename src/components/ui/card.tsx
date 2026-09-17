import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { toneClasses } from "@/lib/tones/tones"
import { cn } from "@/utils/cn/cn.utils"

const cardVariants = cva(
  "group/card relative flex flex-col gap-4.5 rounded-card border p-4 text-ink-secondary backdrop-blur-glass sm:p-6",
  {
    variants: {
      variant: {
        glass: "border-line bg-glass shadow-card",
        focus: "border-focus-card-line bg-focus-card-fill shadow-focus-card",
        stat: "gap-3.5 border-line bg-glass shadow-stat sm:px-6.5 sm:py-5.5",
      },
      tone: toneClasses,
      interactive: {
        true: "transition-[translate,box-shadow,border-color] duration-180 ease-ui hovered:border-tone-ring hovered:shadow-card-hover focus-within:border-tone-ring motion-safe:hovered:-translate-y-1",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "focus",
        interactive: true,
        className:
          "hovered:border-focus-card-hover-line hovered:shadow-focus-card-hover",
      },
    ],
    defaultVariants: {
      variant: "glass",
      interactive: false,
    },
  }
)

function Card({
  className,
  variant,
  tone,
  interactive,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof cardVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="card"
      data-variant={variant}
      className={cn(cardVariants({ variant, tone, interactive }), className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex items-start justify-between gap-3", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-display text-topic-compact font-semibold text-ink-primary sm:text-topic",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-caption text-ink-muted sm:text-meta", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("shrink-0 self-start", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("flex flex-col gap-1.25", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-3", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
}
