import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center gap-2 border whitespace-nowrap select-none transition-[translate,background-color,border-color,box-shadow,color] duration-160 ease-ui disabled:cursor-not-allowed disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "border-transparent bg-cta font-display font-bold text-on-brand motion-safe:enabled:hovered:-translate-y-0.5 disabled:border-disabled-line disabled:bg-disabled-fill disabled:bg-none disabled:text-ink-disabled",
        secondary:
          "border-line-strong bg-glass-strong font-display font-semibold text-ink-secondary enabled:hovered:bg-secondary-hover disabled:text-ink-disabled",
        ghost:
          "border-transparent bg-transparent font-sans font-medium text-ink-muted enabled:hovered:text-ink-secondary disabled:text-ink-disabled",
        pill: "border-line-soft bg-glass-strong font-sans font-medium text-ink-tertiary enabled:hovered:bg-glass-hover disabled:text-ink-disabled",
      },
      size: {
        /** Quiz "Next question" — 52px. */
        md: "min-h-13 rounded-control px-8.5 text-button",
        /** Results actions — 56px. */
        lg: "min-h-14 rounded-control-lg px-7.5 text-button",
        /** Bottom-pinned phone actions — 52px, tight padding. */
        compact: "min-h-13 rounded-control px-4.5 text-button-sm",
        /** Text-only inline action (desktop "Skip"). */
        inline: "rounded-control-sm px-5.5 py-3.5 text-button-sm",
        /** Header pill ("Exit round"); hit area extended to 44px+. */
        pill: "rounded-pill px-3.5 py-1.75 text-nav-compact after:absolute after:inset-x-0 after:-inset-y-2",
      },
    },
    compoundVariants: [
      {
        variant: "primary",
        size: ["md", "compact"],
        className: "border-cta-line shadow-cta-next",
      },
      {
        variant: "primary",
        size: "lg",
        className: "px-8.5 text-button-lg shadow-cta",
      },
      {
        variant: "primary",
        size: "compact",
        className: "text-button",
      },
      {
        variant: "secondary",
        size: "compact",
        className: "border-line-soft font-sans font-medium text-ink-muted",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  disabled,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
