"use client";

import { useEffect, useRef } from "react";
import type { ComponentProps } from "react";
import { RadioGroup } from "radix-ui";

import { InlineCodeText } from "@/components/inline-code-text/inline-code-text";
import type { Option, OptionId } from "@/lib/questions";
import { toneClasses } from "@/lib/tones/tones";
import { cn } from "@/utils/cn/cn.utils";

type Verdict = "correct" | "incorrect";

const verdictLabels: Record<Verdict, string> = {
  correct: "Correct answer",
  incorrect: "Your answer, incorrect",
};

type AnswerOptionsProps = Omit<
  ComponentProps<typeof RadioGroup.Root>,
  "value" | "onValueChange" | "children"
> & {
  options: readonly Option[];
  value: OptionId | null;
  onValueChange: (optionId: OptionId) => void;
  correctOptionId?: OptionId | null;
  onConfirm?: () => void;
};

export function AnswerOptions({
  options,
  value,
  onValueChange,
  correctOptionId = null,
  onConfirm,
  ...props
}: AnswerOptionsProps) {
  const itemRefs = useRef(new Map<OptionId, HTMLButtonElement>());

  function getVerdict(optionId: OptionId): Verdict | null {
    if (correctOptionId === null) {
      return null;
    }

    if (optionId === correctOptionId) {
      return "correct";
    }

    return optionId === value ? "incorrect" : null;
  }

  function handleValueChange(next: string) {
    const option = options.find(({ id }) => id === next);

    if (option) {
      onValueChange(option.id);
    }
  }

  useEffect(() => {
    if (value === null) {
      return;
    }

    const items = [...itemRefs.current.values()];

    if (items.some((item) => item === document.activeElement)) {
      itemRefs.current.get(value)?.focus();
    }
  }, [value]);

  return (
    <RadioGroup.Root
      value={value ?? ""}
      onValueChange={handleValueChange}
      className="flex flex-col gap-3 sm:gap-3.5"
      {...props}
    >
      {options.map((option) => {
        const verdict = getVerdict(option.id);

        return (
          <RadioGroup.Item
            key={option.id}
            value={option.id}
            ref={(node) => {
              if (node) {
                itemRefs.current.set(option.id, node);
              }
            }}
            data-verdict={verdict ?? undefined}
            onKeyDown={(event) => {
              if (event.key !== "Enter" || event.repeat) {
                return;
              }

              if (option.id === value) {
                onConfirm?.();
              } else {
                onValueChange(option.id);
              }
            }}
            className={cn(
              "group/answer relative flex min-h-16 w-full cursor-pointer items-center gap-3.5 rounded-answer-compact border border-line bg-glass-strong px-4 py-3 text-left text-answer-compact font-medium text-ink-secondary transition-[translate,background-color] duration-160 ease-ui before:pointer-events-none before:absolute before:inset-0 before:rounded-answer-compact before:border-2 before:border-selected-line before:bg-selected-fill before:opacity-0 before:shadow-selected-compact before:transition-opacity before:duration-180 before:ease-ui disabled:cursor-default data-[state=checked]:text-ink-primary data-[state=checked]:before:opacity-100 data-[state=checked]:focus-visible:-outline-offset-1 sm:min-h-18.5 sm:gap-4.5 sm:rounded-answer sm:bg-glass sm:px-5.5 sm:py-4 sm:text-answer sm:before:rounded-answer sm:before:shadow-selected sm:enabled:hovered:bg-glass-hover motion-safe:sm:enabled:hovered:-translate-y-0.5",
              verdict !== null && [
                toneClasses[verdict],
                "before:border-tone-line before:bg-tone-fill before:opacity-100 before:shadow-none sm:before:shadow-none",
              ]
            )}
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-tile-sm border border-line-strong bg-neutral-fill font-display text-glyph-xs font-bold text-ink-tertiary sm:size-11 sm:rounded-tile sm:text-glyph">
              {option.id.toUpperCase()}
            </span>
            <span className="min-w-0 flex-1 text-pretty">
              <InlineCodeText text={option.label} variant="option" />
            </span>
            {verdict === null ? (
              <RadioGroup.Indicator
                forceMount
                aria-hidden="true"
                className="relative grid size-5.5 shrink-0 place-items-center rounded-pill bg-check text-caption font-bold text-on-check opacity-0 transition-opacity duration-180 ease-ui data-[state=checked]:opacity-100 sm:size-6.5 sm:text-nav"
              >
                ✓
              </RadioGroup.Indicator>
            ) : (
              <>
                <span
                  aria-hidden="true"
                  className="relative grid size-5.5 shrink-0 place-items-center rounded-pill border border-tone-line bg-tone-fill text-caption font-bold text-tone-ink sm:size-6.5 sm:text-nav"
                >
                  {verdict === "correct" ? "✓" : "✕"}
                </span>
                <span className="sr-only">{verdictLabels[verdict]}</span>
              </>
            )}
          </RadioGroup.Item>
        );
      })}
    </RadioGroup.Root>
  );
}
