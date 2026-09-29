import React, { useState, useRef, useEffect } from 'react';
import { 
  Wand2, 
  Download, 
  Plus, 
  Copy, 
  Check, 
  Sparkles, 
  Sliders, 
  RotateCw, 
  Type, 
  Image as ImageIcon,
  CheckCircle2,
  Upload,
  ImagePlus,
  RefreshCw,
  X,
  Crown,
  Lock,
  CreditCard,
  Send,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StickerItem, StickerStyle, StickerEmotion, StickerCategory, Language } from '../types';
import { translations } from '../utils/translations';
import { 
  STYLES_LIST, 
  EMOTIONS_LIST, 
  CATEGORIES_LIST,
  SAMPLE_PROMPTS, 
  INITIAL_PRESETS, 
  MYANMAR_STICKER_PHRASES,
  generateStickerSvg 
} from '../utils/stickerPresets';

interface StickerMakerProps {
  lang: Language;
  onAddToPack: (sticker: StickerItem) => void;
  onNavigateToBooster?: () => void;
}

export const StickerMaker: React.FC<StickerMakerProps> = ({ lang, onAddToPack, onNavigateToBooster }) => {
  const t = translations[lang];

  // State
  const [prompt, setPrompt] = useState('မိုက်တယ်ဟေ့ စူပါကြောင်ကလေး (Super Cool Cat with sunglasses)');
  const [selectedStyle, setSelectedStyle] = useState<StickerStyle>('3d-cute');
  const [selectedEmotion, setSelectedEmotion] = useState<StickerEmotion>('cool');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [caption, setCaption] = useState('မိုက်တယ်ဟေ့ 🔥');
  const [captionPosition, setCaptionPosition] = useState<'top' | 'bottom' | 'none'>('bottom');
  const [outlineWidth, setOutlineWidth] = useState(14);
  const [hasShadow, setHasShadow] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState(false);
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(null);
  const [vipModalSticker, setVipModalSticker] = useState<StickerItem | null>(null);
  const [unlockedVipIds, setUnlockedVipIds] = useState<string[]>([]);
  
  // Current active sticker preview SVG
  const [currentSvg, setCurrentSvg] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Update SVG preview whenever parameters change
  useEffect(() => {
    if (customPhotoUrl) return; // Using uploaded photo mode
    const svg = generateStickerSvg(
      prompt,
      selectedStyle,
      selectedEmotion,
      captionPosition === 'none' ? undefined : caption
    );
    setCurrentSvg(svg);
  }, [prompt, selectedStyle, selectedEmotion, caption, captionPosition, outlineWidth, hasShadow, customPhotoUrl]);

  // Render SVG or custom photo to 512x512 canvas for export
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (customPhotoUrl) {
      // Draw custom uploaded photo with sticker die-cut border
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.clearRect(0, 0, 512, 512);

        // Die-cut white border
        if (outlineWidth > 0) {
          ctx.save();
          if (hasShadow) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
            ctx.shadowBlur = 18;
            ctx.shadowOffsetY = 10;
          }
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(256, 230, 195, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Draw image clipped inside circular/rounded sticker frame
        ctx.save();
        ctx.beginPath();
        ctx.arc(256, 230, 180, 0, Math.PI * 2);
        ctx.clip();
        
        // Draw centered and cover-fit
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        ctx.drawImage(img, sx, sy, minDim, minDim, 76, 50, 360, 360);
        ctx.restore();

        // Draw text badge
        if (captionPosition !== 'none' && caption) {
          ctx.save();
          const badgeY = captionPosition === 'top' ? 60 : 440;
          ctx.fillStyle = '#1e1b4b';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.roundRect(256 - 150, badgeY - 24, 300, 48, 24);
          ctx.fill();
          ctx.stroke();

          ctx.font = 'bold 22px "Padauk", "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(caption, 256, badgeY);
          ctx.restore();
        }
      };
      img.src = customPhotoUrl;
    } else if (currentSvg) {
      const img = new Image();
      const svgBlob = new Blob([currentSvg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.clearRect(0, 0, 512, 512);
        ctx.drawImage(img, 0, 0, 512, 512);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  }, [currentSvg, customPhotoUrl, caption, captionPosition, outlineWidth, hasShadow]);

  // Handle image upload from device
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setCustomPhotoUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle AI generation request
  const handleGenerate = async () => {
    setCustomPhotoUrl(null); // Reset to AI SVG mode
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-sticker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          style: selectedStyle,
          emotion: selectedEmotion,
          caption: captionPosition !== 'none' ? caption : '',
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.data?.suggestedCaption) {
          setCaption(json.data.suggestedCaption);
        }
      }
    } catch (err) {
      console.warn('API notice (rendered offline preview gracefully):', err);
    } finally {
      setIsGenerating(false);
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899'],
      });
    }
  };

  const handleInspire = () => {
    setCustomPhotoUrl(null);
    const randomPrompt = SAMPLE_PROMPTS[Math.floor(Math.random() * SAMPLE_PROMPTS.length)];
    setPrompt(randomPrompt);
    const randomStyle = STYLES_LIST[Math.floor(Math.random() * STYLES_LIST.length)].id;
    setSelectedStyle(randomStyle);
    const randomEmotion = EMOTIONS_LIST[Math.floor(Math.random() * EMOTIONS_LIST.length)].id;
    setSelectedEmotion(randomEmotion);
  };

  const handleDownload = (format: 'png' | 'webp') => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const mime = format === 'webp' ? 'image/webp' : 'image/png';
    const dataUrl = canvas.toDataURL(mime, 0.95);
    const link = document.createElement('a');
    link.download = `stickercraft_${Date.now()}.${format}`;
    link.href = dataUrl;
    link.click();
  };

  const handleCopy = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } catch {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      }, 'image/png');
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveToPack = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/webp', 0.9);
    
    const newSticker: StickerItem = {
      id: 'sticker-' + Date.now(),
      title: caption || prompt.slice(0, 24) || 'Custom Sticker',
      prompt,
      style: selectedStyle,
      emotion: selectedEmotion,
      imageUrl: dataUrl,
      svgData: customPhotoUrl ? undefined : currentSvg,
      captionText: captionPosition !== 'none' ? caption : '',
      captionPosition,
      captionColor: '#ffffff',
      captionBgColor: '#1e1b4b',
      outlineWidth,
      outlineColor: '#ffffff',
      hasShadow,
      createdAt: Date.now(),
    };

    onAddToPack(newSticker);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10b981', '#6366f1'],
    });
  };

  const handleLoadPreset = (preset: StickerItem) => {
    setCustomPhotoUrl(null);
    setPrompt(preset.prompt);
    setSelectedStyle(preset.style);
    setSelectedEmotion(preset.emotion);
    setCaption(preset.captionText || '');
    setCaptionPosition(preset.captionPosition === 'none' ? 'none' : 'bottom');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Editorial Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          {t.createStickerTitle}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-3xl">
          {t.createStickerSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Generator Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Custom Photo Upload Card */}
          <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/30 to-purple-950/20 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ImagePlus className="h-5 w-5 text-indigo-400" />
                <label className="text-xs font-bold text-white uppercase tracking-wider">
                  {t.uploadCustomImage}
                </label>
              </div>
              {customPhotoUrl && (
                <button
                  type="button"
                  onClick={() => setCustomPhotoUrl(null)}
                  className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>{lang === 'my' ? 'AI ပုံသို့ ပြန်ပြောင်းမည်' : 'Switch to AI Vector'}</span>
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-bold text-white transition-colors shadow-md"
              >
                <Upload className="h-4 w-4" />
                <span>{lang === 'my' ? 'ဖုန်း/ကွန်ပျူတာမှ ဓာတ်ပုံရွေးပါ' : 'Select Photo from Device'}</span>
              </button>
              <span className="text-xs text-slate-400">
                {lang === 'my' 
                  ? 'မိမိဓာတ်ပုံကို စတစ်ကာအဖြူရောင်ဘောင်နှင့် စာသားတံဆိပ် အလိုအလျောက် ထည့်ပေးပါမည်' 
                  : 'Automatically adds die-cut white outline & sticker shadow to your photo'}
              </span>
            </div>
          </div>

          {/* Prompt Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Concept & Character Description
              </label>
              <button
                type="button"
                onClick={handleInspire}
                className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{t.randomPrompt}</span>
              </button>
            </div>

            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t.promptPlaceholder}
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-700/80 bg-slate-950/80 p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors font-myanmar"
              />
            </div>

            {/* Quick Prompt Ideas Row */}
            <div className="mt-3 flex flex-wrap gap-1.5 items-center text-xs text-slate-400">
              <span className="text-slate-500 font-medium">Quick ideas:</span>
              <button
                type="button"
                onClick={() => setPrompt('Cute Shiba Inu eating hot ramen in space')}
                className="hover:text-indigo-400 hover:underline cursor-pointer"
              >
                Shiba Ramen
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => setPrompt('Cyberpunk cat hacker with neon visor')}
                className="hover:text-indigo-400 hover:underline cursor-pointer"
              >
                Cyber Cat
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => setPrompt('Chibi baby dragon sipping bubble tea')}
                className="hover:text-indigo-400 hover:underline cursor-pointer"
              >
                Boba Dragon
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => setPrompt('ချစ်စရာ ကြောင်ကလေး မိုက်နေတာ')}
                className="hover:text-indigo-400 hover:underline cursor-pointer font-myanmar"
              >
                မိုက်တဲ့ကြောင်ကလေး
              </button>
            </div>
          </div>

          {/* Style Selector */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              {t.styleLabel}
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {STYLES_LIST.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style.id)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    selectedStyle === style.id
                      ? 'border-indigo-500 bg-indigo-950/40 text-white shadow-sm ring-1 ring-indigo-500'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="text-lg mb-1">{style.icon}</span>
                  <span className="truncate w-full text-center">{t.styles[style.id]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Emotion & Expression Selector */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              {t.emotionLabel}
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {EMOTIONS_LIST.map((emo) => (
                <button
                  key={emo.id}
                  type="button"
                  onClick={() => setSelectedEmotion(emo.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                    selectedEmotion === emo.id
                      ? 'border-indigo-500 bg-indigo-950/40 text-white shadow-sm ring-1 ring-indigo-500'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="text-base">{emo.emoji}</span>
                  <span className="truncate">{emo.id.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text Badge & Myanmar Catchphrases */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                {t.captionLabel}
              </label>
              
              {/* Position selector buttons */}
              <div className="flex items-center gap-1 bg-slate-950 rounded-lg p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setCaptionPosition('top')}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                    captionPosition === 'top' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.captionPosTop}
                </button>
                <button
                  type="button"
                  onClick={() => setCaptionPosition('bottom')}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                    captionPosition === 'bottom' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.captionPosBottom}
                </button>
                <button
                  type="button"
                  onClick={() => setCaptionPosition('none')}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                    captionPosition === 'none' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.captionPosNone}
                </button>
              </div>
            </div>

            {captionPosition !== 'none' && (
              <div className="space-y-3">
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder={t.captionPlaceholder}
                    maxLength={30}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none font-myanmar"
                  />
                </div>

                {/* Myanmar 1-Click Catchphrase Pills */}
                <div>
                  <span className="text-[11px] font-medium text-slate-400 block mb-2 font-myanmar">
                    {t.myanmarPhrasesLabel}:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {MYANMAR_STICKER_PHRASES.map((phrase) => (
                      <button
                        key={phrase}
                        type="button"
                        onClick={() => setCaption(phrase)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-myanmar transition-colors border ${
                          caption === phrase
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        {phrase}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Die-Cut Outline & Shadow sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>{t.outlineLabel}</span>
                  <span className="tabular-nums font-mono-code">{outlineWidth}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={24}
                  value={outlineWidth}
                  onChange={(e) => setOutlineWidth(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between sm:justify-end sm:gap-4 pt-4 sm:pt-0">
                <span className="text-xs text-slate-400">{t.shadowLabel}</span>
                <button
                  type="button"
                  onClick={() => setHasShadow(!hasShadow)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    hasShadow ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      hasShadow ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Generate Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-pink-500 transition-all active:scale-[0.99] disabled:opacity-60"
              >
                <Wand2 className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? t.generating : t.generateBtn}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Sticker Preview & Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-24 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Live Canvas Preview
                </span>
                <span className="text-[11px] text-slate-500 font-mono-code tabular-nums">
                  512×512
                </span>
              </div>
              <span className="text-xs text-indigo-400 font-medium">
                {t.canvasResolution}
              </span>
            </div>

            {/* Checkered Sticker Viewport */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center p-6 shadow-inner">
              {/* Transparency Checkerboard Pattern */}
              <div 
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: `radial-gradient(#475569 1px, transparent 1px)`,
                  backgroundSize: '16px 16px',
                }}
              />

              {/* Rendered Sticker Artwork */}
              {customPhotoUrl ? (
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                  <div 
                    className="relative w-72 h-72 rounded-full overflow-hidden border-[12px] border-white shadow-2xl flex items-center justify-center"
                    style={{
                      boxShadow: hasShadow ? '0 20px 25px -5px rgba(0, 0, 0, 0.5)' : 'none',
                    }}
                  >
                    <img 
                      src={customPhotoUrl} 
                      alt="Custom Sticker" 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {captionPosition !== 'none' && caption && (
                    <div className="absolute bottom-6 z-20 rounded-full border-2 border-white bg-slate-900 px-5 py-1.5 text-xs font-bold text-white shadow-xl font-myanmar">
                      {caption}
                    </div>
                  )}
                </div>
              ) : (
                <div 
                  className={`relative z-10 w-full h-full flex items-center justify-center transition-transform hover:scale-105 duration-200 ${
                    hasShadow ? 'drop-shadow-2xl' : ''
                  }`}
                  dangerouslySetInnerHTML={{ __html: currentSvg }}
                />
              )}

              {/* Hidden 512x512 Canvas for PNG/WebP exports */}
              <canvas
                ref={canvasRef}
                width={512}
                height={512}
                className="hidden"
              />
            </div>

            {/* Action Bar */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleDownload('webp')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-4 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all active:scale-95"
              >
                <Download className="h-4 w-4" />
                <span className="font-myanmar">{lang === 'my' ? 'Telegram စတစ်ကာ ဒေါင်းလုဒ်ရယူမည် (512x512 WebP)' : 'Download Telegram Sticker (512x512 WebP)'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDownload('png')}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2.5 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{t.downloadPng}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownload('webp')}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2.5 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <Download className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{t.downloadWebp}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{t.copiedNotice}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>{t.copySticker}</span>
                  </>
                )}
              </button>

              {/* Real Telegram Bot Quick Action */}
              <a
                href="https://t.me/sticker_craftt_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-sky-500/30 bg-sky-950/40 hover:bg-sky-900/50 px-4 py-2 text-xs font-semibold text-sky-300 transition-colors shadow-sm"
              >
                <Send className="h-3.5 w-3.5 text-sky-400" />
                <span className="font-myanmar">{lang === 'my' ? 'Telegram Bot (@sticker_craftt_bot) ဖြင့် ဖွင့်မည်' : 'Open in @sticker_craftt_bot'}</span>
                <ExternalLink className="h-3 w-3 text-sky-400/70" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Inspirations Gallery with Myanmar Stickers & Categories */}
      <div className="mt-14 pt-8 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
              <span>{lang === 'my' ? 'စတစ်ကာ အမျိုးအစားများ (Categories)' : 'Sticker Categories & Library'}</span>
              <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2.5 py-0.5 rounded-full font-sans">
                {lang === 'my' ? 'မြန်မာ & VIP ပါဝင်သည်' : 'Myanmar & VIP Included'}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-myanmar">
              {lang === 'my' 
                ? 'အမျိုးအစားအလိုက် ရွေးချယ်ပြီး စတစ်ကာတစ်ခုချင်းစီကို စိတ်ကြိုက် ပြုပြင်နိုင်ပါသည်'
                : 'Filter by category and click any sticker to customize or add to your pack'}
            </p>
          </div>

          {/* Connected Telegram Bot Status Pill */}
          <a
            href="https://t.me/sticker_craftt_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-sky-500/30 bg-sky-950/30 hover:bg-sky-900/40 transition-colors text-xs text-sky-300 self-start sm:self-auto"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono-code font-semibold">@sticker_craftt_bot</span>
            <ExternalLink className="h-3 w-3 text-sky-400" />
          </a>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5 no-scrollbar">
          {CATEGORIES_LIST.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? cat.id === 'vip' 
                    ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span className="font-myanmar">{lang === 'my' ? cat.nameMy : cat.nameEn}</span>
              {cat.badge && (
                <span className={`ml-1 text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                  cat.id === 'vip' ? 'bg-slate-950/20 text-slate-950' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {cat.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Special VIP Category Banner when VIP is selected */}
        {selectedCategory === 'vip' && (
          <div className="mb-6 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/50 via-slate-900 to-amber-950/50 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Crown className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-myanmar">
                    {lang === 'my' ? 'ဝယ်ယူအသုံးပြုရမည့် VIP စတစ်ကာအတွဲများ' : 'VIP Premium Sticker Packs'}
                  </h3>
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    Wave / AYA Pay
                  </span>
                </div>
                <p className="text-xs text-amber-200/80 mt-0.5 font-myanmar">
                  {lang === 'my' 
                    ? 'Wave Pay သို့မဟုတ် AYA Pay (09779944100) ဖြင့် 3,000 MMK လွှဲပြီး VIP စတစ်ကာအားလုံးကို တစ်သက်တာ အပြည့်အဝ ဖွင့်နိုင်ပါသည်' 
                    : 'Transfer 3,000 MMK to 09779944100 (Wave / AYA Pay) to unlock all VIP packs instantly'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText('09779944100');
                  alert(lang === 'my' ? 'ဖုန်းနံပါတ် 09779944100 ကို ကူးယူပြီးပါပြီ (Wave Pay / AYA Pay)' : 'Copied 09779944100 to clipboard!');
                }}
                className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-amber-500/30 bg-slate-900/90 text-amber-300 text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Copy 09779944100</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const allVipIds = INITIAL_PRESETS.filter(p => p.isVip).map(p => p.id);
                  setUnlockedVipIds(prev => Array.from(new Set([...prev, ...allVipIds])));
                  confetti({
                    particleCount: 60,
                    spread: 80,
                    origin: { y: 0.6 },
                    colors: ['#f59e0b', '#10b981', '#6366f1']
                  });
                  alert(lang === 'my' ? 'VIP စတစ်ကာအားလုံး ဖွင့်လှစ်ပြီးပါပြီ! စိတ်ကြိုက် အသုံးပြုနိုင်ပါပြီ။' : 'All VIP stickers unlocked! Enjoy unlimited usage.');
                }}
                className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-95 whitespace-nowrap font-myanmar"
              >
                <Crown className="h-4 w-4" />
                <span>{lang === 'my' ? 'VIP အားလုံး ချက်ချင်းဖွင့်မည်' : 'Unlock All VIP'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Filtered Preset Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {INITIAL_PRESETS.filter((p) => selectedCategory === 'all' || (selectedCategory === 'vip' ? p.isVip : p.category === selectedCategory)).map((preset) => {
            const isVipLocked = preset.isVip && !unlockedVipIds.includes(preset.id);

            return (
              <div
                key={preset.id}
                onClick={() => {
                  if (isVipLocked) {
                    setVipModalSticker(preset);
                  } else {
                    handleLoadPreset(preset);
                  }
                }}
                className={`group relative flex flex-col items-center p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                  preset.isVip
                    ? 'border-amber-500/40 bg-gradient-to-b from-amber-950/20 to-slate-900/60 hover:border-amber-400'
                    : 'border-slate-800/90 bg-slate-900/40 hover:border-indigo-500/80 hover:bg-slate-900/80'
                }`}
              >
                {/* VIP or Tag Badge */}
                {preset.isVip && (
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-md bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.5 text-[9px] font-bold text-amber-300">
                    <Crown className="h-3 w-3 text-amber-400" />
                    <span>{isVipLocked ? `${preset.priceMMK} K` : 'UNLOCKED'}</span>
                  </div>
                )}

                <div className="aspect-square w-full flex items-center justify-center p-2 mb-2 bg-slate-950/50 rounded-xl group-hover:scale-105 transition-transform relative">
                  <img
                    src={preset.imageUrl}
                    alt={preset.title}
                    className={`max-h-full max-w-full drop-shadow-md ${isVipLocked ? 'opacity-80' : ''}`}
                    referrerPolicy="no-referrer"
                  />
                  {isVipLocked && (
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
                      <div className="h-8 w-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg">
                        <Lock className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                </div>

                <span className="w-full truncate text-xs font-bold text-slate-200 group-hover:text-indigo-400 transition-colors font-myanmar">
                  {preset.captionText || preset.title}
                </span>

                <div className="mt-1 flex items-center justify-between w-full text-[10px] text-slate-500">
                  <span className="capitalize">{preset.style}</span>
                  {preset.isVip ? (
                    <span className="text-amber-400 font-semibold font-myanmar">
                      {isVipLocked ? 'ဝယ်ယူရန်' : 'ရရှိပြီး'}
                    </span>
                  ) : (
                    <span className="text-slate-400">Free</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* VIP Sticker Unlock Modal */}
      {vipModalSticker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl border border-amber-500/30 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Crown className="h-6 w-6 text-amber-400" />
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                    VIP Premium Sticker
                  </span>
                  <h3 className="font-display text-lg font-bold text-white">
                    {vipModalSticker.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setVipModalSticker(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="aspect-square w-48 h-48 mx-auto rounded-2xl bg-slate-950 p-4 flex items-center justify-center border border-slate-800 shadow-inner">
              <img
                src={vipModalSticker.imageUrl}
                alt={vipModalSticker.title}
                className="max-h-full max-w-full drop-shadow-xl"
              />
            </div>

            {/* Payment Details */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-myanmar">စျေးနှုန်း:</span>
                <span className="font-mono-code font-bold text-amber-400 text-sm">
                  {vipModalSticker.priceMMK || 3000} MMK
                </span>
              </div>
              
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-400 block font-myanmar">Wave Pay / AYA Pay:</span>
                  <span className="font-mono-code text-sm font-bold text-white">09779944100</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText('09779944100');
                    alert(lang === 'my' ? 'ဖုန်းနံပါတ် 09779944100 ကို ကူးယူပြီးပါပြီ!' : 'Phone number copied: 09779944100');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  Copy နံပါတ်
                </button>
              </div>
            </div>

            {/* Unlock Button */}
            <button
              type="button"
              onClick={() => {
                setUnlockedVipIds((prev) => [...prev, vipModalSticker.id]);
                handleLoadPreset(vipModalSticker);
                setVipModalSticker(null);
                confetti({
                  particleCount: 30,
                  spread: 60,
                  origin: { y: 0.6 },
                  colors: ['#f59e0b', '#10b981'],
                });
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-orange-400 transition-all active:scale-95 font-myanmar"
            >
              <Crown className="h-4 w-4" />
              <span>{lang === 'my' ? 'ငွေလွှဲအတည်ပြုပြီး ချက်ချင်း အသုံးပြုမည် (Unlock)' : 'Unlock VIP Sticker Now'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
