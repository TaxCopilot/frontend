import { Search } from 'lucide-react';

export function Header({ 
  title, 
  subtitle,
  onSearch,
  searchValue,
  searchPlaceholder = "Search..."
}: { 
  title: string; 
  subtitle?: string;
  onSearch?: (val: string) => void;
  searchValue?: string;
  searchPlaceholder?: string;
}) {
  return (
    <header className="h-20 flex-shrink-0 flex items-center justify-between px-8 lg:px-12 z-10 bg-surface-light/80 backdrop-blur-sm border-b border-border-subtle">
      <div>
        <h1 className="text-xl font-medium text-text-heading tracking-tight">{title}</h1>
        {subtitle && <p className="text-text-sub text-sm mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        {/* Search */}
        {onSearch !== undefined && (
          <div className="relative flex items-center min-w-0 md:w-[320px] transition-all group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-sub flex-shrink-0 pointer-events-none z-10" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue || ''}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full min-w-0 pl-10 pr-[72px] py-2.5 bg-white border border-border-default rounded-[24px] text-sm text-text-heading placeholder:text-text-sub focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none leading-none shadow-sm"
              style={{ boxSizing: 'border-box' }}
            />
            {/* Shortcut Badge */}
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center bg-[#3f3f46] text-white/90 text-xs px-2.5 py-1.5 rounded-[16px] pointer-events-none font-medium opacity-100 transition-opacity">
              + Space
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
