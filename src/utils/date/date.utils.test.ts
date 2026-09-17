import { describe, expect, it } from "vitest"

import {
  calendarDaysBetween,
  formatDaysAgo,
  formatDuration,
  formatDurationLabel,
  isDateString,
  startOfDay,
} from "@/utils/date/date.utils"

const at = (date: number, hour = 10) => new Date(2026, 8, date, hour)

describe("startOfDay", () => {
  it("drops the time of day", () => {
    expect(startOfDay(at(12, 23))).toBe(at(12, 0).getTime())
  })
})

describe("calendarDaysBetween", () => {
  it.each([
    [at(12, 23), at(13, 1), 1],
    [at(12, 1), at(12, 23), 0],
    [at(13), at(12), -1],
    [at(1), at(30), 29],
  ])("counts calendar days, not elapsed hours", (from, to, expected) => {
    expect(calendarDaysBetween(from, to)).toBe(expected)
  })
})

describe("isDateString", () => {
  it.each([
    [at(12).toISOString(), true],
    ["2026-09-12", true],
    ["not a date", false],
    [null, false],
    [Date.now(), false],
  ])("accepts %s as a date string: %s", (value, expected) => {
    expect(isDateString(value)).toBe(expected)
  })
})

describe("formatDaysAgo", () => {
  it.each([
    [0, "today"],
    [1, "yesterday"],
    [2, "2 days ago"],
  ])("formats %i as %s", (daysAgo, expected) => {
    expect(formatDaysAgo(daysAgo)).toBe(expected)
  })
})

describe("formatDuration", () => {
  it.each([
    [0, "0:00"],
    [999, "0:00"],
    [9_000, "0:09"],
    [252_000, "4:12"],
    [252_999, "4:12"],
    [3_725_000, "62:05"],
    [-5, "0:00"],
  ])("formats %i ms as %s", (ms, expected) => {
    expect(formatDuration(ms)).toBe(expected)
  })

  it.each([
    [1_000, "1 second"],
    [45_000, "45 seconds"],
    [60_000, "1 minute"],
    [252_000, "4 minutes 12 seconds"],
    [61_000, "1 minute 1 second"],
  ])("labels %i ms as %s", (ms, expected) => {
    expect(formatDurationLabel(ms)).toBe(expected)
  })
})
