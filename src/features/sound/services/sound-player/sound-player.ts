import { getSoundSnapshot } from "@/features/sound/services/sound-store/sound-store";

const SELECT_SOUND = {
  startHz: 880,
  endHz: 1320,
  peakGain: 0.12,
  attackSeconds: 0.008,
  durationSeconds: 0.09,
} as const;

const SILENCE = 0.0001;

let context: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined" || !("AudioContext" in window)) {
    return null;
  }

  context ??= new AudioContext();
  return context;
}

export function playSelectSound() {
  if (!getSoundSnapshot()) {
    return;
  }

  try {
    const audio = getContext();

    if (audio === null) {
      return;
    }

    if (audio.state === "suspended") {
      void audio.resume();
    }

    const { startHz, endHz, peakGain, attackSeconds, durationSeconds } =
      SELECT_SOUND;
    const now = audio.currentTime;
    const end = now + durationSeconds;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(startHz, now);
    oscillator.frequency.exponentialRampToValueAtTime(endHz, end);

    gain.gain.setValueAtTime(SILENCE, now);
    gain.gain.exponentialRampToValueAtTime(peakGain, now + attackSeconds);
    gain.gain.exponentialRampToValueAtTime(SILENCE, end);

    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start(now);
    oscillator.stop(end);
  } catch {}
}
