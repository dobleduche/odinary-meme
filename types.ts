// FILE: src/types.ts

export interface Meme {
  /** Unique identifier for the meme (could be UUID, db id, etc.) */
  id: string;

  /** Public URL of the rendered meme image */
  imageUrl: string;

  /** Main caption / punchline text */
  caption: string;

  /** Viral / quality score (0–100 or similar) */
  score: number;

  /** Whether this meme has been minted as an NFT / on-chain asset */
  minted: boolean;

  /** Optional: aggregate share count across platforms */
  shareCount?: number;

  /** Optional: original text prompt used to generate the meme */
  prompt?: string;

  /** Optional: watermark text or URL applied to the image */
  watermark?: string;

  /** Optional: IPFS content ID if pinned/distributed there */
  ipfsCid?: string;
}

export interface User {
  /** Telegram numeric user id */
  telegramId: number;

  /** Telegram username (without @) */
  username: string;

  /** XP / points in the Odinary system */
  xp: number;
}

export interface PriceData {
  /** Current price in USD */
  usd: number;

  /** 24h price change in % (e.g., -3.2, 5.7) */
  usd_24h_change: number;
}

export interface Comment {
  /** Unique identifier for the comment */
  id: string;

  /** The meme this comment belongs to */
  memeId: string;

  /** Author display name or handle */
  author: string;

  /** Comment body text */
  text: string;

  /** Unix timestamp (ms) */
  timestamp: number;
}
