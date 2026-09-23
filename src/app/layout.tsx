import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import { InlineScript } from "@/features/theme/components/inline-script/inline-script";
import { ThemeSync } from "@/features/theme/components/theme-sync/theme-sync";
import { themeInitScript } from "@/features/theme/services/theme/theme";
import { cn } from "@/utils/cn/cn.utils";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Dev Interview Hub",
    template: "%s · Dev Interview Hub",
  },
  description:
    "Junior interview drills in CSS, HTML, JavaScript and TypeScript. Ten questions per round — under five minutes each.",
};

export const viewport: Viewport = {
  colorScheme: "dark light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(inter.variable, spaceGrotesk.variable)}
    >
      <head>
        <InlineScript html={themeInitScript} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-pill focus:bg-panel-top focus:px-4 focus:py-2 focus:text-nav focus:font-semibold focus:text-ink-primary"
        >
          Skip to content
        </a>
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}
