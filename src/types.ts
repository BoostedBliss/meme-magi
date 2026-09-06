export interface MemeTemplate {
  id: string;
  name: string;
  category: 'trending' | 'classic' | 'reaction' | 'animals' | 'gaming';
  imageUrl: string;
  defaultTopText?: string;
  defaultBottomText?: string;
  aspectRatio?: string;
}

export interface MagicCaption {
  topText?: string;
  bottomText: string;
  category: string;
  explanation?: string;
}

export interface ImageAnalysis {
  visualSummary: string;
  detectedMood: string;
  memeabilityScore: number;
  keyElements: string[];
  comedicAngles: string[];
}

export type MemeFormat = 'classic' | 'modern-banner' | 'bottom-punchline';

export type FilterPreset =
  | 'none'
  | 'grayscale'
  | 'sepia'
  | 'high-contrast'
  | 'vintage'
  | 'deep-fried'
  | 'cyberpunk'
  | 'invert'
  | 'dramatic-bw';

export interface ImageFilterConfig {
  preset: FilterPreset | 'custom';
  grayscale: number; // 0 - 100 (%)
  sepia: number; // 0 - 100 (%)
  contrast: number; // 50 - 250 (%)
  brightness: number; // 50 - 200 (%)
  saturate: number; // 0 - 300 (%)
  blur: number; // 0 - 10 (px)
  invert: number; // 0 - 100 (%)
  hueRotate: number; // 0 - 360 (deg)
}

export interface TextStyleConfig {
  fontFamily: 'Impact' | 'Anton' | 'Bebas Neue' | 'Comic Neue' | 'Plus Jakarta Sans';
  fontSize: number;
  textColor: string;
  strokeColor: string;
  strokeWidth: number;
  isUppercase: boolean;
  format: MemeFormat;
  textAlign: 'center' | 'left' | 'right';
  shadow: boolean;
  filters: ImageFilterConfig;
}

export interface StickerItem {
  id: string;
  symbol: string;
  xPercent: number; // 0 - 100
  yPercent: number; // 0 - 100
  size: number;
  rotation: number;
}
