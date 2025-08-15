// Centralized color constants for app logic (JS usage)
// CSS variables and Tailwind config mirror these values for styles

export const COLORS = {
	BRAND: {
		PRIMARY: '#a855f7',
		SECONDARY: '#8b5cf6',
		ACCENT: '#c084fc',
	},
	FILE: {
		VIDEO: '#a855f7',
		AUDIO: '#10b981',
		IMAGE: '#22d3ee',
		UNKNOWN: '#9ca3af',
	},
	UI: {
		SUCCESS: '#10b981',
		WARNING: '#f59e0b',
		ERROR: '#ef4444',
		INFO: '#3b82f6',
	},
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
	},
} as const;

export const BRAND_COLORS = COLORS.BRAND;
export const FILE_COLORS = COLORS.FILE;
export const UI_COLORS = COLORS.UI;
export const GRAY_COLORS = COLORS.GRAY;


