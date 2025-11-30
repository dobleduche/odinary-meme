export interface Meme {
  id: string;
  imageUrl: string;
  caption: string;
  score: number;
  minted: boolean;
  shareCount?: number;
  prompt?: string;
  watermark?: string;
  ipfsCid?: string;
}

export interface User {
  telegramId: number;
  username: string;
  xp: number;
}

export interface PriceData {
  usd: number;
  usd_24h_change: number;
}

export interface Comment {
  id: string;
  memeId: string;
  author: string;
  text: string;
  timestamp: number;
}