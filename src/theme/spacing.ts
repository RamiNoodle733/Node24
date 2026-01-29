// Node24 Spacing System
// Consistent spacing for clean, purposeful layouts

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const layout = {
  // Screen padding
  screenPaddingHorizontal: 16,
  screenPaddingVertical: 16,
  
  // Node dimensions
  nodeMinHeight: 60,
  nodeRadius: 0, // Sharp edges - no rounding
  nodePaddingHorizontal: 16,
  nodePaddingVertical: 12,
  
  // Header
  headerHeight: 56,
  
  // Bottom bar
  bottomBarHeight: 80,
  
  // Divider
  dividerHeight: 1,
  
  // Hit areas (for touch targets)
  minTouchTarget: 44,
} as const;
