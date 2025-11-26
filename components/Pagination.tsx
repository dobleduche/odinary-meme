import React from 'react';

interface PaginationProps {
  memesPerPage: number;
  totalMemes: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}

export const Pagination: React.FC<PaginationProps> = ({ memesPerPage, totalMemes, paginate, currentPage }) => {
  const totalPages = Math.ceil(totalMemes / memesPerPage);

  if (totalPages <= 1) return null;

  // Helper to generate page numbers with ellipsis if needed
  const getPageNumbers = () => {
    const delta = 1; // Number of pages to show around current page
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  };

  return (
    <nav className="flex justify-center items-center space-x-2 mt-8 animate-fade-in" aria-label="Pagination">
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-md bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Prev
      </button>
      
      <div className="flex items-center space-x-1">
        {getPageNumbers().map((number, index) => (
          <button
            key={index}
            onClick={() => typeof number === 'number' ? paginate(number) : null}
            disabled={number === '...'}
            className={`w-10 h-10 flex items-center justify-center rounded-md border transition-colors ${
              number === currentPage
                ? 'bg-brand-red border-brand-red text-white font-bold'
                : number === '...'
                ? 'bg-transparent border-transparent text-gray-500 cursor-default'
                : 'bg-slate-800 border-slate-700 text-gray-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {number}
          </button>
        ))}
      </div>

      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-md bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </nav>
  );
};
