"use client"

import * as React from "react"
import { RadioGroup } from "radix-ui"

import { InlineCodeText } from "@/components/questions/inline-code-text"
import type { Option, OptionId } from "@/lib/questions"

type AnswerOptionsProps = Omit<
  React.ComponentProps<typeof RadioGroup.Root>,
  "value" | "onValueChange" | "children"
> & {
  options: readonly Option[]
  value: OptionId | null
  onValueChange: (optionId: OptionId) => void
}

export function AnswerOptions({
  options,
  value,
  onValueChange,
  ...props
}: AnswerOptionsProps) {
  function handleValueChange(next: string) {
    const option = options.find(({ id }) => id === next)
    if (option) onValueChange(option.id)
  }

  return (
    <RadioGroup.Root
      value={value ?? ""}
      onValueChange={handleValueChange}
      className="flex flex-col gap-3 sm:gap-3.5"
      {...props}
    >
      {options.map((option) => (
        <RadioGroup.Item
          key={option.id}
          value={option.id}
          onKeyDown={(event) => {
            if (event.key === "Enter") onValueChange(option.id)
          }}
          className="group/answer relative flex min-h-16 w-full cursor-pointer items-center gap-3.5 rounded-answer-compact border border-line bg-glass-strong px-4 py-3 text-left text-answer-compact font-medium text-ink-secondary transition-[translate,background-color] duration-160 ease-ui before:pointer-events-none before:absolute before:inset-0 before:rounded-answer-compact before:border-2 before:border-selected-line before:bg-selected-fill before:opacity-0 before:shadow-selected-compact before:transition-opacity before:duration-180 before:ease-ui disabled:cursor-default data-[state=checked]:text-ink-primary data-[state=checked]:before:opacity-100 sm:min-h-18.5 sm:gap-4.5 sm:rounded-answer sm:bg-glass sm:px-5.5 sm:py-4 sm:text-answer sm:before:rounded-answer sm:before:shadow-selected sm:enabled:hovered:bg-glass-hover motion-safe:sm:enabled:hovered:-translate-y-0.5"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-tile-sm border border-line-strong bg-neutral-fill font-display text-glyph-xs font-bold text-ink-tertiary sm:size-11 sm:rounded-tile sm:text-glyph">
            {option.id.toUpperCase()}
          </span>
          <span className="min-w-0 flex-1 text-pretty">
            <InlineCodeText text={option.label} variant="option" />
          </span>
          <RadioGroup.Indicator
            forceMount
            aria-hidden="true"
            className="relative grid size-5.5 shrink-0 place-items-center rounded-pill bg-check text-caption font-bold text-on-check opacity-0 transition-opacity duration-180 ease-ui data-[state=checked]:opacity-100 sm:size-6.5 sm:text-nav"
          >
            ✓
          </RadioGroup.Indicator>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  )
}
