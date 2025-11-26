import React from 'react';
import { PriceData } from '../types';

interface PriceTickerProps {
  price: PriceData | null;
  loading: boolean;
}

const PriceTicker: React.FC<PriceTickerProps> = ({ price, loading }) => {
  if (loading) {
    return (
      <div className="glass-effect p-3 rounded-lg animate-pulse w-48">
        <div className="h-6 bg-slate-700/50 rounded w-2/3 mb-1"></div>
        <div className="h-4 bg-slate-700/50 rounded w-1/2"></div>
      </div>
    );
  }

  if (!price) return null;

  const isPositive = price.usd_24h_change >= 0;
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
  const changeSymbol = isPositive ? '▲' : '▼';

  return (
    <div className="glass-effect flex items-center space-x-4 p-3 rounded-lg">
        <div className="text-2xl font-bold font-header" style={{ textShadow: '0 0 8px var(--brand-red-glow)' }}>
            <span className="text-red-500">$</span>
            <span className="text-neutral-200">NARY</span>
        </div>
        <div>
            <p className="font-bold text-lg leading-tight text-neutral-100">
                ${price.usd.toPrecision(3)}
            </p>
            <p className={`text-sm font-semibold leading-tight ${changeColor}`}>
                {changeSymbol} {price.usd_24h_change.toFixed(2)}% (24h)
            </p>
        </div>
    </div>
  );
};

export default PriceTicker;
