import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn/cn.utils";

const surfaceVariants = cva("surface", {
  variants: {
    ambient: {
      home: "ambient-home",
      quiz: "ambient-quiz",
      results: "ambient-results",
    },
  },
  defaultVariants: {
    ambient: "home",
  },
});

function Surface({
  className,
  ambient,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof surfaceVariants>) {
  return (
    <div
      data-slot="surface"
      className={cn(surfaceVariants({ ambient }), className)}
      {...props}
    />
  );
}

export { Surface, surfaceVariants };
