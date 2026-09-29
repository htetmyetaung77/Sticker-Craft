import { StickerItem, StickerStyle, StickerEmotion } from '../types';

export const STYLES_LIST: { id: StickerStyle; icon: string; previewColor: string }[] = [
  { id: '3d-cute', icon: '🧸', previewColor: 'from-amber-400 to-orange-500' },
  { id: 'chibi', icon: '🐣', previewColor: 'from-pink-400 to-rose-500' },
  { id: 'anime', icon: '✨', previewColor: 'from-violet-400 to-purple-600' },
  { id: 'pixel', icon: '👾', previewColor: 'from-emerald-400 to-teal-600' },
  { id: 'comic', icon: '💥', previewColor: 'from-yellow-400 to-red-500' },
  { id: 'cyberpunk', icon: '⚡', previewColor: 'from-cyan-400 to-fuchsia-600' },
  { id: 'claymation', icon: '🎨', previewColor: 'from-lime-400 to-green-600' },
  { id: 'holographic', icon: '🔮', previewColor: 'from-blue-400 to-indigo-600' },
  { id: 'vintage', icon: '📜', previewColor: 'from-stone-400 to-amber-700' },
  { id: 'graffiti', icon: '🔥', previewColor: 'from-red-500 to-amber-500' },
];

export const EMOTIONS_LIST: { id: StickerEmotion; emoji: string }[] = [
  { id: 'joy', emoji: '😊' },
  { id: 'cool', emoji: '😎' },
  { id: 'love', emoji: '😍' },
  { id: 'laughing', emoji: '😂' },
  { id: 'shocked', emoji: '🤯' },
  { id: 'angry', emoji: '😡' },
  { id: 'thinking', emoji: '🤔' },
  { id: 'thumbsup', emoji: '👍' },
  { id: 'party', emoji: '🎉' },
  { id: 'crying', emoji: '😭' },
];

export const SAMPLE_PROMPTS = [
  'Cute Golden Retriever puppy wearing oversized retro sunglasses and headset',
  'Cyberpunk cat hacker with neon cyan goggles typing on a holographic laptop',
  'Chibi ninja panda throwing steamed dumplings like shurikens',
  '3D claymation avocado lifting tiny barbell weights enthusiastically',
  'Retro comic superhero hamster flying with a tiny red cape and thumbs up',
  'Sleepy lavender bunny wrapped like a burrito in a cozy starry blanket',
  'Kawaii bubble tea cup with sparkling boba pearls doing a victory dance',
  'Pixel art dragon sipping matcha latte next to a tiny roaring campfire',
  'Baby dinosaur wearing roller skates with speed lines and heart sunglasses'
];

/**
 * Generates an SVG string representation of a sticker based on character, style and emotion.
 * Used for instant vector preview and crisp 512x512 canvas rendering.
 */
/**
 * Generates an authentic Telegram-style vector sticker SVG.
 * Features expressive mascots (Cat, Chibi Anime, Cool Doge, Meme Frog),
 * multi-layered die-cut borders, Telegram gloss highlights, and comic speech bubbles.
 */
