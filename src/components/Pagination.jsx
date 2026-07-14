import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-12 mb-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
          currentPage === 1
            ? 'text-slate-300 cursor-not-allowed bg-slate-50'
            : 'text-slate-600 hover:bg-slate-100 hover:text-brand-600'
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-lg font-medium transition-all ${
              currentPage === page
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30'
                : 'text-slate-600 hover:bg-slate-100 hover:text-brand-600'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
          currentPage === totalPages
            ? 'text-slate-300 cursor-not-allowed bg-slate-50'
            : 'text-slate-600 hover:bg-slate-100 hover:text-brand-600'
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

export default Pagination;
