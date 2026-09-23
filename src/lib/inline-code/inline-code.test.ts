import { describe, expect, it } from "vitest";

import { parseInlineCode } from "@/lib/inline-code/inline-code";

describe("parseInlineCode", () => {
  it("returns plain text as a single segment", () => {
    expect(parseInlineCode("What is a closure?")).toEqual([
      { kind: "text", value: "What is a closure?" },
    ]);
  });

  it("splits backtick-delimited code spans", () => {
    expect(parseInlineCode("What does `typeof null` evaluate to?")).toEqual([
      { kind: "text", value: "What does " },
      { kind: "code", value: "typeof null" },
      { kind: "text", value: " evaluate to?" },
    ]);
  });

  it("handles code at the edges and several spans", () => {
    expect(parseInlineCode("`===` vs `==`")).toEqual([
      { kind: "code", value: "===" },
      { kind: "text", value: " vs " },
      { kind: "code", value: "==" },
    ]);
  });

  it("keeps quotes inside code spans", () => {
    expect(parseInlineCode('`"5" + 3`')).toEqual([
      { kind: "code", value: '"5" + 3' },
    ]);
  });

  it("treats unbalanced backticks as plain text", () => {
    expect(parseInlineCode("a `broken span")).toEqual([
      { kind: "text", value: "a `broken span" },
    ]);
  });
});
