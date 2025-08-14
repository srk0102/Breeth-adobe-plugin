// App Color Constants
// These colors are also defined in tailwind.config.js for CSS classes

export const COLORS = {
  // Brand Colors
  BRAND: {
    PRIMARY: '#a855f7',    // Purple - Main brand color
    SECONDARY: '#8b5cf6',  // Darker purple
    ACCENT: '#c084fc',     // Lighter purple
  },
  
  // File Type Colors
  FILE: {
    VIDEO: '#a855f7',      // Purple for videos
    AUDIO: '#10b981',      // Vibrant green for audio
    IMAGE: '#22d3ee',      // Cyan for images
    UNKNOWN: '#9ca3af',    // Gray for unknown files
  },
  
  // UI State Colors
  UI: {
    SUCCESS: '#10b981',    // Green
    WARNING: '#f59e0b',    // Orange
    ERROR: '#ef4444',      // Red
    INFO: '#3b82f6',       // Blue
  },
  
  // Common Grays
  GRAY: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  }
} as const;

// Export individual color groups for convenience
export const BRAND_COLORS = COLORS.BRAND;
export const FILE_COLORS = COLORS.FILE;
export const UI_COLORS = COLORS.UI;
export const GRAY_COLORS = COLORS.GRAY;
