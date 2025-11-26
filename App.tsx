import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Meme, PriceData } from './types';
import { MemeCard } from './components/MemeCard';
import { MemeGenerator } from './components/MemeGenerator';
import PriceTicker from './components/PriceTicker';
import { MemeDetailModal } from './components/MemeDetailModal';
import { MenuIcon, CheckIcon } from './components/Icons';
import { FeedFilters } from './components/FeedFilters';
import { Pagination } from './components/Pagination';

// Mock data to replace backend fetching for now
const mockMemes: Meme[] = [
  { id: '1', imageUrl: 'https://i.imgur.com/xIu2f0M.jpeg', caption: 'Investors waiting for the bull run like it\'s DoorDash delivery', score: 1337, minted: true, shareCount: 256, prompt: 'investors waiting for bull run' },
  { id: '2', imageUrl: 'https://i.imgur.com/sIqjGzN.jpeg', caption: 'When history books talk about meme coins, make sure your wallet whispers \'$NARY.\'', score: 987, minted: true, shareCount: 128, prompt: 'history of meme coins' },
  { id: '3', imageUrl: 'https://i.imgur.com/Ufhm420.jpeg', caption: 'SEIZE THE MEMES OF PRODUCTION', score: 850, minted: false, shareCount: 64, prompt: 'revolution meme' },
  { id: '4', imageUrl: 'https://i.imgur.com/j19E1zT.jpeg', caption: 'PUT DOWN THE PHONE IT CAN WAIT', score: 720, minted: false, shareCount: 32, prompt: 'a person relaxing in a field' },
];

const initialPrice: PriceData = { usd: 0.0042, usd_24h_change: 12.75 };

type View = 'create' | 'feed' | 'dfs' | 'tokens' | 'market' | 'proof' | 'docs';
type FilterStatus = 'all' | 'minted' | 'not_minted';
type SortBy = 'newest' | 'oldest' | 'score_desc' | 'score_asc';

