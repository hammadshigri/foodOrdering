const tintColorLight = "#000000"; // Pure black for light theme
const tintColorDark = "#FFFFFF"; // Pure white for dark theme

export default {
  light: {
    // Primary colors
    primary: "#000000", // Pure black
    secondary: "#FFFFFF", // Pure white
    accent: "#FF6B6B", // Red accent for CTAs

    // Background colors
    background: "#FFFFFF",
    surface: "#F8F9FA",
    card: "#FFFFFF",

    // Text colors
    text: "#000000",
    textSecondary: "#6C757D",
    textMuted: "#ADB5BD",

    // Border colors
    border: "#E9ECEF",
    borderLight: "#F1F3F4",

    // Status colors
    success: "#28A745",
    warning: "#FFC107",
    error: "#DC3545",
    info: "#17A2B8",

    // Special colors
    overlay: "rgba(0, 0, 0, 0.5)",
    shadow: "rgba(0, 0, 0, 0.1)",

    // Navigation colors
    tint: tintColorLight,
    tabIconDefault: "#6C757D",
    tabIconSelected: tintColorLight,
  },
  dark: {
    // Primary colors
    primary: "#FFFFFF", // Pure white
    secondary: "#000000", // Pure black
    accent: "#FF6B6B", // Red accent for CTAs

    // Background colors
    background: "#000000",
    surface: "#1A1A1A",
    card: "#2D2D2D",

    // Text colors
    text: "#FFFFFF",
    textSecondary: "#B0B0B0",
    textMuted: "#808080",

    // Border colors
    border: "#404040",
    borderLight: "#333333",

    // Status colors
    success: "#28A745",
    warning: "#FFC107",
    error: "#DC3545",
    info: "#17A2B8",

    // Special colors
    overlay: "rgba(0, 0, 0, 0.7)",
    shadow: "rgba(0, 0, 0, 0.3)",

    // Navigation colors
    tint: tintColorDark,
    tabIconDefault: "#808080",
    tabIconSelected: tintColorDark,
  },
};
