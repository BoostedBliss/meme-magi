import { TextStyleConfig, StickerItem, ImageFilterConfig, FilterPreset } from '../types';

export const DEFAULT_IMAGE_FILTERS: ImageFilterConfig = {
  preset: 'none',
  grayscale: 0,
  sepia: 0,
  contrast: 100,
  brightness: 100,
  saturate: 100,
  blur: 0,
  invert: 0,
  hueRotate: 0,
};

export const FILTER_PRESETS: Record<
  FilterPreset,
  { label: string; description: string; config: Omit<ImageFilterConfig, 'preset'> }
> = {
  none: {
    label: 'Normal',
    description: 'Original colors',
    config: {
      grayscale: 0,
      sepia: 0,
      contrast: 100,
      brightness: 100,
      saturate: 100,
      blur: 0,
      invert: 0,
      hueRotate: 0,
    },
  },
  grayscale: {
    label: 'Grayscale',
    description: 'B&W monochrome',
    config: {
      grayscale: 100,
      sepia: 0,
      contrast: 105,
      brightness: 100,
      saturate: 100,
      blur: 0,
      invert: 0,
      hueRotate: 0,
    },
  },
  sepia: {
    label: 'Sepia',
    description: 'Warm antique tone',
    config: {
      grayscale: 0,
      sepia: 100,
      contrast: 100,
      brightness: 100,
      saturate: 120,
      blur: 0,
      invert: 0,
      hueRotate: 0,
    },
  },
  'high-contrast': {
    label: 'High Contrast',
    description: 'Punchy vivid depth',
    config: {
      grayscale: 0,
      sepia: 0,
      contrast: 180,
      brightness: 105,
      saturate: 125,
      blur: 0,
      invert: 0,
      hueRotate: 0,
    },
  },
  vintage: {
    label: 'Vintage 90s',
    description: 'Faded film aesthetic',
    config: {
      grayscale: 0,
      sepia: 40,
      contrast: 120,
      brightness: 95,
      saturate: 130,
      blur: 0,
      invert: 0,
      hueRotate: 0,
    },
  },
  'deep-fried': {
    label: 'Deep Fried',
    description: 'Max distortion meme',
    config: {
      grayscale: 0,
      sepia: 0,
      contrast: 220,
      brightness: 110,
      saturate: 260,
      blur: 0,
      invert: 0,
      hueRotate: 0,
    },
  },
  cyberpunk: {
    label: 'Cyberpunk',
    description: 'Neon synthwave shift',
    config: {
      grayscale: 0,
      sepia: 0,
      contrast: 140,
      brightness: 105,
      saturate: 200,
      blur: 0,
      invert: 0,
      hueRotate: 180,
    },
  },
  invert: {
    label: 'Invert / Negative',
    description: 'Cursed meme negative',
    config: {
      grayscale: 0,
      sepia: 0,
      contrast: 100,
      brightness: 100,
      saturate: 100,
      blur: 0,
      invert: 100,
      hueRotate: 0,
    },
  },
  'dramatic-bw': {
    label: 'Noir B&W',
    description: 'Dramatic shadow & light',
    config: {
      grayscale: 100,
      sepia: 0,
      contrast: 190,
      brightness: 88,
      saturate: 0,
      blur: 0,
      invert: 0,
      hueRotate: 0,
    },
  },
};

export function buildCssFilterString(filters?: ImageFilterConfig): string {
  if (!filters) return 'none';
  const parts: string[] = [];

  if (filters.grayscale > 0) parts.push(`grayscale(${filters.grayscale}%)`);
  if (filters.sepia > 0) parts.push(`sepia(${filters.sepia}%)`);
  if (filters.contrast !== 100) parts.push(`contrast(${filters.contrast}%)`);
  if (filters.brightness !== 100) parts.push(`brightness(${filters.brightness}%)`);
  if (filters.saturate !== 100) parts.push(`saturate(${filters.saturate}%)`);
  if (filters.blur > 0) parts.push(`blur(${filters.blur}px)`);
  if (filters.invert > 0) parts.push(`invert(${filters.invert}%)`);
  if (filters.hueRotate > 0) parts.push(`hue-rotate(${filters.hueRotate}deg)`);

  return parts.length > 0 ? parts.join(' ') : 'none';
}

interface RenderOptions {
  canvas: HTMLCanvasElement;
  image: HTMLImageElement;
  topText: string;
  bottomText: string;
  style: TextStyleConfig;
  stickers: StickerItem[];
}

export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = ctx.measureText(testLine).width;

    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

