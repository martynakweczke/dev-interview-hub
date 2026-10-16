class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

export function installResizeObserver() {
  globalThis.ResizeObserver ??= ResizeObserverStub;
}
