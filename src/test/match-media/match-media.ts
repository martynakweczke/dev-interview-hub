import { vi } from "vitest";

type Listener = (event: MediaQueryListEvent) => void;

export function installMatchMedia(prefersDark: boolean) {
  const listeners = new Set<Listener>();
  let matches = prefersDark;

  window.matchMedia = vi.fn((query: string) => ({
    get matches() {
      return matches;
    },
    media: query,
    onchange: null,
    addEventListener: (_type: string, listener: Listener) => {
      listeners.add(listener);
    },
    removeEventListener: (_type: string, listener: Listener) => {
      listeners.delete(listener);
    },
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;

  return {
    setPrefersDark(next: boolean) {
      matches = next;
      listeners.forEach((listener) =>
        listener({ matches: next } as MediaQueryListEvent)
      );
    },
  };
}
