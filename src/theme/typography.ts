// Node24 Typography System
// Uses SF Pro (system font) for native iOS feel

import { Platform, TextStyle } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography: Record<string, TextStyle> = {
  // Large titles
  largeTitle: {
    fontFamily,
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.37,
  },
  
  // Titles
  title1: {
    fontFamily,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.36,
  },
  title2: {
    fontFamily,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.35,
  },
  title3: {
    fontFamily,
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.38,
  },
  
  // Headlines
  headline: {
    fontFamily,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
  },
  
  // Body
  body: {
    fontFamily,
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: -0.41,
  },
  bodyBold: {
    fontFamily,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
  },
  
  // Callout
  callout: {
    fontFamily,
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: -0.32,
  },
  
  // Subhead
  subhead: {
    fontFamily,
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: -0.24,
  },
  subheadBold: {
    fontFamily,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.24,
  },
  
  // Footnote
  footnote: {
    fontFamily,
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: -0.08,
  },
  
  // Caption
  caption1: {
    fontFamily,
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0,
  },
  caption2: {
    fontFamily,
    fontSize: 11,
    fontWeight: '400',
    letterSpacing: 0.07,
  },
  
  // Node specific
  nodeTitle: {
    fontFamily,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  nodeDuration: {
    fontFamily,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: -0.24,
  },
} as const;
