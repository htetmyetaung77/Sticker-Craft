export type Language = 'en' | 'my';

export type StickerStyle = 
  | '3d-cute'
  | 'chibi'
  | 'anime'
  | 'pixel'
  | 'comic'
  | 'cyberpunk'
  | 'claymation'
  | 'holographic'
  | 'vintage'
  | 'graffiti';

export type StickerEmotion = 
  | 'joy'
  | 'cool'
  | 'love'
  | 'laughing'
  | 'shocked'
  | 'angry'
  | 'thinking'
  | 'thumbsup'
  | 'party'
  | 'crying';

export type StickerCategory = 
  | 'all'
  | 'myanmar'
  | 'romance'
  | 'anime'
  | 'memes'
  | 'animals'
  | 'gaming'
  | 'glamour'
  | 'food';

export interface StickerItem {
  id: string;
  title: string;
  prompt: string;
  style: StickerStyle;
  emotion: StickerEmotion;
  category?: StickerCategory;
  isVip?: boolean;
  priceMMK?: number;
  imageUrl: string;
  svgData?: string;
  captionText: string;
  captionPosition: 'top' | 'bottom' | 'center' | 'none';
  captionColor: string;
  captionBgColor: string;
  outlineWidth: number;
  outlineColor: string;
  hasShadow: boolean;
  createdAt: number;
}

export interface StickerPack {
  id: string;
  title: string;
  author: string;
  description: string;
  stickers: StickerItem[];
  coverStickerId?: string;
  createdAt: number;
  category?: StickerCategory;
  isVip?: boolean;
  priceMMK?: number;
  downloads?: number;
}

export type AnimationEffect = 
  | 'none'
  | 'bounce'
  | 'pulse'
  | 'spin'
  | 'wiggle'
  | 'shake'
  | 'zoom'
  | 'rainbow';

export interface GifFrame {
  id: string;
  imageUrl: string;
  delayMs: number;
  label?: string;
}

export interface GifProject {
  id: string;
  title: string;
  frames: GifFrame[];
  fps: number;
  width: number;
  height: number;
  effect: AnimationEffect;
  loopMode: 'infinite' | 'once' | 'ping-pong';
  caption: string;
}

export interface BoostingOrder {
  id: string;
  service: 'views' | 'reactions' | 'members' | 'votes';
  targetChannel: string;
  amount: number;
  reactionEmoji?: string;
  status: 'pending' | 'processing' | 'completed';
  progress: number;
  timestamp: number;
  isTrial?: boolean;
}

export interface BoostPlan {
  id: string;
  nameEn: string;
  nameMy: string;
  priceMMK: number;
  views: number;
  reactions: number;
  members?: number;
  popular?: boolean;
}

export interface PaymentSubmission {
  id: string;
  planId: string;
  method: 'wave' | 'aya' | 'kpay';
  phoneNumber: string;
  transactionId: string;
  amountMMK: number;
  slipImage?: string;
  status: 'approved' | 'pending';
  timestamp: number;
}
