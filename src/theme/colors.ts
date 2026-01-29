// Node24 Color System
// Clean, sophisticated, iOS-native feel

export const colors = {
  // Base colors (Dark mode first)
  background: '#000000',
  surface: '#1C1C1E',
  surfaceElevated: '#2C2C2E',
  
  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#8E8E93',
  textTertiary: '#48484A',
  
  // Borders & Dividers
  border: '#38383A',
  divider: '#2C2C2E',
  
  // Filler node
  fillerBackground: '#1C1C1E',
  fillerPattern: '#2C2C2E',
  
  // Accent colors for nodes (user-selectable)
  nodeColors: {
    blue: '#0A84FF',
    green: '#30D158',
    orange: '#FF9F0A',
    red: '#FF453A',
    purple: '#BF5AF2',
    pink: '#FF375F',
    teal: '#64D2FF',
    yellow: '#FFD60A',
    indigo: '#5E5CE6',
    mint: '#66D4CF',
  },
  
  // System
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  
  // Interactive
  buttonPrimary: '#0A84FF',
  buttonSecondary: '#2C2C2E',
} as const;

export type NodeColorKey = keyof typeof colors.nodeColors;

export const nodeColorKeys: NodeColorKey[] = [
  'blue',
  'green',
  'orange',
  'red',
  'purple',
  'pink',
  'teal',
  'yellow',
  'indigo',
  'mint',
];
