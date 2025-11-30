import { PriceData } from '../types';

const COINGECKO_ENDPOINT =
  'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true';

export const FALLBACK_PRICE: PriceData = { usd: 0.0042, usd_24h_change: 0 };

export async function fetchTokenPrice(signal?: AbortSignal): Promise<PriceData> {
  const response = await fetch(COINGECKO_ENDPOINT, { signal });

  if (!response.ok) {
    throw new Error(`Failed to load price data (${response.status})`);
  }

  const payload = await response.json();
  const ethereumPrice = payload?.ethereum;

  if (
    !ethereumPrice ||
    typeof ethereumPrice.usd !== 'number' ||
    typeof ethereumPrice.usd_24h_change !== 'number'
  ) {
    throw new Error('Unexpected price payload returned from CoinGecko');
  }

  return {
    usd: ethereumPrice.usd,
    usd_24h_change: ethereumPrice.usd_24h_change,
  };
}
