import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

import { installResizeObserver } from "@/test/resize-observer/resize-observer";

installResizeObserver();

afterEach(() => {
  cleanup();
});
