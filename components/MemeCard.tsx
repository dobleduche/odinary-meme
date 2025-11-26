import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Meme } from '../types';
import { UpvoteIcon, XIcon, NftIcon, ShareIcon, TrashIcon, TelegramIcon, MagicWandIcon, LoaderIcon } from './Icons';

interface MemeCardProps {
  meme: Meme;
  onCardClick: (meme: Meme) => void;
  onDelete: (id: string) => void;
  onMint: (id: string) => Promise<void>;
}

const cardVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
};


export const MemeCard: React.FC<MemeCardProps> = ({ meme, onCardClick, onDelete, onMint }) => {
  const [currentScore, setCurrentScore] = useState(meme.score);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [shareCount, setShareCount] = useState(meme.shareCount || 0);

  useEffect(() => {
    setCurrentScore(meme.score);
  }, [meme.score]);

  const handleShare = () => {
    setShareCount(prev => prev + 1);
    // In a real app, this would be persisted
  };

  const shareToX = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleShare();
    const text = encodeURIComponent(`Check out this ODINARY meme!\n"${meme.caption}"\n\n#Odinary #NARY $NARY`);
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareToTelegram = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleShare();
    const url = encodeURIComponent(meme.imageUrl); // Sharing the image URL directly
    const text = encodeURIComponent(`Check out this ODINARY meme!\n"${meme.caption}"\n\n#Odinary #NARY $NARY`);
    const shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUpvoted) return;
    const newScore = currentScore + 1;
    setCurrentScore(newScore);
    setIsUpvoted(true);
    // In a real app, you would persist this change.
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this meme? This action cannot be undone.')) {
        onDelete(meme.id);
    }
  };

  const handleMint = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinting(true);
    try {
      await onMint(meme.id);
      // The parent component will handle the state update which will cause this component to re-render
    } catch (error) {
      console.error("Minting failed", error);
      // Optionally show an error to the user
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <motion.div 
      variants={cardVariants}
      whileHover={{ scale: 1.05, y: -5, boxShadow: "0px 10px 30px rgba(229, 62, 62, 0.4)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      layoutId={`meme-card-${meme.id}`}
      className="glass-effect overflow-hidden shadow-lg flex flex-col cursor-pointer group"
      onClick={() => onCardClick(meme)}
    >
      <motion.div layoutId={`meme-image-${meme.id}`} className="relative aspect-square w-full overflow-hidden bg-slate-800">
        {imageLoading && !imageError && (
          <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
             <LoaderIcon className="w-8 h-8 text-slate-600 animate-spin" />
          </div>
        )}
        
        {!imageError ? (
            <img 
                src={meme.imageUrl} 
                alt={meme.caption} 
                className={`w-full h-full object-cover transition-opacity duration-500 group-hover:scale-105 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                    setImageLoading(false);
                    setImageError(true);
                }}
            />
        ) : (
            <div className="flex flex-col items-center justify-center w-full h-full bg-slate-800 p-4 text-center border-b border-white/5">
                 <span className="text-4xl mb-2 grayscale opacity-50">🖼️</span>
                 <p className="text-sm text-gray-400 font-medium">Image unavailable</p>
                 <p className="text-xs text-gray-600 mt-1">Failed to load resource</p>
            </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {meme.minted && (
          <div className="absolute top-3 right-3 flex items-center bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-fade-in" style={{textShadow: '0 0 5px rgba(0,0,0,0.5)'}}>
            <NftIcon className="w-4 h-4 mr-1.5" />
            MINTED
          </div>
        )}
      </motion.div>
      <div className="p-4 flex flex-col flex-grow bg-black/20" style={{ backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMwMDAwMDAiLz48ZyBmaWxsLW9wYWNpdHk9IjAuMSI+PHJlY3QgeD0iMTAiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiLz48cmVjdCB5PSIxMCIgd2lkdGg9IjEiIGhlaWdodD0iMSIvPjwvZz48L3N2Zz4=')`}}>
        <p className="text-neutral-200 mb-4 flex-grow flex items-center justify-center text-center font-semibold min-h-[3rem]">{meme.caption}</p>
        
        <div className="flex items-center gap-2">
            <button
              onClick={handleUpvote}
              disabled={isUpvoted}
              className={`flex-grow flex items-center justify-center p-3 rounded-lg transition-colors duration-200 border ${
                isUpvoted
                  ? 'bg-red-500/30 border-red-500 text-white cursor-not-allowed'
                  : 'bg-slate-700/50 border-slate-600 hover:bg-red-500/20 hover:border-red-500'
              }`}
              aria-label="Upvote this meme"
            >
              <div className="flex items-center space-x-2">
                <UpvoteIcon className="w-5 h-5" />
                <span className="text-lg font-bold">{currentScore.toLocaleString()}</span>
              </div>
            </button>
            <button 
              onClick={shareToX}
              className="flex-shrink-0 bg-slate-700/50 hover:bg-orange-500/20 text-white font-semibold p-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border border-slate-600 hover:border-orange-500"
              aria-label="Share this meme on X"
            >
              <XIcon className="w-5 h-5" /> 
            </button>
            <button 
              onClick={shareToTelegram}
              className="flex-shrink-0 bg-slate-700/50 hover:bg-sky-500/20 text-white font-semibold p-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border border-slate-600 hover:border-sky-500"
              aria-label="Share this meme to Telegram"
            >
              <TelegramIcon className="w-5 h-5" /> 
            </button>
            <div className="flex-shrink-0 flex items-center gap-1.5 text-sm text-gray-400 pl-1" title={`${shareCount.toLocaleString()} shares`}>
                <ShareIcon className="w-4 h-4"/>
                <span className="font-semibold">{shareCount.toLocaleString()}</span>
            </div>
             {!meme.minted && (
                <button
                    onClick={handleMint}
                    disabled={isMinting}
                    className="flex-shrink-0 bg-green-500/20 hover:bg-green-500/30 text-white p-3 rounded-lg transition-all duration-200 flex items-center justify-center border border-green-700 hover:border-green-500 disabled:opacity-60 disabled:cursor-wait"
                    aria-label="Mint meme"
                >
                    {isMinting ? (
                        <LoaderIcon className="w-5 h-5 animate-spin" />
                    ) : (
                        <MagicWandIcon className="w-5 h-5" />
                    )}
                </button>
            )}
            <button
                onClick={handleDelete}
                className="flex-shrink-0 bg-slate-700/50 hover:bg-red-900/50 text-gray-400 hover:text-white p-3 rounded-lg transition-colors duration-200 border border-slate-600 hover:border-red-700"
                aria-label="Delete meme"
            >
                <TrashIcon className="w-5 h-5" />
            </button>
        </div>
      </div>
    </motion.div>
  );
};