import {
  DEFAULT_SOUND_ENABLED,
  parseSoundEnabled,
  serializeSoundEnabled,
  SOUND_STORAGE_KEY,
} from "@/features/sound/services/sound/sound";

const listeners = new Set<() => void>();

export function getSoundSnapshot(): boolean {
  try {
    return parseSoundEnabled(window.localStorage.getItem(SOUND_STORAGE_KEY));
  } catch {
    return DEFAULT_SOUND_ENABLED;
  }
}

export function getServerSoundSnapshot(): boolean {
  return DEFAULT_SOUND_ENABLED;
}

function sync() {
  listeners.forEach((listener) => listener());
}

function onStorage(event: StorageEvent) {
  if (event.key === null || event.key === SOUND_STORAGE_KEY) {
    sync();
  }
}

export function setSoundEnabled(enabled: boolean) {
  try {
    window.localStorage.setItem(
      SOUND_STORAGE_KEY,
      serializeSoundEnabled(enabled)
    );
  } catch {}

  sync();
}

export function subscribeToSound(listener: () => void) {
  if (listeners.size === 0) {
    window.addEventListener("storage", onStorage);
  }

  listeners.add(listener);

  return () => {
    listeners.delete(listener);

    if (listeners.size === 0) {
      window.removeEventListener("storage", onStorage);
    }
  };
}
