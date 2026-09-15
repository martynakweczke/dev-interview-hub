export type InlineSegment = {
  kind: "text" | "code"
  value: string
}

export function parseInlineCode(text: string): InlineSegment[] {
  const parts = text.split("`")
  if (parts.length % 2 === 0) return [{ kind: "text", value: text }]

  return parts.flatMap((value, index): InlineSegment[] =>
    value === "" ? [] : [{ kind: index % 2 === 1 ? "code" : "text", value }]
  )
}
