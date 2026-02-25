import { Search, Bell } from 'lucide-react';

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="h-20 flex-shrink-0 flex items-center justify-between px-8 lg:px-12 z-10 bg-surface-light/80 backdrop-blur-sm border-b border-border-subtle">
      <div>
        <h1 className="text-xl font-medium text-text-heading tracking-tight">{title}</h1>
        {subtitle && <p className="text-text-sub text-sm mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-light group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search files & cases..."
            className="pl-10 pr-4 py-2 bg-background-light border-none rounded-lg text-sm w-64 focus:ring-1 focus:ring-primary focus:bg-surface-light placeholder-text-light transition-all outline-none"
          />
        </div>

        <div className="h-6 w-px bg-border-default mx-1" />

        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-background-light text-text-light hover:text-text-sub transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-secondary rounded-full" />
        </button>
      </div>
    </header>
  );
}
