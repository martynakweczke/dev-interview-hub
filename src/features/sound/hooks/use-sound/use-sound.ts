"use client";

import { useSyncExternalStore } from "react";

import {
  getServerSoundSnapshot,
  getSoundSnapshot,
  setSoundEnabled,
  subscribeToSound,
} from "@/features/sound/services/sound-store/sound-store";

export function useSound() {
  const enabled = useSyncExternalStore(
    subscribeToSound,
    getSoundSnapshot,
    getServerSoundSnapshot
  );
  return { enabled, setEnabled: setSoundEnabled };
}
