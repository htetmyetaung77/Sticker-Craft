import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import { GifFrame } from '../types';

export interface GifEncodeOptions {
  width: number;
  height: number;
  fps: number;
  loop?: number; // 0 for infinite
  frames: {
    canvas: HTMLCanvasElement;
    delayMs?: number;
  }[];
}

/**
 * Encodes an array of HTMLCanvasElement frames into an animated GIF Blob.
 */
export async function createGifBlob(options: GifEncodeOptions): Promise<Blob> {
  const { width, height, frames, fps, loop = 0 } = options;
  
  if (frames.length === 0) {
    throw new Error('At least one frame is required to encode a GIF');
  }

  const gif = GIFEncoder();
  const defaultDelay = Math.round(1000 / fps);

  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    const ctx = frame.canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) continue;

    const imageData = ctx.getImageData(0, 0, width, height);
    const rgba = imageData.data;

    // Quantize RGBA to a palette (max 256 colors)
    const palette = quantize(rgba, 256);

    // Map RGBA pixels to the indexed palette
    const index = applyPalette(rgba, palette);

    const delay = frame.delayMs ?? defaultDelay;

    // Write GIF frame
    gif.writeFrame(index, width, height, {
      palette,
      delay,
      repeat: loop,
    });
  }

  gif.finish();

  const buffer = gif.bytesView();
  return new Blob([new Uint8Array(buffer)], { type: 'image/gif' });
}

/**
 * Downloads a Blob as a file in the browser
 */
export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
