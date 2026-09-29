import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Download, 
  Film, 
  Sparkles, 
  Wand2, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Layers,
  Repeat,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GifFrame, AnimationEffect, Language } from '../types';
import { translations } from '../utils/translations';
import { createGifBlob, triggerDownload } from '../utils/gifEncoder';

interface GifMakerProps {
  lang: Language;
}

interface GifPreset {
  id: string;
  title: string;
  effect: AnimationEffect;
  caption: string;
  character: string;
  colors: [string, string];
}

const MEME_PRESETS: GifPreset[] = [
  { id: 'p-bounce', title: 'Hype Bounce', effect: 'bounce', caption: 'LET\'S GOOO!', character: '🚀', colors: ['#6366f1', '#ec4899'] },
  { id: 'p-wiggle', title: 'Party Dance', effect: 'wiggle', caption: 'VIBING 🎧', character: '🐱', colors: ['#10b981', '#3b82f6'] },
  { id: 'p-pulse', title: 'Heartbeat Love', effect: 'pulse', caption: 'MY HEART ❤️', character: '💖', colors: ['#f43f5e', '#fb7185'] },
  { id: 'p-shake', title: 'Panic Shake', effect: 'shake', caption: 'PANIK 😱', character: '💥', colors: ['#eab308', '#dc2626'] },
  { id: 'p-spin', title: 'Golden Spin', effect: 'spin', caption: 'LEVEL UP ✨', character: '⭐', colors: ['#facc15', '#f59e0b'] },
  { id: 'p-rainbow', title: 'Rainbow Disco', effect: 'rainbow', caption: 'DISCO TIME 🪩', character: '🦄', colors: ['#06b6d4', '#d946ef'] },
];

