import { Header } from '@/components/Header';
import { Search, BookOpen, Scale, Filter, Copy, ArrowRight } from 'lucide-react';

export default function LibraryPage() {
  const categories = [
    { name: 'All Categories', active: true },
    { name: 'GST Law', active: false },
    { name: 'Income Tax', active: false },
    { name: 'Corporate Law', active: false },
    { name: 'Case Precedents', active: false },
    { name: 'Notifications', active: false },
  ];

  const results = [
    {
      category: 'GST Law',
      categoryColor: 'bg-primary/10 text-primary',
      section: 'Section 29(2)(c)',
      title: 'Cancellation or Suspension of Registration',
      description: 'The proper officer may cancel the registration of a person from such date as he may deem fit, where a registered person has not furnished returns for a continuous period of six months.',
      tags: ['CGST Act 2017', 'Registration', 'Non-Compliance'],
      accent: 'border-l-primary',
    },
    {
      category: 'Case Law',
      categoryColor: 'bg-blue-soft text-blue-text',
      section: 'Madras HC • 2022',
      title: 'TVL. Suguna Cutpiece Center vs. The Appellate Deputy Commissioner',
      description: 'The High Court held that cancellation of GST registration for non-filing of returns is a drastic measure. Authorities must consider reasons and provide opportunity before cancellation.',
      tags: ['Section 29', 'Natural Justice', 'Cancellation'],
      accent: 'border-l-blue-text',
    },
    {
      category: 'Income Tax',
      categoryColor: 'bg-purple-soft text-purple-text',
      section: 'Section 148A',
      title: 'Conducting Inquiry Before Issue of Notice Under Section 148',
      description: 'The Assessing Officer shall conduct an inquiry with the prior approval of the specified authority, before issuing a notice under section 148.',
      tags: ['IT Act', 'Reassessment', 'Notice'],
      accent: 'border-l-purple-text',
    },
    {
      category: 'Case Law',
      categoryColor: 'bg-blue-soft text-blue-text',
      section: 'Delhi HC • 2023',
      title: 'Rishi Enterprises vs. Commissioner of Central Tax',
      description: 'A vague SCN lacking specific details deprives the taxpayer of a reasonable opportunity to respond, violating principles of natural justice. The cancellation order was set aside.',
      tags: ['Section 29', 'Defective SCN', 'Natural Justice'],
      accent: 'border-l-blue-text',
    },
    {
      category: 'Notification',
      categoryColor: 'bg-orange-soft text-orange-text',
      section: 'Circular No. 183/15/2022',
      title: 'GST Clarification on Provisions Relating to E-Commerce',
      description: 'Clarifications on registration and compliance requirements for persons supplying goods through an electronic commerce operator under Section 9(5) of the CGST Act.',
      tags: ['E-Commerce', 'GST', 'Circular'],
      accent: 'border-l-orange-text',
    },
  ];

  return (
    <>
      <Header title="Law Library" subtitle="Search across judgments, acts, and circulars" />
      <div className="flex-1 overflow-y-auto px-8 lg:px-12 py-8 bg-background-light scrollbar-thin">
        <div className="max-w-5xl mx-auto">

          {/* Search Bar */}
          <div className="bg-surface-light rounded-2xl p-3 shadow-card border border-border-subtle mb-6 flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
              <input
                type="text"
                placeholder="Search for case laws, sections, or keywords..."
                className="w-full bg-background-light border-none rounded-xl py-3 pl-12 pr-4 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder-text-light"
              />
            </div>
            <div className="hidden sm:flex items-center gap-1 bg-background-light border border-border-subtle rounded-lg px-2 py-1.5 text-[11px] text-text-light font-mono">
              ⌘K
            </div>
            <button className="bg-primary hover:bg-primary-dark text-surface-light px-5 py-3 rounded-xl font-medium shadow-sm transition-colors text-sm">
              Search
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.name}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  cat.active
                    ? 'bg-primary text-surface-light shadow-sm'
                    : 'bg-surface-light text-text-sub border border-border-default hover:border-primary/50 hover:text-primary'
                }`}
              >
                {cat.name}
              </button>
            ))}
            <div className="w-px h-7 bg-border-default mx-1 flex-shrink-0" />
            <button className="flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium text-text-sub bg-surface-light border border-border-default hover:border-primary/50 hover:text-primary transition-all">
              <Filter className="w-4 h-4" /> All Filters
            </button>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-5">
            <span className="text-sm text-text-sub">Showing <strong className="text-text-heading">{results.length}</strong> results</span>
            <select className="bg-transparent border-none text-sm font-medium text-text-sub focus:ring-0 cursor-pointer">
              <option>Relevance</option>
              <option>Date (Newest)</option>
              <option>Date (Oldest)</option>
            </select>
          </div>

          {/* Result Cards */}
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`bg-surface-light border border-border-default rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all cursor-pointer group border-l-4 ${result.accent}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide ${result.categoryColor}`}>{result.category}</span>
                    <span className="text-sm text-text-light">{result.section}</span>
                  </div>
                  <button className="text-text-light hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                    <BookOpen className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="text-lg font-serif text-text-heading mb-2 group-hover:text-primary transition-colors leading-snug">{result.title}</h3>
                <p className="text-text-sub text-sm leading-relaxed mb-4 line-clamp-2">{result.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    {result.tags.map((tag) => (
                      <span key={tag} className="bg-background-light text-text-light text-xs px-2.5 py-1 rounded-md border border-border-subtle font-medium">#{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs font-medium text-text-sub bg-background-light border border-border-default px-3 py-1.5 rounded-lg hover:text-primary hover:border-primary/50 transition-all flex items-center gap-1.5">
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                    <button className="text-xs font-bold text-secondary-text bg-secondary hover:bg-secondary-hover px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
                      Insert <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
