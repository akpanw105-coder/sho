/**
 * SHO. Dark Editorial Footwear Theme System
 * Faithful adherence to Google Stitch dark_editorial_footwear DESIGN.md
 */

export const ShoColors = {
  // Nocturnal Pine Canvas & Surface Architecture
  canvas: '#061310',
  surface: '#081613',
  surfaceDim: '#081613',
  surfaceBright: '#2e3c38',
  surfaceContainerLowest: '#04110e',
  surfaceContainerLow: '#111e1b',
  surfaceContainer: '#15221f',
  surfaceContainerHigh: '#1f2d29',
  surfaceContainerHighest: '#2a3834',

  // Hairline Structural Borders
  borderSubtle: '#1F302B',
  borderElevated: '#263832',
  borderFocus: '#B7A696',
  outline: '#959087',
  outlineVariant: '#49473f',

  // Text & Editorial Accents
  onSurface: '#d6e6e0',
  onSurfaceVariant: '#cbc6bb',
  textMuted: '#A7B0AA',
  textIvory: '#F4F0E8',
  primary: '#ffffff',
  onPrimary: '#333025',

  // Primary Action Cream / Alabaster
  primaryFixed: '#e9e2d1',
  primaryFixedDim: '#ccc6b6',
  onPrimaryFixed: '#1e1c11',
  onPrimaryFixedVariant: '#4a473a',

  // Secondary Warm Stone & Taupe
  secondary: '#d6c3b3',
  secondaryContainer: '#53473a',
  secondaryFixed: '#f2dfce',
  onSecondaryFixed: '#231a0f',
  onSecondaryContainer: '#c7b5a5',

  // Tertiary Fresh Olive Green / Sage
  tertiary: '#ffffff',
  tertiaryContainer: '#d3e7df',
  onTertiary: '#23342f',
  tertiaryFixed: '#d3e7df',
  tertiaryFixedDim: '#b7cbc3',

  // Functional Status
  error: '#ffb4ab',
  errorContainer: '#93000a',
  onError: '#690005',
  success: '#34d399',
  warning: '#fbbf24',
} as const;

export const ShoRadius = {
  sm: 8,
  default: 16,
  md: 20,
  lg: 24,
  xl: 32,
  full: 9999,
} as const;

export const ShoSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 36,
  xxl: 56,
  margin: 20,
} as const;
