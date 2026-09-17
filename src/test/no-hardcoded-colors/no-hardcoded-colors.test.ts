import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"

import { expect, it } from "vitest"

const SRC = path.join(process.cwd(), "src")
const COLOR_LITERAL =
  /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color-mix)\(/i

const CONTENT_DIR = path.join("lib", "questions") + path.sep

const sourceFiles = readdirSync(SRC, { recursive: true, encoding: "utf8" })
  .filter((file) => /\.tsx?$/.test(file) && !/\.test\.tsx?$/.test(file))
  .filter((file) => !file.startsWith(CONTENT_DIR))
  .sort()

it("finds component sources to scan", () => {
  expect(sourceFiles.length).toBeGreaterThan(10)
})

it.each(sourceFiles)("%s uses tokens, not color literals", (file) => {
  const source = readFileSync(path.join(SRC, file), "utf8")
  expect(source.match(COLOR_LITERAL)?.[0]).toBeUndefined()
})
