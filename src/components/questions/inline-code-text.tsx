import * as React from "react"
import { cva } from "class-variance-authority"

import { parseInlineCode } from "@/lib/inline-code"


const codeVariants = cva("tone-js font-mono", {
  variants: {
    variant: {
      prompt:
        "rounded-code-compact border border-code-line bg-code-fill px-1.75 py-px text-code-prompt-compact text-tone-ink box-decoration-clone sm:rounded-code sm:px-2.5 sm:py-0.5 sm:text-code-prompt",
      option:
        "text-code-option-compact sm:text-code-option sm:text-ink-tertiary group-data-[state=checked]/answer:text-tone-ink",
      row: "text-code-row text-ink-tertiary",
      cell: "text-code-cell",
    },
  },
})

type InlineCodeTextProps = {
  text: string
  variant: "prompt" | "option" | "row" | "cell"
}

export function InlineCodeText({ text, variant }: InlineCodeTextProps) {
  return (
    <>
      {parseInlineCode(text).map((segment, index) =>
        segment.kind === "code" ? (
          <code key={index} className={codeVariants({ variant })}>
            {segment.value}
          </code>
        ) : (
          <React.Fragment key={index}>{segment.value}</React.Fragment>
        )
      )}
    </>
  )
}
