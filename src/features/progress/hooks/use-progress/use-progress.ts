"use client";

import { useSyncExternalStore } from "react";

import {
  createEmptyProgress,
  type ProgressSnapshot,
} from "@/features/progress/services/progress/progress";
import {
  getProgressSnapshot,
  getServerProgressSnapshot,
  subscribeToProgress,
} from "@/features/progress/services/progress-store/progress-store";

const emptyProgress = createEmptyProgress();

export function useProgress(): ProgressSnapshot {
  const snapshot = useSyncExternalStore(
    subscribeToProgress,
    getProgressSnapshot,
    getServerProgressSnapshot
  );
  return snapshot ?? emptyProgress;
}
