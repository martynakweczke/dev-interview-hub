"use client";

import { useMemo, useSyncExternalStore } from "react";

import { getStartOfToday } from "@/utils/date/date.utils";

const CHECK_INTERVAL_MS = 60 * 1000;

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, CHECK_INTERVAL_MS);
  return () => window.clearInterval(id);
}

function getServerToday() {
  return 0;
}

export function useToday(): Date {
  const today = useSyncExternalStore(
    subscribe,
    getStartOfToday,
    getServerToday
  );
  return useMemo(() => new Date(today), [today]);
}
