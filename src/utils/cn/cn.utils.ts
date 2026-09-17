import { createCn } from "cn/config"

import {
  radiusTokens,
  shadowTokens,
  textTokens,
} from "@/lib/design-tokens/design-tokens"

export const cn = createCn({
  extend: {
    theme: {
      text: textTokens,
      radius: radiusTokens,
      shadow: shadowTokens,
      blur: ["glass", "header"],
      tracking: ["badge", "streak", "label"],
      spacing: ["gutter", "gutter-compact"],
    },
  },
})
