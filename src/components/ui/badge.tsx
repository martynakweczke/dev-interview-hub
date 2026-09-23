import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { toneClasses } from "@/lib/tones/tones";
import { cn } from "@/utils/cn/cn.utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-2.5 border border-tone-pill-line bg-tone-pill-fill whitespace-nowrap text-tone-ink",
  {
    variants: {
      tone: toneClasses,
      size: {
        xs: "rounded-pill px-2.5 py-1.25 text-pill-compact font-bold",
        sm: "rounded-pill px-2.75 py-1.25 text-pill font-bold",
        md: "rounded-pill px-3.5 py-1.75 text-pill-lg font-semibold",
        chip: "rounded-chip px-2.75 py-1.25 font-mono text-chip uppercase",
      },
      emphasis: {
        default: "",
        strong: "font-bold uppercase tracking-badge",
      },
    },
    compoundVariants: [
      { tone: "neutral", size: "sm", className: "font-semibold" },
      {
        tone: "neutral",
        size: "xs",
        className: "text-pill-xs font-semibold",
      },
    ],
    defaultVariants: {
      tone: "neutral",
      size: "sm",
      emphasis: "default",
    },
  }
);

function Badge({
  className,
  tone,
  size,
  emphasis,
  dot = false,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    dot?: boolean;
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ tone, size, emphasis }), className)}
      {...props}
    >
      {dot && (
        <span
          aria-hidden="true"
          data-slot="badge-dot"
          className="size-1.75 shrink-0 rounded-pill bg-tone-solid shadow-dot"
        />
      )}
      {asChild ? <Slot.Slottable>{children}</Slot.Slottable> : children}
    </Comp>
  );
}

export { Badge, badgeVariants };
