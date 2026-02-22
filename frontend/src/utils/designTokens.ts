/**
 * AutoGrade Design System Tokens
 * Centralized access to CSS variables defined in theme.css
 * Use these constants instead of hardcoded values for consistency
 */

export const colors = {
  // Primary Colors
  primary: 'var(--color-primary)',           // #6B0000
  primaryHover: 'var(--color-primary-hover)', // #8B1A1A
  primaryBg: 'var(--color-primary-bg)',       // #F5EDED
  primaryLight: 'var(--color-primary-light)', // #FCEAEA
  
  // Gold Accent
  goldAccent: 'var(--color-gold-accent)',     // #C9A84C
  
  // Text Colors
  textDark: 'var(--color-text-dark)',         // #2D2D2D
  textMid: 'var(--color-text-mid)',           // #595959
  textLight: 'var(--color-text-light)',       // #8A8A8A
  
  // Border & Backgrounds
  border: 'var(--color-border)',              // #D9D9D9
  white: 'var(--color-white)',                // #FFFFFF
  
  // Status Colors
  success: 'var(--color-success)',            // #2D6A2D
  warning: 'var(--color-warning)',            // #8A5700
  error: 'var(--color-error)',                // #8B0000
  info: 'var(--color-info)',                  // #1A4D7A
} as const;

export const shadows = {
  card: 'var(--shadow-card)',
  dropdown: 'var(--shadow-dropdown)',
  modal: 'var(--shadow-modal)',
} as const;

export const radius = {
  sm: 'var(--radius-sm)',     // 4px
  md: 'var(--radius-md)',     // 8px
  lg: 'var(--radius-lg)',     // 12px
  xl: 'var(--radius-xl)',     // 16px
} as const;

export const spacing = {
  1: 'var(--space-1)',   // 4px
  2: 'var(--space-2)',   // 8px
  3: 'var(--space-3)',   // 12px
  4: 'var(--space-4)',   // 16px
  5: 'var(--space-5)',   // 20px
  6: 'var(--space-6)',   // 24px
  8: 'var(--space-8)',   // 32px
  10: 'var(--space-10)', // 40px
  12: 'var(--space-12)', // 48px
} as const;

export const fontSize = {
  11: 'var(--font-size-11)', // Micro labels, table headers
  12: 'var(--font-size-12)', // Helper text, metadata
  13: 'var(--font-size-13)', // Form labels, secondary UI
  14: 'var(--font-size-14)', // Body text (base), buttons
  16: 'var(--font-size-16)', // Section headers, emphasized text
  18: 'var(--font-size-18)', // Panel titles, modal headers
  22: 'var(--font-size-22)', // Page subheadings
  28: 'var(--font-size-28)', // Page titles (H1)
} as const;

export const fontWeight = {
  normal: 'var(--font-weight-normal)',     // 400
  medium: 'var(--font-weight-medium)',     // 500
  semibold: 'var(--font-weight-semibold)', // 600
  bold: 'var(--font-weight-bold)',         // 700
} as const;

export const lineHeight = {
  tight: 'var(--line-height-tight)',     // 1.2
  normal: 'var(--line-height-normal)',   // 1.5
  relaxed: 'var(--line-height-relaxed)', // 1.7
} as const;

/**
 * Helper function to get color values
 * @example getColor('primary') // returns 'var(--color-primary)'
 */
export const getColor = (key: keyof typeof colors) => colors[key];

/**
 * Helper function to get spacing values
 * @example getSpacing(4) // returns 'var(--space-4)'
 */
export const getSpacing = (key: keyof typeof spacing) => spacing[key];

/**
 * Helper function to get font size values
 * @example getFontSize(14) // returns 'var(--font-size-14)'
 */
export const getFontSize = (key: keyof typeof fontSize) => fontSize[key];