export function generateStickerSvg(
  prompt: string,
  style: StickerStyle,
  emotion: StickerEmotion,
  badgeText?: string
): string {
  const pLower = (prompt || '').toLowerCase();
  
  // Character archetype detection
  const isCat = pLower.includes('cat') || pLower.includes('neko') || pLower.includes('kitten') || pLower.includes('ကြောင်') || style === 'chibi';
  const isDoge = pLower.includes('dog') || pLower.includes('puppy') || pLower.includes('shiba') || pLower.includes('ခွေး');
  const isFrog = pLower.includes('frog') || pLower.includes('meme') || pLower.includes('ဟဲဟဲ') || emotion === 'laughing';
  const isAnime = style === 'anime' || pLower.includes('anime') || pLower.includes('waifu') || pLower.includes('girl');

  // Gradient themes
  let gradStart = '#6366f1';
  let gradEnd = '#a855f7';
  let accentColor = '#f59e0b';
  let earColor = '#fda4af';

  if (style === 'cyberpunk') {
    gradStart = '#06b6d4';
    gradEnd = '#d946ef';
    accentColor = '#f43f5e';
  } else if (style === 'chibi' || emotion === 'love') {
    gradStart = '#f472b6';
    gradEnd = '#ec4899';
    accentColor = '#fb7185';
  } else if (style === 'comic') {
    gradStart = '#f59e0b';
    gradEnd = '#ef4444';
    accentColor = '#3b82f6';
  } else if (style === 'pixel') {
    gradStart = '#10b981';
    gradEnd = '#059669';
    accentColor = '#fbbf24';
  } else if (style === 'holographic') {
    gradStart = '#818cf8';
    gradEnd = '#c084fc';
    accentColor = '#38bdf8';
  } else {
    // 3d-cute / default
    gradStart = '#fb923c';
    gradEnd = '#f43f5e';
    accentColor = '#facc15';
  }

  // Mascot Specific Ears & Features
  let earsSvg = '';
  if (isCat) {
    // Pointed cat ears with inner pink shading
    earsSvg = `
      <!-- Cat Ears Left -->
      <polygon points="110,130 145,50 185,120" fill="url(#tg-grad)" stroke="#ffffff" stroke-width="12" stroke-linejoin="round"/>
      <polygon points="120,122 145,68 175,116" fill="${earColor}"/>
      <!-- Cat Ears Right -->
      <polygon points="310,130 275,50 235,120" fill="url(#tg-grad)" stroke="#ffffff" stroke-width="12" stroke-linejoin="round"/>
      <polygon points="300,122 275,68 245,116" fill="${earColor}"/>
    `;
  } else if (isDoge) {
    // Fluffy floppy puppy ears
    earsSvg = `
      <ellipse cx="100" cy="140" rx="30" ry="50" transform="rotate(-20 100 140)" fill="url(#tg-grad)" stroke="#ffffff" stroke-width="12"/>
      <ellipse cx="320" cy="140" rx="30" ry="50" transform="rotate(20 320 140)" fill="url(#tg-grad)" stroke="#ffffff" stroke-width="12"/>
    `;
  } else if (isAnime) {
    // Anime hair tufts and ribbons
    earsSvg = `
      <path d="M 120 100 Q 150 40 210 50 Q 270 40 300 100" fill="none" stroke="url(#tg-grad)" stroke-width="26" stroke-linecap="round"/>
      <polygon points="110,90 120,60 145,85" fill="${accentColor}"/>
      <polygon points="310,90 300,60 275,85" fill="${accentColor}"/>
    `;
  } else {
    // Round cute bear ears
    earsSvg = `
      <circle cx="120" cy="90" r="38" fill="url(#tg-grad)" stroke="#ffffff" stroke-width="12"/>
      <circle cx="120" cy="90" r="22" fill="${earColor}"/>
      <circle cx="300" cy="90" r="38" fill="url(#tg-grad)" stroke="#ffffff" stroke-width="12"/>
      <circle cx="300" cy="90" r="22" fill="${earColor}"/>
    `;
  }

  // Facial Expression rendering (Telegram style)
  let eyesSvg = '';
  let mouthSvg = '';
  let accessorySvg = '';

  switch (emotion) {
    case 'cool':
      // Retro cool dark shades with white reflection stripe
      eyesSvg = `
        <g id="tg-sunglasses">
          <path d="M 120 160 Q 165 145 200 165 L 205 195 Q 165 215 120 195 Z" fill="#0f172a" stroke="#ffffff" stroke-width="6"/>
          <path d="M 220 165 Q 255 145 300 160 L 300 195 Q 255 215 215 195 Z" fill="#0f172a" stroke="#ffffff" stroke-width="6"/>
          <line x1="195" y1="172" x2="225" y2="172" stroke="#0f172a" stroke-width="8"/>
          <!-- Lens Glare -->
          <line x1="135" y1="168" x2="185" y2="188" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
          <line x1="235" y1="168" x2="285" y2="188" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
        </g>
      `;
      mouthSvg = `<path d="M 190 235 Q 215 250 240 230" fill="none" stroke="#0f172a" stroke-width="8" stroke-linecap="round"/>`;
      break;

    case 'love':
      // Sparkly heart eyes with blushing cheeks
      eyesSvg = `
        <!-- Heart Eyes -->
        <g fill="#e11d48">
          <path d="M 155 160 C 140 140, 115 150, 115 170 C 115 190, 145 205, 155 218 C 165 205, 195 190, 195 170 C 195 150, 170 140, 155 160 Z"/>
          <path d="M 265 160 C 250 140, 225 150, 225 170 C 225 190, 255 205, 265 218 C 275 205, 305 190, 305 170 C 305 150, 280 140, 265 160 Z"/>
        </g>
      `;
      mouthSvg = `
        <path d="M 190 230 Q 210 255 230 230 Z" fill="#f43f5e"/>
        <path d="M 190 230 Q 210 255 230 230" fill="none" stroke="#1e1b4b" stroke-width="6"/>
      `;
      accessorySvg = `
        <!-- Floating hearts -->
        <path d="M 330 90 C 320 75, 305 85, 305 98 C 305 110, 325 120, 330 130 C 335 120, 355 110, 355 98 C 355 85, 340 75, 330 90 Z" fill="#f43f5e"/>
      `;
      break;

    case 'laughing':
      // Laughing to tears (Joyful Telegram meme)
      eyesSvg = `
        <path d="M 130 180 Q 160 150 185 180" fill="none" stroke="#1e1b4b" stroke-width="10" stroke-linecap="round"/>
        <path d="M 235 180 Q 260 150 290 180" fill="none" stroke="#1e1b4b" stroke-width="10" stroke-linecap="round"/>
        <!-- Tears of Joy -->
        <ellipse cx="115" cy="190" rx="14" ry="18" fill="#38bdf8"/>
        <ellipse cx="305" cy="190" rx="14" ry="18" fill="#38bdf8"/>
      `;
      mouthSvg = `
        <path d="M 170 215 Q 210 280 250 215 Z" fill="#dc2626"/>
        <path d="M 175 218 Q 210 240 245 218 Z" fill="#ffffff"/>
        <path d="M 190 248 Q 210 270 230 248 Z" fill="#f87171"/>
      `;
      break;

    case 'shocked':
      eyesSvg = `
        <circle cx="155" cy="175" r="26" fill="#ffffff" stroke="#1e1b4b" stroke-width="6"/>
        <circle cx="155" cy="175" r="12" fill="#1e1b4b"/>
        <circle cx="265" cy="175" r="26" fill="#ffffff" stroke="#1e1b4b" stroke-width="6"/>
        <circle cx="265" cy="175" r="12" fill="#1e1b4b"/>
      `;
      mouthSvg = `<ellipse cx="210" cy="245" rx="22" ry="32" fill="#1e1b4b"/>`;
      accessorySvg = `
        <line x1="80" y1="120" x2="105" y2="135" stroke="#facc15" stroke-width="8" stroke-linecap="round"/>
        <line x1="340" y1="120" x2="315" y2="135" stroke="#facc15" stroke-width="8" stroke-linecap="round"/>
      `;
      break;

    case 'thinking':
      eyesSvg = `
        <!-- Side-eye thinking -->
        <circle cx="155" cy="175" r="22" fill="#ffffff" stroke="#1e1b4b" stroke-width="6"/>
        <circle cx="168" cy="170" r="10" fill="#1e1b4b"/>
        <circle cx="265" cy="175" r="22" fill="#ffffff" stroke="#1e1b4b" stroke-width="6"/>
        <circle cx="278" cy="170" r="10" fill="#1e1b4b"/>
      `;
      mouthSvg = `<path d="M 190 240 L 235 235" stroke="#1e1b4b" stroke-width="8" stroke-linecap="round"/>`;
      accessorySvg = `
        <!-- Hand on chin / Thinking bubble -->
        <circle cx="210" cy="285" r="18" fill="url(#tg-grad)" stroke="#ffffff" stroke-width="8"/>
      `;
      break;

    case 'party':
      eyesSvg = `
        <circle cx="155" cy="175" r="18" fill="#1e1b4b"/>
        <circle cx="160" cy="170" r="6" fill="#ffffff"/>
        <circle cx="265" cy="175" r="18" fill="#1e1b4b"/>
        <circle cx="270" cy="170" r="6" fill="#ffffff"/>
      `;
      mouthSvg = `<path d="M 185 220 Q 210 260 235 220 Z" fill="#ef4444"/>`;
      accessorySvg = `
        <!-- Party cone hat -->
        <polygon points="210,30 165,115 255,115" fill="#f59e0b" stroke="#ffffff" stroke-width="8"/>
        <circle cx="210" cy="25" r="12" fill="#ec4899"/>
      `;
      break;

    default: // Joy / Happy
      eyesSvg = `
        <!-- Big Sparkle Anime Eyes -->
        <circle cx="155" cy="175" r="20" fill="#1e1b4b"/>
        <circle cx="160" cy="168" r="8" fill="#ffffff"/>
        <circle cx="150" cy="184" r="4" fill="#ffffff"/>
        <circle cx="265" cy="175" r="20" fill="#1e1b4b"/>
        <circle cx="270" cy="168" r="8" fill="#ffffff"/>
        <circle cx="260" cy="184" r="4" fill="#ffffff"/>
      `;
      mouthSvg = isCat 
        ? `<path d="M 185 228 Q 198 240 210 228 Q 222 240 235 228" fill="none" stroke="#1e1b4b" stroke-width="7" stroke-linecap="round"/>`
        : `<path d="M 185 225 Q 210 258 235 225 Z" fill="#ef4444"/>`;
      break;
  }

  // Telegram-style Whiskers for Cats
  let whiskersSvg = '';
  if (isCat) {
    whiskersSvg = `
      <line x1="85" y1="205" x2="135" y2="210" stroke="#1e1b4b" stroke-width="4" stroke-linecap="round"/>
      <line x1="80" y1="225" x2="135" y2="225" stroke="#1e1b4b" stroke-width="4" stroke-linecap="round"/>
      <line x1="335" y1="205" x2="285" y2="210" stroke="#1e1b4b" stroke-width="4" stroke-linecap="round"/>
      <line x1="340" y1="225" x2="285" y2="225" stroke="#1e1b4b" stroke-width="4" stroke-linecap="round"/>
    `;
  }

  // VIP Crown accessory for royal / VIP stickers
  const isRoyal = pLower.includes('vip') || pLower.includes('gold') || pLower.includes('queen') || pLower.includes('king') || pLower.includes('dragon') || pLower.includes('crown') || pLower.includes('သူဌေး');
  let crownSvg = '';
  if (isRoyal) {
    crownSvg = `
      <!-- Royal Gold Crown with Sparkling Gems -->
      <g transform="translate(210, 48)">
        <polygon points="-50,20 -35,-25 -15,10 0,-35 15,10 35,-25 50,20" fill="#facc15" stroke="#ffffff" stroke-width="6" stroke-linejoin="round"/>
        <rect x="-48" y="16" width="96" height="14" rx="4" fill="#eab308" stroke="#ffffff" stroke-width="4"/>
        <circle cx="0" cy="-35" r="6" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
        <circle cx="-35" cy="-25" r="5" fill="#38bdf8" stroke="#ffffff" stroke-width="2"/>
        <circle cx="35" cy="-25" r="5" fill="#38bdf8" stroke="#ffffff" stroke-width="2"/>
        <circle cx="0" cy="23" r="4" fill="#10b981"/>
        <circle cx="-25" cy="23" r="4" fill="#ec4899"/>
        <circle cx="25" cy="23" r="4" fill="#ec4899"/>
      </g>
    `;
  }

  // Telegram Paws at bottom with cute pink paw beans (pads)
  const pawsSvg = `
    <!-- Left Paw with Paw Beans -->
    <ellipse cx="140" cy="305" rx="28" ry="18" fill="#ffffff" stroke="#ffffff" stroke-width="8"/>
    <ellipse cx="140" cy="305" rx="24" ry="15" fill="url(#tg-grad)"/>
    <ellipse cx="140" cy="306" rx="9" ry="6" fill="#fb7185"/>
    <circle cx="130" cy="296" r="3.5" fill="#fb7185"/>
    <circle cx="140" cy="293" r="3.5" fill="#fb7185"/>
    <circle cx="150" cy="296" r="3.5" fill="#fb7185"/>

    <!-- Right Paw with Paw Beans -->
    <ellipse cx="280" cy="305" rx="28" ry="18" fill="#ffffff" stroke="#ffffff" stroke-width="8"/>
    <ellipse cx="280" cy="305" rx="24" ry="15" fill="url(#tg-grad)"/>
    <ellipse cx="280" cy="306" rx="9" ry="6" fill="#fb7185"/>
    <circle cx="270" cy="296" r="3.5" fill="#fb7185"/>
    <circle cx="280" cy="293" r="3.5" fill="#fb7185"/>
    <circle cx="290" cy="296" r="3.5" fill="#fb7185"/>
  `;

  // Speech Bubble with Telegram comic styling
  let badgeSvg = '';
  if (badgeText) {
    badgeSvg = `
      <!-- Telegram Comic Speech Bubble -->
      <g transform="translate(210, 355)">
        <!-- Speech Bubble Pointer Tail -->
        <polygon points="-15,-30 0,-15 15,-30" fill="#ffffff"/>
        <!-- Main Bubble Pill with White Border -->
        <rect x="-145" y="-22" width="290" height="48" rx="24" fill="#0f172a" stroke="#ffffff" stroke-width="8"/>
        <text x="0" y="8" font-family="'Padauk', sans-serif" font-weight="bold" font-size="19" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">
          ${badgeText}
        </text>
      </g>
    `;
  }

  // Assemble full Telegram Die-Cut Sticker SVG
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 420" width="100%" height="100%">
    <defs>
      <linearGradient id="tg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${gradStart}" />
        <stop offset="100%" stop-color="${gradEnd}" />
      </linearGradient>
      <!-- Telegram Sticker Die-cut Soft Drop Shadow -->
      <filter id="tg-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="12" stdDeviation="12" flood-color="rgba(0,0,0,0.38)"/>
      </filter>
    </defs>

    <!-- Outer Thick White Die-Cut Border (Signature Telegram Sticker Look) -->
    <g filter="url(#tg-shadow)">
      <!-- Thick Base Outline -->
      <ellipse cx="210" cy="205" rx="145" ry="135" fill="#ffffff" stroke="#ffffff" stroke-width="26" stroke-linejoin="round"/>
      ${earsSvg}
    </g>

    <!-- Main Character Body Shape -->
    <ellipse cx="210" cy="205" rx="135" ry="125" fill="url(#tg-grad)"/>

    <!-- Telegram Glossy Top Highlight -->
    <ellipse cx="160" cy="125" rx="60" ry="25" transform="rotate(-25 160 125)" fill="#ffffff" opacity="0.32"/>

    <!-- Cute Blush Cheeks with anime lines -->
    <ellipse cx="115" cy="215" rx="22" ry="14" fill="#f43f5e" opacity="0.5"/>
    <line x1="108" y1="210" x2="114" y2="220" stroke="#f43f5e" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="115" y1="210" x2="121" y2="220" stroke="#f43f5e" stroke-width="2.5" stroke-linecap="round"/>

    <ellipse cx="305" cy="215" rx="22" ry="14" fill="#f43f5e" opacity="0.5"/>
    <line x1="298" y1="210" x2="304" y2="220" stroke="#f43f5e" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="305" y1="210" x2="311" y2="220" stroke="#f43f5e" stroke-width="2.5" stroke-linecap="round"/>

    <!-- Crown if VIP or royal -->
    ${crownSvg}

    <!-- Eyes, Mouth & Accessories -->
    ${eyesSvg}
    ${mouthSvg}
    ${whiskersSvg}
    ${accessorySvg}
    ${pawsSvg}

    <!-- Speech Caption / Badge -->
    ${badgeSvg}
  </svg>`;
}

export interface CategoryInfo {
  id: string;
  nameEn: string;
  nameMy: string;
  icon: string;
  badge?: string;
}

export const CATEGORIES_LIST: CategoryInfo[] = [
  { id: 'all', nameEn: 'All Stickers', nameMy: 'အားလုံး', icon: '🌟' },
  { id: 'vip', nameEn: 'VIP Paid Packs', nameMy: 'ဝယ်သုံးရမည့် VIP အတွဲများ', icon: '👑', badge: 'VIP' },
  { id: 'romance', nameEn: 'Romance & Love', nameMy: 'အချစ်ရေးနှင့် စုံတွဲ', icon: '💖', badge: 'Hot' },
  { id: 'glamour', nameEn: 'Glamour & Sassy', nameMy: 'ဆွဲဆောင်မှုရှိသော အလန်းစတိုင်', icon: '✨', badge: 'Trending' },
  { id: 'myanmar', nameEn: 'Myanmar Trending', nameMy: 'မြန်မာစကားပြောနှင့် စာတန်း', icon: '🇲🇲', badge: 'Popular' },
  { id: 'anime', nameEn: 'Anime & Waifu', nameMy: 'ကာတွန်း & Waifu', icon: '🌸', badge: 'Top' },
  { id: 'memes', nameEn: 'Funny Memes & Trolls', nameMy: 'ဟာသနှင့် မီမ်းများ', icon: '🤣' },
  { id: 'animals', nameEn: 'Cute Pets & Cats', nameMy: 'ချစ်စရာ ကြောင်/ခွေး', icon: '🐾' },
  { id: 'gaming', nameEn: 'Gaming & Cyber', nameMy: 'ဂိမ်းစတိုင်', icon: '🎮' },
  { id: 'food', nameEn: 'Cafe & Foodies', nameMy: 'အစားအသောက် & ကော်ဖီ', icon: '🧋' },
];

export const MYANMAR_STICKER_PHRASES = [
  'မိုက်တယ်ဟေ့ 🔥',
  'ချစ်တယ်နော် ❤️',
  'ဟဲဟဲ 😂',
  'OK စိုပြေ 👌',
  'ရင်ခုန်တယ်နော် 💓',
  'လွမ်းတယ် 🥺',
  'အာဘွား 😘',
  'စားပြီးပြီလား 🍜',
  'အိပ်ချင်ပြီ 😴',
  'ဘာလဲဟ 🧐',
  'ရမ်းချစ်တယ် 😍',
  'ခွီနေရတယ် 🤣',
  'သာဓု သာဓု 🙏',
  'အားတင်းထား 💪',
  'အရမ်းလှတယ် ✨',
  'သတိရနေတယ် 💌',
  'မင်္ဂလာပါ 🌸',
];

export const INITIAL_PRESETS: StickerItem[] = [
  // Myanmar Category
  {
    id: 'preset-myanmar-cool',
    title: 'မိုက်တယ်ဟေ့ (Super Cool)',
    prompt: 'Cute red panda wearing gold sunglasses and hip hop jacket',
    style: '3d-cute',
    emotion: 'cool',
    category: 'myanmar',
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(generateStickerSvg('Super cool red panda', '3d-cute', 'cool', 'မိုက်တယ်ဟေ့')),
    captionText: 'မိုက်တယ်ဟေ့',
    captionPosition: 'bottom',
    captionColor: '#ffffff',
    captionBgColor: '#0f172a',
    outlineWidth: 14,
    outlineColor: '#ffffff',
    hasShadow: true,
    createdAt: Date.now() - 4000000,
  },
  {
    id: 'preset-myanmar-love',
    title: 'ချစ်တယ်နော် (Love Cat)',
    prompt: 'Chibi fluffy kitten holding big heart with blushing smile',
    style: 'chibi',
    emotion: 'love',
    category: 'myanmar',
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(generateStickerSvg('Chibi love kitten', 'chibi', 'love', 'ချစ်တယ်နော်')),
    captionText: 'ချစ်တယ်နော်',
    captionPosition: 'bottom',
    captionColor: '#ffffff',
    captionBgColor: '#ec4899',
    outlineWidth: 14,
    outlineColor: '#ffffff',
    hasShadow: true,
    createdAt: Date.now() - 3800000,
  },
  {
    id: 'preset-myanmar-hehe',
    title: 'ဟဲဟဲ (Hehe Frog)',
    prompt: 'Funny cute green frog laughing giggling with sparkling eyes',
    style: 'comic',
    emotion: 'laughing',
    category: 'myanmar',
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(generateStickerSvg('Funny laughing frog', 'comic', 'laughing', 'ဟဲဟဲ')),
    captionText: 'ဟဲဟဲ',
    captionPosition: 'bottom',
    captionColor: '#ffffff',
    captionBgColor: '#10b981',
    outlineWidth: 14,
    outlineColor: '#ffffff',
    hasShadow: true,
    createdAt: Date.now() - 3700000,
  },
  {
    id: 'preset-myanmar-ok',
    title: 'OK စိုပြေ (All Good)',
    prompt: 'Happy golden retriever giving confident thumbs up with sparkle',
    style: '3d-cute',
    emotion: 'thumbsup',
    category: 'myanmar',
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(generateStickerSvg('Happy golden retriever thumbsup', '3d-cute', 'thumbsup', 'OK စိုပြေ')),
    captionText: 'OK စိုပြေ',
    captionPosition: 'bottom',
    captionColor: '#ffffff',
    captionBgColor: '#3b82f6',
    outlineWidth: 14,
    outlineColor: '#ffffff',
    hasShadow: true,
    createdAt: Date.now() - 3650000,
  },

  // Romance Category (Cute/Couple)
  {
    id: 'preset-romance-kiss',
    title: 'Sweet Heart Kiss',
    prompt: 'Two cute chibi sweethearts sharing a blushing sweet kiss under stars',
    style: 'chibi',
    emotion: 'love',
    category: 'romance',
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(generateStickerSvg('Chibi sweethearts kissing', 'chibi', 'love', 'MY LOVE')),
    captionText: 'MY LOVE',
    captionPosition: 'bottom',
    captionColor: '#ffffff',
    captionBgColor: '#f43f5e',
    outlineWidth: 14,
    outlineColor: '#ffffff',
    hasShadow: true,
    createdAt: Date.now() - 3620000,
  },
  {
    id: 'preset-romance-hug',
    title: 'Cuddle Hugs',
    prompt: 'Warm cozy teddy bears hugging tightly with heart aura',
    style: '3d-cute',
    emotion: 'love',
    category: 'romance',
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(generateStickerSvg('Cute cuddle teddy bears hugging', '3d-cute', 'love', 'HUGS & KISSES')),
    captionText: 'HUGS & KISSES',
    captionPosition: 'bottom',
    captionColor: '#ffffff',
    captionBgColor: '#ec4899',
    outlineWidth: 14,
    outlineColor: '#ffffff',
    hasShadow: true,
    createdAt: Date.now() - 3610000,
  },

  // Anime Category
  {
    id: 'preset-anime-hero',
    title: 'Anime Cyber Blade',
    prompt: 'Cyberpunk anime hero samurai with glowing cyan katana and stylish coat',
    style: 'anime',
    emotion: 'cool',
    category: 'anime',
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(generateStickerSvg('Anime cyberpunk samurai', 'anime', 'cool', 'BANKAI!')),
    captionText: 'BANKAI!',
    captionPosition: 'bottom',
    captionColor: '#ffffff',
    captionBgColor: '#8b5cf6',
    outlineWidth: 14,
    outlineColor: '#ffffff',
    hasShadow: true,
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'preset-anime-sparkle',
    title: 'Magical Girl Shine',
    prompt: 'Anime magical girl winking with sparkling stars and twin tails',
    style: 'anime',
    emotion: 'joy',
    category: 'anime',
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(generateStickerSvg('Anime magical girl winking', 'anime', 'joy', 'SPARKLE')),
    captionText: 'SPARKLE',
    captionPosition: 'bottom',
    captionColor: '#ffffff',
    captionBgColor: '#ec4899',
    outlineWidth: 14,
    outlineColor: '#ffffff',
    hasShadow: true,
    createdAt: Date.now() - 3550000,
  },

  // Animals & Gaming Category
  {
    id: 'preset-shiba-cool',
    title: 'Space Shiba Doge',
    prompt: 'Shiba Inu astronaut chilling in zero gravity with neon visor',
    style: 'cyberpunk',
    emotion: 'cool',
    category: 'animals',
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(generateStickerSvg('Shiba Inu astronaut', 'cyberpunk', 'cool', 'MUCH COOL')),
    captionText: 'MUCH COOL',
    captionPosition: 'bottom',
    captionColor: '#ffffff',
    captionBgColor: '#0f172a',
    outlineWidth: 14,
    outlineColor: '#ffffff',
    hasShadow: true,
    createdAt: Date.now() - 3500000,
  },
  {
    id: 'preset-pixel-shocked',
    title: 'Retro Gamer NANI',
    prompt: 'Retro 8-bit game hero with pixel explosion of shock',
    style: 'pixel',
    emotion: 'shocked',
    category: 'gaming',
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(generateStickerSvg('Retro 8-bit game hero', 'pixel', 'shocked', 'GAME OVER')),
    captionText: 'GAME OVER',
    captionPosition: 'bottom',
    captionColor: '#ffffff',
    captionBgColor: '#10b981',
    outlineWidth: 14,
    outlineColor: '#ffffff',
    hasShadow: true,
    createdAt: Date.now() - 3400000,
  },

  // Glamour Category
  {
    id: 'preset-glamour-diva',
    title: 'Glamour Queen',
    prompt: 'Aesthetic trendy fashion icon wearing designer shades and golden necklace',
    style: 'holographic',
    emotion: 'cool',
    category: 'glamour',
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(generateStickerSvg('Aesthetic fashion icon', 'holographic', 'cool', 'SLAY QUEEN')),
    captionText: 'SLAY QUEEN',
    captionPosition: 'bottom',
    captionColor: '#ffffff',
    captionBgColor: '#d946ef',
    outlineWidth: 14,
    outlineColor: '#ffffff',
    hasShadow: true,
    createdAt: Date.now() - 3300000,
  },

  // Food & Drinks Category
  {
    id: 'preset-food-boba',
    title: 'Happy Boba Dance',
    prompt: 'Kawaii boba milk tea cup with shiny tapioca pearls dancing with straw',
    style: '3d-cute',
    emotion: 'joy',
    category: 'food',
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(generateStickerSvg('Kawaii boba milk tea', '3d-cute', 'joy', 'BOBA TIME')),
    captionText: 'BOBA TIME',
    captionPosition: 'bottom',
    captionColor: '#ffffff',
    captionBgColor: '#f59e0b',
    outlineWidth: 14,
    outlineColor: '#ffffff',
    hasShadow: true,
    createdAt: Date.now() - 3200000,
  },

  // Memes Category
  {
    id: 'preset-comic-laugh',
    title: 'Dead Laughing LOL',
    prompt: 'Pop art comic hamster laughing to tears with golden stars',
    style: 'comic',
    emotion: 'laughing',
    category: 'memes',
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(generateStickerSvg('Pop art comic hamster', 'comic', 'laughing', 'DEAD 💀')),
    captionText: 'DEAD 💀',
    captionPosition: 'bottom',
    captionColor: '#ffffff',
    captionBgColor: '#eab308',
    outlineWidth: 14,
    outlineColor: '#ffffff',
    hasShadow: true,
    createdAt: Date.now() - 3100000,
  },
  {
    id: 'preset-side-eye-doge',
    title: 'Side Eye Bombastic',
    prompt: 'Funny dog giving dramatic suspicious bombastic side eye',
    style: 'comic',
    emotion: 'thinking',
    category: 'memes',
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(generateStickerSvg('Side eye dog meme', 'comic', 'thinking', 'SIDE EYE 👀')),
    captionText: 'SIDE EYE 👀',
    captionPosition: 'bottom',
    captionColor: '#ffffff',
    captionBgColor: '#6366f1',
    outlineWidth: 14,
    outlineColor: '#ffffff',
    hasShadow: true,
    createdAt: Date.now() - 3050000,
  },

  // Additional Romance / Cute Couple Presets
  {
    id: 'preset-romance-crush',
    title: 'ရင်ခုန်တယ်နော် (Crush Vibes)',
    prompt: 'Two blushing fluffy bunnies holding hands with heart sparkles',
    style: 'chibi',
    emotion: 'love',
    category: 'romance',
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(generateStickerSvg('Blushing bunnies holding hands', 'chibi', 'love', 'ရင်ခုန်တယ် 💓')),
    captionText: 'ရင်ခုန်တယ် 💓',
    captionPosition: 'bottom',
    captionColor: '#ffffff',
    captionBgColor: '#f43f5e',
    outlineWidth: 14,
    outlineColor: '#ffffff',
    hasShadow: true,
    createdAt: Date.now() - 3040000,
  },
  {
    id: 'preset-romance-kiss-sweet',
    title: 'Forever Mine Kiss',
    prompt: 'Romantic anime chibi couple sharing sweet romantic kiss with cherry blossoms',
    style: 'anime',
    emotion: 'love',
    category: 'romance',
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(generateStickerSvg('Chibi anime couple sweet kiss', 'anime', 'love', 'FOREVER MINE 💋')),
    captionText: 'FOREVER MINE 💋',
    captionPosition: 'bottom',
    captionColor: '#ffffff',
    captionBgColor: '#ec4899',
    outlineWidth: 14,
    outlineColor: '#ffffff',
    hasShadow: true,
    createdAt: Date.now() - 3030000,
  },

  // Additional Glamour / Sassy Presets
  {
    id: 'preset-glamour-diva-sass',
    title: 'Too Fabulous Sassy',
    prompt: 'Fabulous stylish cat with glitter sunglasses walking on runway',
    style: '3d-cute',
    emotion: 'cool',
    category: 'glamour',
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(generateStickerSvg('Fabulous stylish cat runway', '3d-cute', 'cool', 'TOO FABULOUS ✨')),
    captionText: 'TOO FABULOUS ✨',
    captionPosition: 'bottom',
    captionColor: '#ffffff',
    captionBgColor: '#d946ef',
    outlineWidth: 14,
    outlineColor: '#ffffff',
    hasShadow: true,
    createdAt: Date.now() - 3020000,
  },
  {
    id: 'preset-glamour-aesthetic-gold',
    title: 'Golden Goddess Glow',
    prompt: 'Aesthetic glowing golden fairy with glittering halo and sparkling dust',
    style: 'holographic',
    emotion: 'joy',
    category: 'glamour',
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(generateStickerSvg('Golden glowing aesthetic fairy', 'holographic', 'joy', 'GOLDEN GLOW 👑')),
    captionText: 'GOLDEN GLOW 👑',
    captionPosition: 'bottom',
    captionColor: '#ffffff',
    captionBgColor: '#f59e0b',
    outlineWidth: 14,
    outlineColor: '#ffffff',
    hasShadow: true,
    createdAt: Date.now() - 3010000,
  },

  // Additional Anime & Waifu Presets
  {
    id: 'preset-anime-waifu-neko',
    title: 'Anime Catgirl Waifu Nya~',
    prompt: 'Cute anime neko catgirl with bell choker winking and making heart pose',
    style: 'anime',
    emotion: 'love',
    category: 'anime',
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(generateStickerSvg('Anime neko catgirl winking heart', 'anime', 'love', 'NYA NYA~ 💕')),
    captionText: 'NYA NYA~ 💕',
    captionPosition: 'bottom',
    captionColor: '#ffffff',
    captionBgColor: '#f43f5e',
    outlineWidth: 14,
    outlineColor: '#ffffff',
    hasShadow: true,
    createdAt: Date.now() - 3005000,
  },

  // Additional Myanmar Trending Presets
  {
    id: 'preset-myanmar-confused',
    title: 'ဘာလဲဟ (What The Heck)',
    prompt: 'Funny confused dog scratching head with question marks',
    style: 'comic',
    emotion: 'shocked',
    category: 'myanmar',
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(generateStickerSvg('Funny confused dog question mark', 'comic', 'shocked', 'ဘာလဲဟ 🧐')),
    captionText: 'ဘာလဲဟ 🧐',
    captionPosition: 'bottom',
    captionColor: '#ffffff',
    captionBgColor: '#6366f1',
    outlineWidth: 14,
    outlineColor: '#ffffff',
    hasShadow: true,
    createdAt: Date.now() - 3002000,
  },
  {
    id: 'preset-myanmar-miss-you',
    title: 'လွမ်းတယ် 🥺 (Miss You)',
    prompt: 'Chibi sad puppy with watery big cute eyes holding heart letter',
    style: 'chibi',
    emotion: 'crying',
    category: 'myanmar',
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(generateStickerSvg('Sad cute puppy big eyes', 'chibi', 'crying', 'လွမ်းတယ် 🥺')),
    captionText: 'လွမ်းတယ် 🥺',
    captionPosition: 'bottom',
    captionColor: '#ffffff',
    captionBgColor: '#3b82f6',
    outlineWidth: 14,
    outlineColor: '#ffffff',
    hasShadow: true,
    createdAt: Date.now() - 3001000,
  },

  // VIP / Paid Sticker Items (marked with isVip: true)
  {
    id: 'vip-sticker-gold-dragon',
    title: 'VIP Imperial Gold Dragon',
    prompt: 'Majestic golden dragon with sparkling crystal orb and royal flame aura',
    style: 'holographic',
    emotion: 'cool',
    category: 'myanmar',
    isVip: true,
    priceMMK: 3000,
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(generateStickerSvg('Majestic golden dragon royal', 'holographic', 'cool', 'VIP GOLD 👑')),
    captionText: 'VIP GOLD 👑',
    captionPosition: 'bottom',
    captionColor: '#ffffff',
    captionBgColor: '#f59e0b',
    outlineWidth: 16,
    outlineColor: '#facc15',
    hasShadow: true,
    createdAt: Date.now() - 3000000,
  },
  {
    id: 'vip-sticker-neon-couple',
    title: 'VIP Cyber Romance Duo',
    prompt: 'Cyberpunk lovers in neon raining night holding glowing umbrella together',
    style: 'cyberpunk',
    emotion: 'love',
    category: 'romance',
    isVip: true,
    priceMMK: 3000,
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(generateStickerSvg('Cyberpunk lovers in neon rain', 'cyberpunk', 'love', 'ETERNAL LOVE')),
    captionText: 'ETERNAL LOVE',
    captionPosition: 'bottom',
    captionColor: '#ffffff',
    captionBgColor: '#ec4899',
    outlineWidth: 16,
    outlineColor: '#ffffff',
    hasShadow: true,
    createdAt: Date.now() - 2900000,
  },
  {
    id: 'vip-sticker-glamour-diamond',
    title: 'VIP Diamond Sensation',
    prompt: 'Glamorous sparkling diamond crown wearing luxury cat with champagne glass',
    style: '3d-cute',
    emotion: 'party',
    category: 'glamour',
    isVip: true,
    priceMMK: 3000,
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(generateStickerSvg('Luxury cat with diamond crown', '3d-cute', 'party', 'RICH VIBES 💎')),
    captionText: 'RICH VIBES 💎',
    captionPosition: 'bottom',
    captionColor: '#ffffff',
    captionBgColor: '#8b5cf6',
    outlineWidth: 16,
    outlineColor: '#f43f5e',
    hasShadow: true,
    createdAt: Date.now() - 2800000,
  },
  {
    id: 'vip-sticker-queen-aesthetic',
    title: 'VIP Goddess of Allure',
    prompt: 'Ultra glamorous aesthetic queen with sparkling ruby crown and seductive gaze',
    style: 'holographic',
    emotion: 'cool',
    category: 'glamour',
    isVip: true,
    priceMMK: 5000,
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(generateStickerSvg('Aesthetic glamorous queen ruby crown', 'holographic', 'cool', 'GODDESS VIBES 💋')),
    captionText: 'GODDESS VIBES 💋',
    captionPosition: 'bottom',
    captionColor: '#ffffff',
    captionBgColor: '#e11d48',
    outlineWidth: 16,
    outlineColor: '#facc15',
    hasShadow: true,
    createdAt: Date.now() - 2700000,
  },
  {
    id: 'vip-sticker-myanmar-rich',
    title: 'VIP သူဌေးမင်း (Millionaire Tiger)',
    prompt: 'Royal gold wearing Myanmar royal tiger with money bags and diamond chains',
    style: '3d-cute',
    emotion: 'cool',
    category: 'myanmar',
    isVip: true,
    priceMMK: 3000,
    imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(generateStickerSvg('Royal gold tiger with diamond money', '3d-cute', 'cool', 'သူဌေးမင်း 💰')),
    captionText: 'သူဌေးမင်း 💰',
    captionPosition: 'bottom',
    captionColor: '#ffffff',
    captionBgColor: '#10b981',
    outlineWidth: 16,
    outlineColor: '#facc15',
    hasShadow: true,
    createdAt: Date.now() - 2600000,
  },
];
