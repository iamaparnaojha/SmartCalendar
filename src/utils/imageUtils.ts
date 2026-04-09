/**
 * Image utilities and data for calendar backgrounds
 * Each month gets a unique Unsplash image with a curated color palette
 * that drives the glassmorphic theme for the entire UI.
 */

import { ImageOption } from '@app-types/calendar';

/**
 * Monthly background images from Unsplash with harmonious color palettes.
 * Index maps directly to month (0 = January, 11 = December).
 */
export const CALENDAR_IMAGES: ImageOption[] = [
  // January — Winter Walk
  {
    url: 'https://images.unsplash.com/photo-1517299321609-52687d1bc55a?w=1200&auto=format&fit=crop&q=80',
    title: 'Winter Walk',
    colors: {
      primary: '#1e3a5f',
      secondary: '#0c2d4a',
      accent: '#7ec8e3',
    },
  },
  // February — Valentine Hearts & Love
  {
    url: 'https://images.unsplash.com/photo-1516589174184-c6852667ebd3?w=1200&auto=format&fit=crop&q=80',
    title: 'Love & Hearts',
    colors: {
      primary: '#d32f2f',
      secondary: '#c2185b',
      accent: '#ff80ab',
    },
  },
  // March — Cherry Blossom Close-up
  {
    url: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=1200&auto=format&fit=crop&q=80',
    title: 'Cherry Blossom Close-up',
    colors: {
      primary: '#9e2a5e',
      secondary: '#6d1b3f',
      accent: '#fbb4d4',
    },
  },
  // April — Spring Trees
  {
    url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1200&auto=format&fit=crop&q=80',
    title: 'Spring Trees',
    colors: {
      primary: '#1a5632',
      secondary: '#0f3d22',
      accent: '#6ee7a8',
    },
  },
  // May — Vibrant Spring
  {
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&auto=format&fit=crop&q=80',
    title: 'Vibrant Spring Forest',
    colors: {
      primary: '#2e7d32',
      secondary: '#1b5e20',
      accent: '#b9f6ca',
    },
  },
  // June — Summer Forest
  {
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80',
    title: 'Summer Forest',
    colors: {
      primary: '#1b5e20',
      secondary: '#0a3d11',
      accent: '#69f0ae',
    },
  },
  // July — Green Trees
  {
    url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&auto=format&fit=crop&q=80',
    title: 'Green Canopy',
    colors: {
      primary: '#2e7d32',
      secondary: '#1b5e20',
      accent: '#a5d6a7',
    },
  },
  // August — Rainy Window
  {
    url: 'https://images.unsplash.com/photo-1501691223387-dd0500403074?w=1200&auto=format&fit=crop&q=80',
    title: 'Rainy Window',
    colors: {
      primary: '#37474f',
      secondary: '#263238',
      accent: '#78909c',
    },
  },
  // September — Mountain
  {
    url: 'https://images.unsplash.com/photo-1554629947-334ff61d85dc?w=1200&auto=format&fit=crop&q=80',
    title: 'Mountain Landscape',
    colors: {
      primary: '#1a3a6c',
      secondary: '#0d2240',
      accent: '#64b5f6',
    },
  },
  // October — Autumn Mountains
  {
    url: 'https://images.unsplash.com/photo-1478059299873-f047d8c5fe1a?w=1200&auto=format&fit=crop&q=80',
    title: 'Autumn Mountains',
    colors: {
      primary: '#bf360c',
      secondary: '#8d2607',
      accent: '#ffab91',
    },
  },
  // November — Autumn Road
  {
    url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&auto=format&fit=crop&q=80',
    title: 'Autumn Mountain Road',
    colors: {
      primary: '#e65100',
      secondary: '#bf360c',
      accent: '#ffb74d',
    },
  },
  // December — Waterfall Bridge
  {
    url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200&auto=format&fit=crop&q=80',
    title: 'Waterfall Bridge',
    colors: {
      primary: '#004d40',
      secondary: '#00332c',
      accent: '#80cbc4',
    },
  },
];

/**
 * Extra image for special use (Night Sky)
 */
export const NIGHT_SKY_IMAGE: ImageOption = {
  url: 'https://images.unsplash.com/photo-1505771215590-c5fa0aec29b8?w=1200&auto=format&fit=crop&q=80',
  title: 'Night Sky',
  colors: {
    primary: '#1a1a3e',
    secondary: '#0d0d24',
    accent: '#7c7cf5',
  },
};

/**
 * Month theme configuration for glassmorphic UI.
 * Returns overlay colors, glass tint, and text brightness.
 */
export interface MonthTheme {
  glassOverlay: string;      // rgba for glass panel tint
  glassBorder: string;       // rgba for luminous border
  glowColor: string;         // glow/shadow accent color
  textPrimary: string;       // heading text
  textSecondary: string;     // body text
  accentGradient: [string, string]; // gradient stops for buttons/highlights
}