const NavItem = ({ label, active, onClick, disabled = false }: { label: string, active: boolean, onClick: () => void, disabled?: boolean }) => (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`font-header text-sm sm:text-base font-semibold px-3 py-2 sm:px-4 sm:py-2 rounded-md transition-all duration-200 relative ${
        active 
          ? 'text-white' 
          : 'text-gray-400 hover:text-white'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {label}
      {active && <motion.span layoutId="active-nav-indicator" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-brand-red rounded-full" style={{boxShadow: '0 0 8px var(--brand-red)'}}></motion.span>}
      {disabled && <span className="absolute top-0 right-0 text-xs bg-orange-500 text-black font-bold px-1 rounded-full transform translate-x-1/2 -translate-y-1/2">soon</span>}
    </button>
);

const App: React.FC = () => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [price, setPrice] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);
  const [activeView, setActiveView] = useState<View>('create');
  const [notification, setNotification] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const memesPerPage = 9;

  // State for filtering and sorting
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortBy>('newest');

  useEffect(() => {
    // Simulate fetching data, now with localStorage persistence
    setLoading(true);
    setError(null);
    setTimeout(() => {
      try {
        const storedMemes = localStorage.getItem('odinary_memes');
        if (storedMemes) {
          const parsed = JSON.parse(storedMemes);
          if (Array.isArray(parsed)) {
            setMemes(parsed);
          } else {
             // Fallback if data is corrupted
             const sortedMock = mockMemes.sort((a,b) => parseInt(b.id) - parseInt(a.id));
             setMemes(sortedMock);
          }
        } else {
          // Fallback to mock data if nothing in storage
          const sortedMock = mockMemes.sort((a,b) => parseInt(b.id) - parseInt(a.id));
          setMemes(sortedMock);
        }
      } catch (e) {
        console.error("Failed to load memes from localStorage", e);
        const sortedMock = mockMemes.sort((a,b) => parseInt(b.id) - parseInt(a.id));
        setMemes(sortedMock);
      }
      setPrice(initialPrice);
      setLoading(false);
    }, 1000);
  }, []);

  // Save memes to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('odinary_memes', JSON.stringify(memes));
      } catch (e) {
        console.error("Failed to save memes to localStorage", e);
      }
    }
  }, [memes, loading]);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
        setNotification(null);
    }, 4000);
  };
  
  const handleNewMeme = (newMeme: Meme) => {
    // Add new meme to the start of the array, making it the "newest"
    setMemes(prevMemes => [newMeme, ...prevMemes]);
    setActiveView('feed'); // Switch to feed after creating a meme
    setCurrentPage(1); // Reset to first page to see the new meme
    showNotification('New meme created successfully!');
  };

  const handleOpenMeme = (meme: Meme) => setSelectedMeme(meme);
  const handleCloseMeme = () => setSelectedMeme(null);
  
  const handleDeleteMeme = (id: string) => {
    setMemes(prevMemes => prevMemes.filter(meme => meme.id !== id));
    showNotification(`Meme successfully deleted.`);
  };

  const handleMintMeme = async (id: string) => {
    // Simulate a delay for the minting process
    await new Promise(resolve => setTimeout(resolve, 2000));

    setMemes(prevMemes =>
        prevMemes.map(meme =>
            meme.id === id ? { ...meme, minted: true } : meme
        )
    );
    
    showNotification(`Meme #${id.slice(-4)} successfully minted!`);
  };

  const handleFilterChange = (status: FilterStatus) => {
    setFilterStatus(status);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleSortChange = (sort: SortBy) => {
    setSortBy(sort);
    setCurrentPage(1); // Reset to first page when sorting
  };

  const filteredAndSortedMemes = useMemo(() => {
    let result = [...memes];

    // 1. Filter
    if (filterStatus === 'minted') {
        result = result.filter(meme => meme.minted);
    } else if (filterStatus === 'not_minted') {
        result = result.filter(meme => !meme.minted);
    }

    // 2. Sort
    // We use a stable sort by creating a copy with sort
    const sortedResult = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          // Assuming higher ID is newer. Since new memes are prepended, index works too.
          return memes.indexOf(a) - memes.indexOf(b);
        case 'oldest':
          return memes.indexOf(b) - memes.indexOf(a);
        case 'score_desc':
          return b.score - a.score;
        case 'score_asc':
          return a.score - b.score;
        default:
          return 0;
      }
    });

    return sortedResult;
  }, [memes, filterStatus, sortBy]);

  // Handle page reset if items are deleted and the current page becomes empty
  useEffect(() => {
    const totalPages = Math.ceil(filteredAndSortedMemes.length / memesPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredAndSortedMemes.length, currentPage]);


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const renderView = () => {
    switch(activeView) {
      case 'create':
        return <MemeGenerator onMemeGenerated={handleNewMeme} />;
      case 'feed':
        // Pagination logic
        const indexOfLastMeme = currentPage * memesPerPage;
        const indexOfFirstMeme = indexOfLastMeme - memesPerPage;
        const currentMemes = filteredAndSortedMemes.slice(indexOfFirstMeme, indexOfLastMeme);

        return (
          <>
            <h2 className="font-header text-3xl font-bold text-neutral-200 mt-12 mb-6">Meme Feed</h2>
            <FeedFilters
              filterStatus={filterStatus}
              onFilterChange={handleFilterChange}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              memeCount={filteredAndSortedMemes.length}
            />
            {error && <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="glass-effect overflow-hidden animate-pulse">
                            <div className="w-full aspect-square bg-slate-700/50"></div>
                            <div className="p-4"><div className="h-20 bg-slate-700/50 rounded-lg"></div></div>
                        </div>
                    ))}
                </div>
            ) : (
              filteredAndSortedMemes.length > 0 ? (
                <>
                  <motion.div 
                    key={`${filterStatus}-${sortBy}-${currentPage}`}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {currentMemes.map((meme) => (
                        <MemeCard 
                          key={meme.id} 
                          meme={meme} 
                          onCardClick={handleOpenMeme} 
                          onDelete={handleDeleteMeme}
                          onMint={handleMintMeme}
                        />
                    ))}
                  </motion.div>
                  <Pagination 
                    memesPerPage={memesPerPage} 
                    totalMemes={filteredAndSortedMemes.length} 
                    paginate={setCurrentPage} 
                    currentPage={currentPage}
                  />
                </>
              ) : (
                <div className="text-center glass-effect p-12 mt-12">
                  <h3 className="font-header text-3xl text-brand-orange">No Memes Found</h3>
                  <p className="text-text-secondary mt-2">Looks like your filters are too strong. Try a different combination!</p>
                </div>
              )
            )}
          </>
        );
      case 'dfs':
      case 'tokens':
      case 'market':
      case 'proof':
      case 'docs':
        return (
          <div className="text-center glass-effect p-12 mt-12">
            <h2 className="font-header text-4xl text-brand-orange">{activeView.toUpperCase()}</h2>
            <p className="text-text-secondary mt-2">This module is under construction. Stay tuned!</p>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-transparent text-white font-sans p-4 sm:p-6 lg:p-8">
      {notification && (
          <div className="fixed top-24 right-4 sm:right-8 z-50 glass-effect p-4 rounded-lg shadow-lg border border-green-500/50 animate-fade-in-out">
              <div className="flex items-center gap-3">
                  <CheckIcon className="w-6 h-6 text-green-400" />
                  <p className="text-green-300 font-semibold text-sm">{notification}</p>
              </div>
          </div>
      )}
      <div className="container mx-auto">
        <header className="glass-effect z-10 sticky top-4 flex flex-col sm:flex-row justify-between items-center mb-8 p-3 sm:p-4 gap-4">
          <div className="flex items-center gap-4">
              <img src="https://i.imgur.com/2OFa2a1.png" alt="ODINARY Logo" className="w-10 h-10" />
              <h1 className="font-header text-4xl sm:text-5xl font-extrabold tracking-tighter text-white" style={{ textShadow: '0 0 10px var(--brand-red-glow), 0 0 20px var(--brand-red-glow)' }}>
                ODINARY
              </h1>
          </div>

          <nav className="flex-grow flex justify-center items-center">
             <div className="hidden sm:flex items-center space-x-2 glass-effect px-3 py-1 rounded-full">
                <NavItem label="Create" active={activeView === 'create'} onClick={() => setActiveView('create')} />
                <NavItem label="Feed" active={activeView === 'feed'} onClick={() => setActiveView('feed')} />
                <NavItem label="DFS" active={activeView === 'dfs'} onClick={() => setActiveView('dfs')} disabled={true} />
                <NavItem label="Tokens" active={activeView === 'tokens'} onClick={() => setActiveView('tokens')} disabled={true} />
                <NavItem label="Market" active={activeView === 'market'} onClick={() => setActiveView('market')} disabled={true} />
                <NavItem label="Proof" active={activeView === 'proof'} onClick={() => setActiveView('proof')} disabled={true} />
                <NavItem label="Docs" active={activeView === 'docs'} onClick={() => setActiveView('docs')} disabled={true} />
             </div>
          </nav>
          
          <div className="flex items-center">
            <PriceTicker price={price} loading={price === null} />
            <button className="ml-4 sm:hidden text-gray-400 hover:text-white">
                <MenuIcon className="w-6 h-6" />
            </button>
          </div>

        </header>

        <main>
          {renderView()}
        </main>
        
        <footer className="text-center text-gray-500 mt-12 py-4 border-t border-[var(--glass-border)]">
            <p>&copy; {new Date().getFullYear()} Odinary. All Systems Nominal.</p>
        </footer>
      </div>
      <AnimatePresence>
        {selectedMeme && <MemeDetailModal meme={selectedMeme} onClose={handleCloseMeme} />}
      </AnimatePresence>
    </div>
  );
};

export default App;