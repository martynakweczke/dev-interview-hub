"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Toggle as TogglePrimitive } from "radix-ui";

import { cn } from "@/utils/cn/cn.utils";

const toggleVariants = cva(
  "group/toggle relative inline-grid shrink-0 place-items-center rounded-pill text-ink-muted transition-colors duration-160 ease-ui hovered:text-ink-primary disabled:cursor-not-allowed disabled:text-ink-disabled",
  {
    variants: {
      variant: {
        default:
          "data-[state=on]:bg-toggle-active data-[state=on]:text-ink-primary",
        theme:
          "[font-variant-emoji:text] theme-lit:bg-toggle-active theme-lit:text-ink-primary",
      },
      size: {
        default:
          "size-7 text-toggle after:absolute after:-inset-x-px after:-inset-y-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