const MONTH_THEMES: MonthTheme[] = [
  // January
  { glassOverlay: 'rgba(30, 58, 95, 0.15)', glassBorder: 'rgba(126, 200, 227, 0.25)', glowColor: 'rgba(126, 200, 227, 0.3)', textPrimary: '#e8f4f8', textSecondary: '#a8d4e6', accentGradient: ['#1e3a5f', '#7ec8e3'] },
  // February
  { glassOverlay: 'rgba(211, 47, 47, 0.15)', glassBorder: 'rgba(255, 128, 171, 0.25)', glowColor: 'rgba(255, 128, 171, 0.3)', textPrimary: '#ffebee', textSecondary: '#ff80ab', accentGradient: ['#d32f2f', '#ff80ab'] },
  // March
  { glassOverlay: 'rgba(158, 42, 94, 0.15)', glassBorder: 'rgba(251, 180, 212, 0.25)', glowColor: 'rgba(251, 180, 212, 0.3)', textPrimary: '#fce4ec', textSecondary: '#fbb4d4', accentGradient: ['#9e2a5e', '#fbb4d4'] },
  // April
  { glassOverlay: 'rgba(26, 86, 50, 0.15)', glassBorder: 'rgba(110, 231, 168, 0.25)', glowColor: 'rgba(110, 231, 168, 0.3)', textPrimary: '#e8f5e9', textSecondary: '#6ee7a8', accentGradient: ['#1a5632', '#6ee7a8'] },
  // May
  { glassOverlay: 'rgba(46, 125, 50, 0.15)', glassBorder: 'rgba(185, 246, 202, 0.28)', glowColor: 'rgba(185, 246, 202, 0.3)', textPrimary: '#e8f5e9', textSecondary: '#b9f6ca', accentGradient: ['#2e7d32', '#b9f6ca'] },
  // June
  { glassOverlay: 'rgba(27, 94, 32, 0.12)', glassBorder: 'rgba(105, 240, 174, 0.25)', glowColor: 'rgba(105, 240, 174, 0.3)', textPrimary: '#e8f5e9', textSecondary: '#69f0ae', accentGradient: ['#1b5e20', '#69f0ae'] },
  // July
  { glassOverlay: 'rgba(46, 125, 50, 0.12)', glassBorder: 'rgba(165, 214, 167, 0.25)', glowColor: 'rgba(165, 214, 167, 0.3)', textPrimary: '#e8f5e9', textSecondary: '#a5d6a7', accentGradient: ['#2e7d32', '#a5d6a7'] },
  // August
  { glassOverlay: 'rgba(55, 71, 79, 0.18)', glassBorder: 'rgba(120, 144, 156, 0.25)', glowColor: 'rgba(120, 144, 156, 0.3)',  textPrimary: '#eceff1', textSecondary: '#90a4ae', accentGradient: ['#37474f', '#78909c'] },
  // September
  { glassOverlay: 'rgba(26, 58, 108, 0.15)', glassBorder: 'rgba(100, 181, 246, 0.25)', glowColor: 'rgba(100, 181, 246, 0.3)', textPrimary: '#e3f2fd', textSecondary: '#64b5f6', accentGradient: ['#1a3a6c', '#64b5f6'] },
  // October
  { glassOverlay: 'rgba(191, 54, 12, 0.15)', glassBorder: 'rgba(255, 171, 145, 0.25)', glowColor: 'rgba(255, 171, 145, 0.3)', textPrimary: '#fbe9e7', textSecondary: '#ffab91', accentGradient: ['#bf360c', '#ffab91'] },
  // November
  { glassOverlay: 'rgba(230, 81, 0, 0.15)', glassBorder: 'rgba(255, 183, 77, 0.25)', glowColor: 'rgba(255, 183, 77, 0.3)', textPrimary: '#fff3e0', textSecondary: '#ffb74d', accentGradient: ['#e65100', '#ffb74d'] },
  // December
  { glassOverlay: 'rgba(0, 77, 64, 0.15)', glassBorder: 'rgba(128, 203, 196, 0.25)', glowColor: 'rgba(128, 203, 196, 0.3)', textPrimary: '#e0f2f1', textSecondary: '#80cbc4', accentGradient: ['#004d40', '#80cbc4'] },
];

/**
 * Get season based on month
 */
export function getSeason(
  month: number
): 'winter' | 'spring' | 'summer' | 'autumn' {
  if (month === 11 || month === 0 || month === 1) return 'winter';
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  return 'autumn';
}

/**
 * Get image for a given month (0-indexed)
 */
export function getImageForMonth(month: number): ImageOption {
  return CALENDAR_IMAGES[month % 12] || CALENDAR_IMAGES[0];
}

/**
 * Get the full theme for a given month (0-indexed)
 */
export function getMonthTheme(month: number): MonthTheme {
  return MONTH_THEMES[month % 12] || MONTH_THEMES[0];
}

/**
 * Get random image from a season
 */
export function getRandomImageForMonth(month: number): ImageOption {
  return CALENDAR_IMAGES[month % 12] || CALENDAR_IMAGES[0];
}

/**
 * Adjust color brightness
 */
export function adjustColorBrightness(
  color: string,
  percent: number
): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;

  return (
    '#' +
    (0x1000000 + (R < 255 ? (R > 0 ? R : 0) : 255) * 0x10000 +
      (G < 255 ? (G > 0 ? G : 0) : 255) * 0x100 +
      (B < 255 ? (B > 0 ? B : 0) : 255))
      .toString(16)
      .slice(1)
  );
}

/**
 * Generate gradient overlay colors based on base color
 */
export function generateGradientOverlay(
  baseColor: string
): { from: string; to: string } {
  return {
    from: adjustColorBrightness(baseColor, -20),
    to: adjustColorBrightness(baseColor, -40),
  };
}
