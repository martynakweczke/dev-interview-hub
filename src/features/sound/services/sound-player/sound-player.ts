import { getSoundSnapshot } from "@/features/sound/services/sound-store/sound-store";

type Tone = {
  startHz: number;
  endHz: number;
  peakGain: number;
  attackSeconds: number;
  durationSeconds: number;
  delaySeconds: number;
};

const SELECT_SOUND: readonly Tone[] = [
  {
    startHz: 880,
    endHz: 1320,
    peakGain: 0.12,
    attackSeconds: 0.008,
    durationSeconds: 0.09,
    delaySeconds: 0,
  },
];

const CORRECT_SOUND: readonly Tone[] = [
  {
    startHz: 660,
    endHz: 660,
    peakGain: 0.12,
    attackSeconds: 0.008,
    durationSeconds: 0.1,
    delaySeconds: 0,
  },
  {
    startHz: 990,
    endHz: 990,
    peakGain: 0.12,
    attackSeconds: 0.008,
    durationSeconds: 0.22,
    delaySeconds: 0.09,
  },
];

const INCORRECT_SOUND: readonly Tone[] = [
  {
    startHz: 392,
    endHz: 294,
    peakGain: 0.16,
    attackSeconds: 0.012,
    durationSeconds: 0.26,
    delaySeconds: 0,
  },
];

const SILENCE = 0.0001;

let context: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined" || !("AudioContext" in window)) {
    return null;
  }

  context ??= new AudioContext();
  return context;
}

function play(tones: readonly Tone[]) {
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

    for (const tone of tones) {
      const start = audio.currentTime + tone.delaySeconds;
      const end = start + tone.durationSeconds;
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(tone.startHz, start);
      oscillator.frequency.exponentialRampToValueAtTime(tone.endHz, end);

      gain.gain.setValueAtTime(SILENCE, start);
      gain.gain.exponentialRampToValueAtTime(
        tone.peakGain,
        start + tone.attackSeconds
      );
      gain.gain.exponentialRampToValueAtTime(SILENCE, end);

      oscillator.connect(gain);
      gain.connect(audio.destination);
      oscillator.start(start);
      oscillator.stop(end);
    }
  } catch {}
}

export function playSelectSound() {
  play(SELECT_SOUND);
}

export function playCorrectSound() {
  play(CORRECT_SOUND);
}

export function playIncorrectSound() {
  play(INCORRECT_SOUND);
}
