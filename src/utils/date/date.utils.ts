const DAY_MS = 24 * 60 * 60 * 1000;

export function startOfDay(date: Date): number {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).getTime();
}

export function getStartOfToday(): number {
  return startOfDay(new Date());
}

export function calendarDaysBetween(from: Date, to: Date): number {
  return Math.round((startOfDay(to) - startOfDay(from)) / DAY_MS);
}

export function isDateString(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

export function formatDaysAgo(daysAgo: number): string {
  if (daysAgo === 0) {
    return "today";
  }

  if (daysAgo === 1) {
    return "yesterday";
  }

  return `${daysAgo} days ago`;
}

function splitDuration(durationMs: number): {
  minutes: number;
  seconds: number;
} {
  const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
  return { minutes: Math.floor(totalSeconds / 60), seconds: totalSeconds % 60 };
}

export function formatDuration(durationMs: number): string {
  const { minutes, seconds } = splitDuration(durationMs);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function formatDurationLabel(durationMs: number): string {
  const { minutes, seconds } = splitDuration(durationMs);
  const plural = (count: number, unit: string) =>
    `${count} ${unit}${count === 1 ? "" : "s"}`;

  if (minutes === 0) {
    return plural(seconds, "second");
  }

  if (seconds === 0) {
    return plural(minutes, "minute");
  }

  return `${plural(minutes, "minute")} ${plural(seconds, "second")}`;
}
