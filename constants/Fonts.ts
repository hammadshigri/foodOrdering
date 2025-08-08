// Typography constants for modern UI
export const Fonts = {
  // Font families - Modern sans-serif
  family: {
    regular: "Inter-Regular",
    medium: "Inter-Medium",
    semiBold: "Inter-SemiBold",
    bold: "Inter-Bold",
    light: "Inter-Light",
  },

  // Font sizes - Modern scale
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 48,
  },

  // Font weights - Modern weights
  weights: {
    light: "300",
    regular: "400",
    medium: "500",
    semiBold: "600",
    bold: "700",
    extraBold: "800",
  },

  // Line heights - Modern spacing
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 40,
    display: 56,
  },

  // Letter spacing - Modern spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    extraWide: 2,
  },

  // Text styles for common use cases
  styles: {
    // Headings
    h1: {
      fontSize: 32,
      fontWeight: "700",
      lineHeight: 40,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 24,
      fontWeight: "600",
      lineHeight: 32,
      letterSpacing: -0.25,
    },
    h3: {
      fontSize: 20,
      fontWeight: "600",
      lineHeight: 28,
      letterSpacing: 0,
    },
    h4: {
      fontSize: 18,
      fontWeight: "500",
      lineHeight: 24,
      letterSpacing: 0,
    },

    // Body text
    body: {
      fontSize: 16,
      fontWeight: "400",
      lineHeight: 24,
      letterSpacing: 0,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: "400",
      lineHeight: 20,
      letterSpacing: 0,
    },

    // Captions
    caption: {
      fontSize: 12,
      fontWeight: "400",
      lineHeight: 16,
      letterSpacing: 0.25,
    },

    // Buttons
    button: {
      fontSize: 16,
      fontWeight: "600",
      lineHeight: 24,
      letterSpacing: 0.5,
    },
    buttonSmall: {
      fontSize: 14,
      fontWeight: "600",
      lineHeight: 20,
      letterSpacing: 0.25,
    },
  },
} as const;

export type Font = typeof Fonts;
