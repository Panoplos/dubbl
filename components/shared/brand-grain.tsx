"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

// Shader colors must be literal hex — CSS variables don't reach WebGL.
const PALETTES = {
  charcoal: {
    colors: ["#5c5c59", "#41413f", "#2c2c2b", "#1d1d1c", "#121211", "#1d1d1c", "#41413f"],
    colorBack: "#232322",
  },
  silver: {
    colors: ["#ffffff", "#f4f4f2", "#e6e6e3", "#d4d4d0", "#c0c0bb", "#d4d4d0", "#ededeb"],
    colorBack: "#dcdcd8",
  },
};

/**
 * Animated monochrome grain backdrop. Fills its (relatively positioned) parent.
 *
 * - `charcoal`: dark surface, use with white foreground content
 * - `silver`: light surface, use with dark foreground content
 * - `adaptive`: silver in light mode, charcoal in dark mode
 */
export function BrandGrain({
  tone = "adaptive",
  className,
}: {
  tone?: "charcoal" | "silver" | "adaptive";
  className?: string;
}) {
  const { resolvedTheme } = useTheme();
  const palette =
    PALETTES[
      tone === "adaptive"
        ? resolvedTheme === "dark"
          ? "charcoal"
          : "silver"
        : tone
    ];

  return (
    <GrainGradient
      className={cn("pointer-events-none !absolute !inset-0 !rounded-none", className)}
      width="100%"
      height="100%"
      colors={palette.colors}
      colorBack={palette.colorBack}
      softness={1}
      intensity={0.8}
      noise={0.9}
      shape="wave"
      scale={3.5}
      speed={0.2}
    />
  );
}
