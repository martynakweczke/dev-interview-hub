import { describe, expect, it } from "vitest";

import {
  parseSoundEnabled,
  serializeSoundEnabled,
} from "@/features/sound/services/sound/sound";

describe("parseSoundEnabled", () => {
  it("reads the stored choice", () => {
    expect(parseSoundEnabled("on")).toBe(true);
    expect(parseSoundEnabled("off")).toBe(false);
  });

  it("defaults to on for anything else", () => {
    expect(parseSoundEnabled(null)).toBe(true);
    expect(parseSoundEnabled("loud")).toBe(true);
  });

  it("round-trips through serializeSoundEnabled", () => {
    expect(parseSoundEnabled(serializeSoundEnabled(false))).toBe(false);
    expect(parseSoundEnabled(serializeSoundEnabled(true))).toBe(true);
  });
});
