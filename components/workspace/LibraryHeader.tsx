'use client';

import { Plus, Search, ChevronDown } from 'lucide-react';

interface LibraryHeaderProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  sortBy: 'activity' | 'name';
  setSortBy: (val: 'activity' | 'name') => void;
  sortDropdownOpen: boolean;
  setSortDropdownOpen: (val: boolean) => void;
  onNewCase: () => void;
}

export function LibraryHeader({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortDropdownOpen,
  setSortDropdownOpen,
  onNewCase
}: LibraryHeaderProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-[28px] font-serif text-text-heading tracking-tight">Library</h1>
        <button
           onClick={onNewCase}
           className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> New case
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative flex items-center w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-light flex-shrink-0 pointer-events-none" />
        <input
          type="text"
          placeholder="Search cases..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-border-default rounded-xl text-text-heading focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all outline-none placeholder:text-text-light"
        />
      </div>

      {/* Sort By Dropdown */}
      <div className="flex justify-end relative">
        <div className="flex items-center gap-2">
          <span className="text-text-sub text-sm hidden sm:block">Sort by</span>
          <button
            onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-default bg-white text-sm text-text-sub hover:bg-background-light transition-colors"
          >
            {sortBy === 'activity' ? 'Activity' : 'Name'} <ChevronDown className="w-4 h-4" />
          </button>
        </div>
        {sortDropdownOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setSortDropdownOpen(false)} />
            <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-border-default rounded-xl shadow-lg py-1 z-20 overflow-hidden">
              <button
                onClick={() => { setSortBy('activity'); setSortDropdownOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${sortBy === 'activity' ? 'bg-primary/5 text-primary font-medium' : 'text-text-sub hover:bg-background-light'}`}
              >
                Activity
              </button>
              <button
                onClick={() => { setSortBy('name'); setSortDropdownOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${sortBy === 'name' ? 'bg-primary/5 text-primary font-medium' : 'text-text-sub hover:bg-background-light'}`}
              >
                Name
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
