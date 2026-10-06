import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SoundToggle } from "@/features/sound/components/sound-toggle/sound-toggle";
import { SOUND_STORAGE_KEY } from "@/features/sound/services/sound/sound";
import { playSelectSound } from "@/features/sound/services/sound-player/sound-player";

const start = vi.fn();

class FakeAudioContext {
  state = "running";
  currentTime = 0;
  destination = {};

  createOscillator() {
    return {
      type: "sine",
      frequency: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      start,
      stop: vi.fn(),
    };
  }

  createGain() {
    return {
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    };
  }
}

const toggle = () => screen.getByRole("button", { name: "Answer sounds" });

describe("SoundToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    start.mockReset();
    vi.stubGlobal("AudioContext", FakeAudioContext);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("is on by default", () => {
    render(<SoundToggle />);

    expect(toggle()).toHaveAttribute("aria-pressed", "true");
  });

  it("mutes, persists the choice, and stays silent", async () => {
    const user = userEvent.setup();
    render(<SoundToggle />);

    await user.click(toggle());

    expect(localStorage.getItem(SOUND_STORAGE_KEY)).toBe("off");
    expect(toggle()).toHaveAttribute("aria-pressed", "false");

    playSelectSound();
    expect(start).not.toHaveBeenCalled();
  });

  it("previews the sound when switched back on", async () => {
    localStorage.setItem(SOUND_STORAGE_KEY, "off");
    const user = userEvent.setup();
    render(<SoundToggle />);

    expect(toggle()).toHaveAttribute("aria-pressed", "false");

    await user.click(toggle());

    expect(localStorage.getItem(SOUND_STORAGE_KEY)).toBe("on");
    expect(start).toHaveBeenCalledTimes(1);
  });
});
