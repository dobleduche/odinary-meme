import React, { useEffect, useState } from 'react';
// FIX: Import Variants type from framer-motion to correctly type animation variants.
import { motion, Variants } from 'framer-motion';
import { Meme, Comment } from '../types';
import { CloseIcon, NftIcon, UpvoteIcon, XIcon, TelegramIcon, SendIcon, ShareIcon, LoaderIcon } from './Icons';

interface MemeDetailModalProps {
  meme: Meme | null;
  onClose: () => void;
}

const DetailStat = ({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) => (
    <div className="flex items-center space-x-3 bg-slate-900/50 p-3 rounded-lg">
        <div className="text-brand-red">{icon}</div>
        <div>
            <div className="text-xl font-bold text-white">{value}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">{label}</div>
        </div>
    </div>
);

// FIX: Explicitly type backdropVariants with Variants for type safety.
const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// FIX: Explicitly type modalVariants with Variants to fix type inference issue.
const modalVariants: Variants = {
  hidden: { y: "50px", scale: 0.9, opacity: 0 },
  visible: { 
    y: 0, 
    scale: 1, 
    opacity: 1,
    transition: { type: "spring", stiffness: 200, damping: 25 }
  },
  exit: { 
    y: "-50px", 
    scale: 0.9, 
    opacity: 0,
    transition: { duration: 0.2 }
  },
};

export const MemeDetailModal: React.FC<MemeDetailModalProps> = ({ meme, onClose }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isPostingComment, setIsPostingComment] = useState(false);

  // Effect for handling comments from localStorage
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (meme) {
        setIsLoadingComments(true);
        // Simulate network fetch
        timer = setTimeout(() => {
            try {
                const storedComments = localStorage.getItem(`comments_${meme.id}`);
                if (storedComments) {
                    setComments(JSON.parse(storedComments));
                } else {
                    setComments([]);
                }
            } catch (error) {
                console.error("Failed to parse comments from localStorage", error);
                setComments([]);
            } finally {
                setIsLoadingComments(false);
            }
        }, 800);
    } else {
        setComments([]);
    }
     setNewComment('');

     return () => clearTimeout(timer);
  }, [meme]);

  // Effect for Escape key listener
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!meme) return null;

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !meme) return;

    setIsPostingComment(true);

    // Simulate network delay for posting
    await new Promise(resolve => setTimeout(resolve, 1000));

    const commentToAdd: Comment = {
        id: `comment-${Date.now()}`,
        memeId: meme.id,
        author: 'AnonymousUser', // Placeholder author
        text: newComment.trim(),
        timestamp: Date.now(),
    };

    const updatedComments = [...comments, commentToAdd];
    setComments(updatedComments);
    try {
        localStorage.setItem(`comments_${meme.id}`, JSON.stringify(updatedComments));
    } catch (error) {
        console.error("Failed to save comments to localStorage", error);
    }
    setNewComment('');
    setIsPostingComment(false);
  };

  const shareToX = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = encodeURIComponent(`Check out this ODINARY meme!\n"${meme.caption}"\n\n#Odinary #NARY $NARY`);
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareToTelegram = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = encodeURIComponent(meme.imageUrl);
    const text = encodeURIComponent(`Check out this ODINARY meme!\n"${meme.caption}"\n\n#Odinary #NARY $NARY`);
    const shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div 
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={onClose}
    >
      <motion.div 
        variants={modalVariants}
        layoutId={`meme-card-${meme.id}`}
        className="glass-effect relative w-full max-w-4xl max-h-[90vh] grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 rounded-2xl shadow-2xl shadow-brand-red/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10" aria-label="Close modal">
          <CloseIcon className="w-8 h-8" />
        </button>
        
        {/* Image Column */}
        <motion.div layoutId={`meme-image-${meme.id}`} className="flex items-center justify-center bg-black/30 rounded-lg overflow-hidden">
            <img src={meme.imageUrl} alt={meme.caption} className="max-h-[80vh] w-auto h-auto object-contain" />
        </motion.div>

        {/* Details Column */}
        <div className="flex flex-col h-full">
            {/* Scrollable Content Area */}
            <div className="flex-grow space-y-4 overflow-y-auto pr-2 pb-4">
                <h2 className="text-3xl font-bold text-white tracking-tight">{meme.caption}</h2>
                
                {meme.prompt && (
                    <div>
                        <h3 className="text-sm font-semibold text-brand-orange uppercase tracking-wider mb-1">Original Prompt</h3>
                        <p className="text-neutral-300 bg-slate-800/50 p-3 rounded-md text-sm italic">"{meme.prompt}"</p>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-2">
                    <DetailStat icon={<UpvoteIcon className="w-7 h-7" />} value={meme.score.toLocaleString()} label="Score" />
                    <DetailStat icon={<ShareIcon className="w-6 h-6" />} value={(meme.shareCount || 0).toLocaleString()} label="Shares" />
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2">Status</h3>
                    <div className={`inline-flex items-center gap-2 text-white font-bold px-4 py-2 rounded-full text-sm ${
                        meme.minted 
                        ? 'bg-gradient-to-r from-brand-red to-orange-600' 
                        : 'bg-slate-700'
                    }`}>
                        <NftIcon className="w-5 h-5"/>
                        <span>{meme.minted ? 'MINTED' : 'NOT MINTED'}</span>
                    </div>
                </div>

                {/* Comment Section */}
                <div className="pt-4 border-t border-slate-700/50">
                    <h3 className="text-sm font-semibold text-brand-orange uppercase tracking-wider mb-2">Comments ({comments.length})</h3>
                    <div className="max-h-48 overflow-y-auto space-y-3 pr-2 min-h-[100px]">
                        {isLoadingComments ? (
                            <div className="h-full flex flex-col items-center justify-center py-6 text-brand-cyan">
                                <LoaderIcon className="w-6 h-6 animate-spin mb-2" />
                                <span className="text-xs text-gray-500">Loading comments...</span>
                            </div>
                        ) : comments.length > 0 ? (
                            comments.map(comment => (
                               <div key={comment.id} className="bg-slate-800/50 p-3 rounded-lg text-sm animate-fade-in">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <p className="font-bold text-neutral-200">{comment.author}</p>
                                        <p className="text-xs text-gray-500">{new Date(comment.timestamp).toLocaleDateString()}</p>
                                    </div>
                                    <p className="text-neutral-300 break-words">{comment.text}</p>
                               </div>
                            ))
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-sm text-gray-500">No comments yet.</p>
                                <p className="text-xs text-gray-600">Be the first to share your thoughts!</p>
                            </div>
                        )}
                    </div>
                    <form onSubmit={handlePostComment} className="mt-4 flex items-center gap-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder={isPostingComment ? "Posting..." : "Add a comment..."}
                            disabled={isPostingComment || isLoadingComments}
                            className="flex-grow bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-red transition-shadow text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="New comment input"
                        />
                        <button
                            type="submit"
                            disabled={!newComment.trim() || isPostingComment || isLoadingComments}
                            className="flex-shrink-0 bg-brand-red hover:bg-red-700 text-white font-bold p-2 rounded-full flex items-center justify-center transition-all duration-200 disabled:bg-slate-700 disabled:cursor-not-allowed disabled:text-gray-500"
                            aria-label="Post comment"
                        >
                            {isPostingComment ? (
                                <LoaderIcon className="w-5 h-5 animate-spin" />
                            ) : (
                                <SendIcon className="w-5 h-5" />
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Fixed Bottom Action Area */}
            <div className="flex-shrink-0 pt-4 border-t border-slate-700/50 space-y-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={shareToX}
                        className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-black text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                        aria-label="Share this meme on X"
                    >
                        <XIcon className="w-5 h-5" />
                        <span>Share on X</span>
                    </button>
                    <button
                        onClick={shareToTelegram}
                        className="flex-1 flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                        aria-label="Share this meme to Telegram"
                    >
                        <TelegramIcon className="w-5 h-5" />
                        <span>Share on Telegram</span>
                    </button>
                </div>
                <div>
                    <p className="text-xs text-gray-500">
                        Meme ID: {meme.id}
                    </p>
                    {meme.watermark && (
                        <p className="text-xs text-gray-500 font-mono">
                            Watermark Hash: {meme.watermark.split('•')[1]?.trim()}
                        </p>
                    )}
                    {meme.ipfsCid && (
                        <p className="text-xs text-gray-500 font-mono truncate">
                            IPFS: <a href={`https://ipfs.io/ipfs/${meme.ipfsCid}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-cyan-500 hover:text-cyan-400">{meme.ipfsCid}</a>
                        </p>
                    )}
                </div>
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
