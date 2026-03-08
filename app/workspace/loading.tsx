import { Loader2 } from 'lucide-react';

export default function WorkspaceLoading() {
  return (
    <div className="flex-1 w-full h-full flex flex-col p-8 animate-pulse bg-surface-light">
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 bg-gray-200/60 rounded-lg w-1/4"></div>
        <div className="h-10 bg-gray-200/60 rounded-xl w-32"></div>
      </div>
      
      <div className="flex-1 w-full">
        <div className="h-full bg-gray-200/40 rounded-3xl w-full border border-gray-100 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary/40 animate-spin" />
        </div>
      </div>
    </div>
  );
}
