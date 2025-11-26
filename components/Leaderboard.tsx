import React from 'react';
import { User } from '../types';
import { XpIcon } from './Icons';

interface LeaderboardProps {
  users: User[];
  loading: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ users, loading }) => {
  const getTrophy = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return <span className="text-gray-500 font-bold">{index + 1}</span>;
  };
  
  if (loading) {
     return (
        <div className="w-full max-w-sm glass-effect p-6">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4 text-center tracking-wider uppercase">Leaderboard</h2>
            <div className="space-y-3 animate-pulse">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-slate-800/50 p-3 rounded-lg flex items-center">
                    <div className="h-8 w-8 bg-slate-700/50 rounded-full mr-3"></div>
                    <div className="flex-grow">
                        <div className="h-4 bg-slate-700/50 rounded w-3/4"></div>
                    </div>
                    <div className="h-4 bg-slate-700/50 rounded w-1/4"></div>
                </div>
            ))}
            </div>
        </div>
     );
  }

  return (
    <div className="w-full max-w-sm glass-effect p-6">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4 text-center tracking-wider uppercase" style={{ textShadow: '0 0 8px var(--cyan-glow)' }}>Leaderboard</h2>
      <div className="space-y-2">
        {users.map((user, index) => (
          <div key={user.telegramId} className="flex items-center bg-slate-900/50 hover:bg-slate-800/70 p-3 rounded-lg transition-all duration-200 border border-transparent hover:border-cyan-400/50">
            <div className="w-8 text-xl text-center font-bold mr-3">{getTrophy(index)}</div>
            <p className="flex-grow font-semibold text-neutral-200 truncate">{user.username}</p>
            <div className="flex items-center space-x-1.5 text-cyan-400 font-bold">
              <XpIcon className="w-4 h-4"/>
              <span>{user.xp.toLocaleString()} XP</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;