export function drawMemeOnCanvas({
  canvas,
  image,
  topText,
  bottomText,
  style,
  stickers,
}: RenderOptions): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const naturalWidth = image.naturalWidth || 600;
  const naturalHeight = image.naturalHeight || 600;

  // Modern banner mode adds height for the top banner box
  let bannerHeight = 0;
  if (style.format === 'modern-banner' && topText.trim()) {
    // Measure estimated banner height
    bannerHeight = Math.max(100, Math.floor(naturalHeight * 0.22));
  }

  const canvasWidth = naturalWidth;
  const canvasHeight = naturalHeight + bannerHeight;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // 1. Draw Modern Banner background if enabled
  if (bannerHeight > 0) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvasWidth, bannerHeight);

    // Banner divider line
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(0, bannerHeight - 2, canvasWidth, 2);

    // Draw banner text
    ctx.save();
    ctx.font = `600 ${Math.max(20, Math.floor(canvasWidth * 0.045))}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    const bannerPadding = Math.floor(canvasWidth * 0.04);
    const maxBannerTextWidth = canvasWidth - bannerPadding * 2;
    const bannerLines = wrapText(ctx, topText, maxBannerTextWidth);
    const lineHeight = Math.max(26, Math.floor(canvasWidth * 0.055));
    const startY = bannerHeight / 2 - ((bannerLines.length - 1) * lineHeight) / 2;

    bannerLines.forEach((line, idx) => {
      ctx.fillText(line, bannerPadding, startY + idx * lineHeight);
    });
    ctx.restore();
  }

  // 2. Draw Image with CSS Filters applied
  ctx.save();
  const filterString = buildCssFilterString(style.filters);
  if (filterString && filterString !== 'none') {
    ctx.filter = filterString;
  }
  ctx.drawImage(image, 0, bannerHeight, naturalWidth, naturalHeight);
  ctx.restore();

  // 3. Draw Text Overlays
  const fontName = style.fontFamily;
  const baseFontSize = Math.floor((style.fontSize / 100) * (canvasWidth * 0.09));
  const strokeWidth = Math.max(1, Math.floor((style.strokeWidth / 10) * (canvasWidth * 0.015)));

  ctx.font = `900 ${baseFontSize}px "${fontName}", Impact, sans-serif`;
  ctx.textAlign = style.textAlign;
  ctx.lineJoin = 'round';
  ctx.lineWidth = strokeWidth;

  const maxTextWidth = canvasWidth * 0.9;
  const lineHeight = baseFontSize * 1.15;

  let textX = canvasWidth / 2;
  if (style.textAlign === 'left') textX = canvasWidth * 0.05;
  if (style.textAlign === 'right') textX = canvasWidth * 0.95;

  // Helper to draw stroked meme text line
  const renderStrokedLine = (line: string, x: number, y: number) => {
    if (style.strokeWidth > 0) {
      ctx.strokeStyle = style.strokeColor;
      ctx.strokeText(line, x, y);
    }
    ctx.fillStyle = style.textColor;
    ctx.fillText(line, x, y);
  };

  // Top Text (Only if not in modern-banner mode, since modern-banner renders it in the white header)
  if (style.format !== 'modern-banner' && topText.trim()) {
    const rawTop = style.isUppercase ? topText.toUpperCase() : topText;
    const topLines = wrapText(ctx, rawTop, maxTextWidth);
    const topPadding = Math.floor(canvasHeight * 0.04);
    ctx.textBaseline = 'top';

    topLines.forEach((line, idx) => {
      renderStrokedLine(line, textX, topPadding + idx * lineHeight);
    });
  }

  // Bottom Text
  if (bottomText.trim()) {
    const rawBottom = style.isUppercase ? bottomText.toUpperCase() : bottomText;
    const bottomLines = wrapText(ctx, rawBottom, maxTextWidth);
    const bottomPadding = Math.floor(canvasHeight * 0.05);
    ctx.textBaseline = 'bottom';

    const startY = canvasHeight - bottomPadding - (bottomLines.length - 1) * lineHeight;
    bottomLines.forEach((line, idx) => {
      renderStrokedLine(line, textX, startY + idx * lineHeight);
    });
  }

  // 4. Draw Stickers / Emojis
  stickers.forEach((sticker) => {
    ctx.save();
    const posX = (sticker.xPercent / 100) * canvasWidth;
    const posY = bannerHeight + (sticker.yPercent / 100) * naturalHeight;
    const stickerPx = Math.floor((sticker.size / 100) * (canvasWidth * 0.2));

    ctx.translate(posX, posY);
    ctx.rotate((sticker.rotation * Math.PI) / 180);
    ctx.font = `${stickerPx}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sticker.symbol, 0, 0);
    ctx.restore();
  });
}

export function exportCanvasAsDataUrl(
  canvas: HTMLCanvasElement,
  format: 'image/png' | 'image/jpeg' = 'image/png'
): string {
  return canvas.toDataURL(format, 0.95);
}

export async function exportCanvasAsBlob(
  canvas: HTMLCanvasElement,
  format: 'image/png' | 'image/jpeg' = 'image/png'
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), format, 0.95);
  });
}

export async function copyCanvasToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  try {
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve(false);
          return;
        }
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob,
            }),
          ]);
          resolve(true);
        } catch (err) {
          console.warn('Clipboard write failed:', err);
          resolve(false);
        }
      }, 'image/png');
    });
  } catch (err) {
    console.error('Clipboard error:', err);
    return false;
  }
}
