export const SOUND_STORAGE_KEY = "sound";

export const DEFAULT_SOUND_ENABLED = true;

export function parseSoundEnabled(value: unknown): boolean {
  if (value === "on") {
    return true;
  }

  if (value === "off") {
    return false;
  }

  return DEFAULT_SOUND_ENABLED;
}

export function serializeSoundEnabled(enabled: boolean): string {
  return enabled ? "on" : "off";
}
