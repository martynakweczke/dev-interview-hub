"use client";

import type { ComponentProps } from "react";
import { Label as LabelPrimitive } from "radix-ui";

import { cn } from "@/utils/cn/cn.utils";

function Label({
  className,
  ...props
}: ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "text-meta font-medium text-ink-secondary select-none peer-disabled:cursor-not-allowed peer-disabled:text-ink-disabled",
        className
      )}
      {...props}
    />
  );
}

export { Label };
