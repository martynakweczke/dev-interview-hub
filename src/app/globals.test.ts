import { readFileSync } from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"

import {
  radiusTokens,
  shadowTokens,
  textTokens,
} from "@/lib/design-tokens/design-tokens"

const css = readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8")

function blockAfter(marker: string) {
  const start = css.indexOf(marker)
  expect(start, `missing block: ${marker}`).toBeGreaterThan(-1)
  const open = css.indexOf("{", start)
  return css.slice(open + 1, css.indexOf("\n}", open))
}

function declarations(block: string) {
  return new Map(
    [...block.matchAll(/^\s*(--[\w-]+):\s*([^;]+);/gm)].map((match) => [
      match[1],
      match[2].trim(),
    ])
  )
}

const dark = declarations(blockAfter(':root,\n[data-theme="dark"]'))
const light = declarations(blockAfter('[data-theme="light"],\n:root:not'))
const theme = blockAfter("@theme {") + blockAfter("@theme inline {")

function themeKeys(namespace: string) {
  return [...theme.matchAll(new RegExp(`^\\s*--${namespace}-([\\w-]+?):`, "gm"))]
    .map((match) => match[1])
    .filter((key) => !key.includes("--"))
}

describe("theme tokens", () => {
  it("gives every dark token exactly one light counterpart", () => {
    expect(dark.size).toBeGreaterThan(100)
    expect([...light.keys()].sort()).toEqual([...dark.keys()].sort())
  })

  it("encodes the README surface & ink tables in both themes", () => {
    const expected: Record<string, [string, string]> = {
      "--bg-root": ["#06080f", "#eef1f7"],
      "--panel-top": ["#0a0e1a", "#ffffff"],
      "--panel-bottom": ["#070a12", "#f2f5fb"],
      "--glass": ["rgba(255, 255, 255, 0.045)", "rgba(255, 255, 255, 0.78)"],
      "--glass-strong": ["rgba(255, 255, 255, 0.05)", "rgba(255, 255, 255, 0.72)"],
      "--glass-hover": ["rgba(255, 255, 255, 0.07)", "#ffffff"],
      "--line": ["rgba(255, 255, 255, 0.09)", "rgba(15, 23, 42, 0.09)"],
      "--ink-primary": ["#f9fafb", "#0f172a"],
      "--ink-heading-alt": ["#f3f4f6", "#111827"],
      "--ink-secondary": ["#e5e7eb", "#1f2937"],
      "--ink-tertiary": ["#d1d5db", "#334155"],
      "--ink-muted": ["#9ca3af", "#5b6577"],
      "--ink-faint": ["#a1a8b5", "#5d6c81"],
      "--ink-faintest": ["#8b93a1", "#6b7488"],
      "--ink-disabled": ["#9098a6", "#6b7488"],
      "--selected-line": ["#fbbf24", "#d97706"],
      "--css-ink": ["#7dd3fc", "#0369a1"],
      "--html-ink": ["#fdba74", "#bc3f0c"],
      "--js-ink": ["#fcd34d", "#8a5406"],
      "--ts-ink": ["#93c5fd", "#1d4ed8"],
      "--correct-solid": ["#34d399", "#059669"],
      "--incorrect-solid": ["#f43f5e", "#e11d48"],
    }

    for (const [token, [darkValue, lightValue]] of Object.entries(expected)) {
      expect(dark.get(token), token).toBe(darkValue)
      expect(light.get(token), token).toBe(lightValue)
    }
  })
})

describe("class merging config", () => {
  it.each([
    ["text", textTokens],
    ["radius", radiusTokens],
    ["shadow", shadowTokens],
  ])("knows every --%s-* token", (namespace, configured) => {
    expect([...configured].sort()).toEqual(themeKeys(namespace).sort())
  })
})
