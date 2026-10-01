"use client";

import * as React from "react";

import { OPTION_IDS, type OptionId } from "@/lib/questions/types";

const EDITABLE = "input, textarea, select, [contenteditable]";
const INTERACTIVE = `a, button, ${EDITABLE}`;

function isInside(target: EventTarget | null, selector: string): boolean {
  return target instanceof Element && target.closest(selector) !== null;
}

function getOptionId(key: string): OptionId | null {
  const byLetter = OPTION_IDS.find((id) => id === key.toLowerCase());
  return byLetter ?? OPTION_IDS[Number(key) - 1] ?? null;
}

export function useAnswerShortcuts({
  onSelect,
  onConfirm,
}: {
  onSelect: (optionId: OptionId) => void;
  onConfirm: () => void;
}) {
  const onKeyDown = React.useEffectEvent((event: KeyboardEvent) => {
    if (
      event.defaultPrevented ||
      event.repeat ||
      event.metaKey ||
      event.ctrlKey ||
      event.altKey
    ) {
      return;
    }

    if (event.key === "Enter") {
      if (!isInside(event.target, INTERACTIVE)) {
        event.preventDefault();
        onConfirm();
      }

      return;
    }

    const optionId = getOptionId(event.key);

    if (optionId !== null && !isInside(event.target, EDITABLE)) {
      onSelect(optionId);
    }
  });

  React.useEffect(() => {
    function listener(event: KeyboardEvent) {
      onKeyDown(event);
    }

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);
}
