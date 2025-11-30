import { Meme } from '../types';

const STORAGE_KEY = 'odinary_memes';

export const seedMemes: Meme[] = [
  {
    id: '1',
    imageUrl: 'https://i.imgur.com/xIu2f0M.jpeg',
    caption: "Investors waiting for the bull run like it's DoorDash delivery",
    score: 1337,
    minted: true,
    shareCount: 256,
    prompt: 'investors waiting for bull run',
  },
  {
    id: '2',
    imageUrl: 'https://i.imgur.com/sIqjGzN.jpeg',
    caption: "When history books talk about meme coins, make sure your wallet whispers '$NARY.'",
    score: 987,
    minted: true,
    shareCount: 128,
    prompt: 'history of meme coins',
  },
  {
    id: '3',
    imageUrl: 'https://i.imgur.com/Ufhm420.jpeg',
    caption: 'SEIZE THE MEMES OF PRODUCTION',
    score: 850,
    minted: false,
    shareCount: 64,
    prompt: 'revolution meme',
  },
  {
    id: '4',
    imageUrl: 'https://i.imgur.com/j19E1zT.jpeg',
    caption: 'PUT DOWN THE PHONE IT CAN WAIT',
    score: 720,
    minted: false,
    shareCount: 32,
    prompt: 'a person relaxing in a field',
  },
];

export function loadMemes(): Meme[] {
  try {
    const storedMemes = localStorage.getItem(STORAGE_KEY);
    if (storedMemes) {
      const parsed = JSON.parse(storedMemes);
      if (Array.isArray(parsed)) {
        return parsed as Meme[];
      }
    }
  } catch (error) {
    console.error('Failed to load memes from localStorage', error);
  }

  return [...seedMemes];
}

export function persistMemes(memes: Meme[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memes));
  } catch (error) {
    console.error('Failed to persist memes to localStorage', error);
  }
}

export function resetMemes(): Meme[] {
  persistMemes(seedMemes);
  return [...seedMemes];
}
