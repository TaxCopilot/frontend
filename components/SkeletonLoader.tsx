'use client';

export function PageSkeleton() {
  return (
    <div className="flex-1 flex flex-col animate-pulse">
      <div className="h-16 bg-[#FAF9F5] border-b border-border-subtle" />
      <div className="flex-1 p-8 space-y-6">
        <div className="h-8 bg-[#FAF9F5] rounded-lg w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-[#FAF9F5] rounded-xl" />
          ))}
        </div>
        <div className="h-64 bg-[#FAF9F5] rounded-xl" />
      </div>
    </div>
  );
}

export function CaseCardSkeleton() {
  return (
    <div className="h-32 bg-[#FAF9F5] rounded-xl animate-pulse" />
  );
}

export function ChatSkeleton() {
  return (
    <div className="flex-1 flex flex-col gap-4 p-6 animate-pulse">
      <div className="h-12 bg-[#FAF9F5] rounded-xl w-3/4" />
      <div className="h-24 bg-[#FAF9F5] rounded-xl w-1/2" />
      <div className="h-16 bg-[#FAF9F5] rounded-xl w-2/3" />
    </div>
  );
}