export const GifMaker: React.FC<GifMakerProps> = ({ lang }) => {
  const t = translations[lang];

  // State
  const [prompt, setPrompt] = useState('Dancing party cat with sunglasses and confetti');
  const [effect, setEffect] = useState<AnimationEffect>('bounce');
  const [fps, setFps] = useState(10);
  const [loopMode, setLoopMode] = useState<'infinite' | 'once' | 'ping-pong'>('infinite');
  const [caption, setCaption] = useState('DISCO PARTY');
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [characterEmoji, setCharacterEmoji] = useState('🐱');
  const [bgColors, setBgColors] = useState<[string, string]>(['#6366f1', '#ec4899']);
  const [exported, setExported] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const totalFrames = 12;

  // Animation player ticker
  useEffect(() => {
    if (!isPlaying) return;
    const intervalTime = 1000 / fps;

    const interval = setInterval(() => {
      setActiveFrameIndex((prev) => {
        if (loopMode === 'once' && prev >= totalFrames - 1) {
          setIsPlaying(false);
          return prev;
        }
        return (prev + 1) % totalFrames;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isPlaying, fps, loopMode, totalFrames]);

  // Render current frame to display canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderFrame(ctx, activeFrameIndex, 360, 360);
  }, [activeFrameIndex, effect, caption, characterEmoji, bgColors]);

  /**
   * Helper to draw a specific frame on a canvas
   */
  const renderFrame = (
    ctx: CanvasRenderingContext2D,
    frameIndex: number,
    w: number,
    h: number
  ) => {
    ctx.clearRect(0, 0, w, h);

    const progress = frameIndex / totalFrames; // 0 to 1
    const angle = progress * Math.PI * 2;

    // Background Gradient Circle / Rounded Box
    const grad = ctx.createLinearGradient(0, 0, w, h);
    if (effect === 'rainbow') {
      const hue = Math.round(progress * 360);
      grad.addColorStop(0, `hsl(${hue}, 85%, 60%)`);
      grad.addColorStop(1, `hsl(${(hue + 60) % 360}, 85%, 50%)`);
    } else {
      grad.addColorStop(0, bgColors[0]);
      grad.addColorStop(1, bgColors[1]);
    }

    // Outer Die-cut White border
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(16, 16, w - 32, h - 32, 40);
    ctx.fill();

    // Body Fill
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(26, 26, w - 52, h - 52, 32);
    ctx.fill();

    ctx.save();
    ctx.translate(w / 2, h / 2 - 15);

    // Compute transformations based on effect
    let scaleX = 1;
    let scaleY = 1;
    let transX = 0;
    let transY = 0;
    let rot = 0;

    switch (effect) {
      case 'bounce':
        transY = -Math.abs(Math.sin(angle)) * 35;
        scaleY = 1 + Math.sin(angle) * 0.15;
        scaleX = 1 - Math.sin(angle) * 0.08;
        break;
      case 'pulse':
        scaleX = 1 + Math.sin(angle) * 0.2;
        scaleY = 1 + Math.sin(angle) * 0.2;
        break;
      case 'spin':
        rot = angle;
        break;
      case 'wiggle':
        rot = Math.sin(angle) * 0.25;
        transX = Math.sin(angle) * 12;
        break;
      case 'shake':
        transX = (Math.random() - 0.5) * 14;
        transY = (Math.random() - 0.5) * 14;
        break;
      case 'zoom':
        scaleX = 0.8 + Math.abs(Math.sin(angle)) * 0.45;
        scaleY = scaleX;
        break;
      default:
        break;
    }

    ctx.translate(transX, transY);
    ctx.rotate(rot);
    ctx.scale(scaleX, scaleY);

    // Draw main character emoji / icon
    ctx.font = '96px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(characterEmoji, 0, 0);

    ctx.restore();

    // Draw Caption Text Banner at bottom
    if (caption) {
      ctx.save();
      const bannerY = h - 64;
      const bannerHeight = 36;
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.roundRect(w / 2 - 120, bannerY - bannerHeight / 2, 240, bannerHeight, 18);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(caption, w / 2, bannerY);
      ctx.restore();
    }
  };

  // AI Generation of GIF script & animation
  const handleAiGenerate = async () => {
    try {
      const res = await fetch('/api/generate-gif-sequence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionPrompt: prompt,
          effect,
          fps,
        }),
      });
      if (res.ok) {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#ec4899', '#facc15'],
        });
      }
    } catch (e) {
      console.warn('GIF generation offline fallback:', e);
    }
  };

  // Export as actual animated GIF
  const handleExportGif = async () => {
    setIsExporting(true);
    try {
      const frames: { canvas: HTMLCanvasElement; delayMs: number }[] = [];
      const frameDelay = Math.round(1000 / fps);

      for (let i = 0; i < totalFrames; i++) {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = 360;
        offCanvas.height = 360;
        const offCtx = offCanvas.getContext('2d');
        if (offCtx) {
          renderFrame(offCtx, i, 360, 360);
          frames.push({
            canvas: offCanvas,
            delayMs: frameDelay,
          });
        }
      }

      const gifBlob = await createGifBlob({
        width: 360,
        height: 360,
        fps,
        loop: loopMode === 'once' ? 1 : 0,
        frames,
      });

      triggerDownload(gifBlob, `stickercraft_anim_${effect}_${Date.now()}.gif`);
      setExported(true);
      setTimeout(() => setExported(false), 3000);

      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#6366f1', '#10b981', '#f59e0b'],
      });
    } catch (err) {
      console.error('GIF export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleApplyPreset = (preset: GifPreset) => {
    setEffect(preset.effect);
    setCaption(preset.caption);
    setCharacterEmoji(preset.character);
    setBgColors(preset.colors);
    setIsPlaying(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Editorial Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          {t.gifTitle}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-3xl">
          {t.gifSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Animation & Frame Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Action Prompt input */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm space-y-3">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Action & Animation Description
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t.gifPromptPlaceholder}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAiGenerate}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition-colors whitespace-nowrap"
              >
                <Wand2 className="h-4 w-4" />
                <span>{t.generateGifBtn}</span>
              </button>
            </div>
          </div>

          {/* Motion Effect Selector */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              {t.effectLabel}
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['bounce', 'pulse', 'wiggle', 'spin', 'shake', 'zoom', 'rainbow', 'none'] as AnimationEffect[]).map((eff) => (
                <button
                  key={eff}
                  type="button"
                  onClick={() => setEffect(eff)}
                  className={`p-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                    effect === eff
                      ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500 shadow-sm'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {eff}
                </button>
              ))}
            </div>
          </div>

          {/* Speed & Loop Controls */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm space-y-4">
            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                <span>{t.fpsLabel}</span>
                <span className="font-mono-code tabular-nums text-indigo-400">{fps} FPS</span>
              </div>
              <input
                type="range"
                min={2}
                max={24}
                value={fps}
                onChange={(e) => setFps(Number(e.target.value))}
                className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>Slow (2 FPS)</span>
                <span>Normal (10 FPS)</span>
                <span>Fast (24 FPS)</span>
              </div>
            </div>

            {/* Loop Mode buttons */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">{t.loopModeLabel}</span>
              <div className="flex items-center gap-1 bg-slate-950 rounded-lg p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setLoopMode('infinite')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    loopMode === 'infinite' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  {t.loopInfinite}
                </button>
                <button
                  type="button"
                  onClick={() => setLoopMode('once')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    loopMode === 'once' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  {t.loopOnce}
                </button>
              </div>
            </div>

            {/* Custom text caption */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                {t.captionLabel}
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Caption text overlay..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Player & Real-time Export (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Animation Playback
              </span>
              <span className="text-xs text-indigo-400 font-mono-code tabular-nums">
                Frame {activeFrameIndex + 1}/{totalFrames}
              </span>
            </div>

            {/* Interactive Player Canvas */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center p-4 shadow-inner">
              <canvas
                ref={canvasRef}
                width={360}
                height={360}
                className="max-h-full max-w-full drop-shadow-xl"
              />
            </div>

            {/* Player Controls Bar */}
            <div className="flex items-center justify-between bg-slate-950 rounded-xl p-2 border border-slate-800">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition-colors"
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              {/* Progress dots */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalFrames }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveFrameIndex(idx);
                      setIsPlaying(false);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      activeFrameIndex === idx ? 'w-5 bg-indigo-500' : 'w-2 bg-slate-700 hover:bg-slate-600'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveFrameIndex(0);
                  setIsPlaying(true);
                }}
                title="Reset animation"
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {/* Export Animated GIF Button */}
            <button
              type="button"
              onClick={handleExportGif}
              disabled={isExporting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition-all active:scale-95 disabled:opacity-60"
            >
              {exported ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Downloaded Animated GIF!</span>
                </>
              ) : (
                <>
                  <Download className={`h-4 w-4 ${isExporting ? 'animate-bounce' : ''}`} />
                  <span>{isExporting ? t.exportingGif : t.exportGif}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Meme & Reaction Presets */}
      <div className="mt-14 pt-8 border-t border-slate-800/80">
        <h2 className="font-display text-xl font-bold text-white mb-2">
          {t.presetReactions}
        </h2>
        <p className="text-xs text-slate-400 mb-5">
          Pick any meme preset to test instant animations, speeds, and customizable text
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {MEME_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="group flex flex-col items-center p-3.5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-indigo-500/80 hover:bg-slate-900/80 transition-all"
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                {p.character}
              </span>
              <span className="text-xs font-bold text-slate-200 group-hover:text-indigo-400">
                {p.title}
              </span>
              <span className="text-[10px] text-slate-500 uppercase mt-0.5 font-medium">
                {p.effect}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
