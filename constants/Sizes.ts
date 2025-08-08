// Spacing and sizing constants for modern UI
export const Sizes = {
  // Spacing scale - Modern 8px grid system
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,

  // Border radius - Modern rounded corners
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 50,
    pill: 9999,
  },

  // Font sizes - Modern typography scale
  font: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 48,
  },

  // Icon sizes - Modern icon scale
  icon: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  // Button heights - Modern button sizing
  button: {
    sm: 36,
    md: 44,
    lg: 52,
    xl: 60,
  },

  // Input heights - Modern input sizing
  input: {
    sm: 36,
    md: 44,
    lg: 52,
    xl: 60,
  },

  // Card padding - Modern card spacing
  card: {
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
  },

  // Screen padding - Modern screen margins
  screen: {
    horizontal: 16,
    vertical: 20,
    horizontalLarge: 24,
    verticalLarge: 32,
  },

  // Tab bar - Modern navigation
  tabBar: {
    height: 60,
    iconSize: 24,
    labelSize: 12,
  },

  // Header - Modern app bar
  header: {
    height: 56,
    heightLarge: 64,
  },

  // Product card - Modern product display
  productCard: {
    width: 160,
    height: 240,
    imageHeight: 180,
    borderRadius: 12,
  },

  // Category card - Modern category display
  categoryCard: {
    width: 120,
    height: 160,
    borderRadius: 16,
  },

  // Avatar sizes - Modern profile images
  avatar: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
    xxl: 80,
  },

  // Badge sizes - Modern status indicators
  badge: {
    sm: 16,
    md: 20,
    lg: 24,
  },

  // Divider - Modern separators
  divider: {
    height: 1,
    heightThick: 2,
  },

  // Shadow - Modern elevation
  shadow: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 16,
  },

  // Animation - Modern transitions
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
  },

  // Z-index - Modern layering
  zIndex: {
    base: 0,
    card: 1,
    modal: 10,
    overlay: 100,
    tooltip: 200,
    toast: 300,
  },
} as const;

export type Size = typeof Sizes;
