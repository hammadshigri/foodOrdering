import * as React from "react";
import Colors from "./Colors";
import { Sizes } from "./Sizes";
import { Fonts } from "./Fonts";

// Theme configuration for modern black & white UI
export const theme = {
  colors: Colors,
  sizes: Sizes,
  fonts: Fonts,

  // Modern shadows with elevation
  shadows: {
    sm: {
      shadowColor: Colors.light.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: Colors.light.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 3,
    },
    lg: {
      shadowColor: Colors.light.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 6,
    },
    xl: {
      shadowColor: Colors.light.shadow,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.35,
      shadowRadius: 8.0,
      elevation: 12,
    },
  },

  // Modern spacing scale
  spacing: {
    xs: Sizes.xs,
    sm: Sizes.sm,
    md: Sizes.md,
    lg: Sizes.lg,
    xl: Sizes.xl,
    xxl: Sizes.xxl,
    xxxl: Sizes.xxxl,
  },

  // Modern border radius scale
  borderRadius: {
    xs: Sizes.radius.xs,
    sm: Sizes.radius.sm,
    md: Sizes.radius.md,
    lg: Sizes.radius.lg,
    xl: Sizes.radius.xl,
    round: Sizes.radius.round,
    pill: Sizes.radius.pill,
  },

  // Modern component styles
  components: {
    // Card styles
    card: {
      backgroundColor: Colors.light.card,
      borderRadius: Sizes.radius.md,
      padding: Sizes.card.md,
      shadowColor: Colors.light.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 3,
    },

    // Button styles
    button: {
      primary: {
        backgroundColor: Colors.light.primary,
        borderRadius: Sizes.radius.lg,
        paddingHorizontal: Sizes.lg,
        paddingVertical: Sizes.md,
        alignItems: "center",
        justifyContent: "center",
      },
      secondary: {
        backgroundColor: Colors.light.surface,
        borderColor: Colors.light.border,
        borderWidth: 1,
        borderRadius: Sizes.radius.lg,
        paddingHorizontal: Sizes.lg,
        paddingVertical: Sizes.md,
        alignItems: "center",
        justifyContent: "center",
      },
      accent: {
        backgroundColor: Colors.light.accent,
        borderRadius: Sizes.radius.lg,
        paddingHorizontal: Sizes.lg,
        paddingVertical: Sizes.md,
        alignItems: "center",
        justifyContent: "center",
      },
    },

    // Input styles
    input: {
      backgroundColor: Colors.light.surface,
      borderColor: Colors.light.border,
      borderWidth: 1,
      borderRadius: Sizes.radius.md,
      paddingHorizontal: Sizes.md,
      paddingVertical: Sizes.sm,
      fontSize: Fonts.sizes.md,
    },

    // Product card styles
    productCard: {
      backgroundColor: Colors.light.card,
      borderRadius: Sizes.productCard.borderRadius,
      width: Sizes.productCard.width,
      height: Sizes.productCard.height,
      shadowColor: Colors.light.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 3,
    },

    // Category card styles
    categoryCard: {
      backgroundColor: Colors.light.card,
      borderRadius: Sizes.categoryCard.borderRadius,
      width: Sizes.categoryCard.width,
      height: Sizes.categoryCard.height,
      shadowColor: Colors.light.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
  },

  // Modern layout utilities
  layout: {
    // Flex utilities
    flex: {
      center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
      row: {
        flexDirection: "row",
        alignItems: "center",
      },
      column: {
        flexDirection: "column",
      },
    },

    // Spacing utilities
    margin: {
      xs: { margin: Sizes.xs },
      sm: { margin: Sizes.sm },
      md: { margin: Sizes.md },
      lg: { margin: Sizes.lg },
      xl: { margin: Sizes.xl },
    },

    padding: {
      xs: { padding: Sizes.xs },
      sm: { padding: Sizes.sm },
      md: { padding: Sizes.md },
      lg: { padding: Sizes.lg },
      xl: { padding: Sizes.xl },
    },
  },

  // Modern animation configurations
  animations: {
    // Transition durations
    duration: {
      fast: Sizes.animation.fast,
      normal: Sizes.animation.normal,
      slow: Sizes.animation.slow,
    },

    // Easing functions
    easing: {
      ease: "ease",
      easeIn: "ease-in",
      easeOut: "ease-out",
      easeInOut: "ease-in-out",
    },
  },
} as const;

export type Theme = typeof theme;

// Theme provider context
export const ThemeContext = React.createContext<Theme>(theme);

// Hook to use theme
export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
