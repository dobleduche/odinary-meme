import React from 'react';

type FilterStatus = 'all' | 'minted' | 'not_minted';
type SortBy = 'newest' | 'oldest' | 'score_desc' | 'score_asc';

interface FeedFiltersProps {
  filterStatus: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
  memeCount: number;
}

const FilterButton = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 focus:ring-offset-slate-800 ${
            active ? 'bg-brand-red text-white shadow' : 'bg-slate-700/50 hover:bg-slate-700 text-gray-300'
        }`}
    >
        {label}
    </button>
);

export const FeedFilters: React.FC<FeedFiltersProps> = ({
  filterStatus,
  onFilterChange,
  sortBy,
  onSortChange,
  memeCount
}) => {
  return (
    <div className="glass-effect p-4 rounded-lg mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg">
            <FilterButton label="All" active={filterStatus === 'all'} onClick={() => onFilterChange('all')} />
            <FilterButton label="Minted" active={filterStatus === 'minted'} onClick={() => onFilterChange('minted')} />
            <FilterButton label="Not Minted" active={filterStatus === 'not_minted'} onClick={() => onFilterChange('not_minted')} />
        </div>
        <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 font-medium">
                {memeCount} {memeCount === 1 ? 'meme' : 'memes'}
            </span>
            <div className="flex items-center gap-2">
                <label htmlFor="sort-by" className="text-sm font-medium text-gray-400">Sort by:</label>
                <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value as SortBy)}
                    className="bg-slate-900/70 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-red transition-shadow"
                >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="score_desc">Highest Score</option>
                    <option value="score_asc">Lowest Score</option>
                </select>
            </div>
        </div>
    </div>
  );
};
